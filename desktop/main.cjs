"use strict";

const { app, BrowserWindow, desktopCapturer, dialog, ipcMain, Menu, net, Notification, screen, session, shell, Tray } = require("electron");
const { execFile, spawn } = require("node:child_process");
const { createHash } = require("node:crypto");
const { createWriteStream, mkdirSync, readFileSync, writeFileSync, unlinkSync } = require("node:fs");
const { join } = require("node:path");
const { Readable, Transform } = require("node:stream");
const { pipeline } = require("node:stream/promises");
const { pathToFileURL } = require("node:url");
const { normalizeWebsiteUrl, sameTrustedOrigin } = require("./url-config.cjs");
const { compareVersions, inferInstallerKind, isTrustedDownloadSource, normalizeHttpsUrl, selectInstaller, validateUpdateManifest } = require("./update-manager.cjs");
const {
  SETTING_TARGETS,
  CONTROL_TARGETS,
  CONTROL_ARGUMENTS,
  TOOL_TARGETS,
  FOLDER_TARGETS,
  DIAGNOSTIC_TARGETS,
  POWER_TARGETS,
  resolveTarget,
  publicTargets,
  parseStartAppsJson,
  findInstalledApps,
} = require("./windows-control.cjs");

const APP_ID = "com.kristian.jarvis.ai";
const SETUP_FILE = join(__dirname, "setup.html");
const SETUP_URL = pathToFileURL(SETUP_FILE).href;
let currentWindow = null;
let trustedWebsiteUrl = null;
let installedApps = new Map();
let installedAppsUpdatedAt = 0;
let updateCheckPromise = null;
let pendingUpdate = null;
let updateInstallLaunched = false;
let updateQuitInProgress = false;
let wakeWordProcess = null;
let wakeWordOutput = "";
let wakeWordReady = false;
let tray = null;
let trayNoticeShown = false;

const START_APPS_COMMAND = "Get-StartApps | Select-Object Name,AppID | ConvertTo-Json -Compress";
const INSTALL_TYPE_COMMAND = "$paths=@('HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'); Get-ItemProperty $paths -ErrorAction SilentlyContinue | Where-Object {$_.DisplayName -eq 'JARVIS AI'} | Select-Object DisplayName,WindowsInstaller,UninstallString | ConvertTo-Json -Compress";
const APP_CACHE_TTL_MS = 60_000;
const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1_000;
const UPDATE_MAX_BYTES = 500 * 1024 * 1024;
const IT_HEALTH_CHECK_COMMANDS = Object.freeze([
  Object.freeze({
    name: "Windows and hardware",
    executable: "systeminfo.exe",
    args: Object.freeze([]),
  }),
  Object.freeze({
    name: "Network configuration",
    executable: "ipconfig.exe",
    args: Object.freeze(["/all"]),
  }),
  Object.freeze({
    name: "Storage health",
    powershell: "$ErrorActionPreference='SilentlyContinue'; Get-CimInstance Win32_LogicalDisk -Filter \"DriveType=3\" | Select-Object DeviceID,VolumeName,@{N='SizeGB';E={[math]::Round($_.Size/1GB,1)}},@{N='FreeGB';E={[math]::Round($_.FreeSpace/1GB,1)}},@{N='FreePercent';E={if($_.Size){[math]::Round(100*$_.FreeSpace/$_.Size,1)}else{0}}} | Format-Table -AutoSize | Out-String -Width 180",
  }),
  Object.freeze({
    name: "Automatic services not running",
    powershell: "$ErrorActionPreference='SilentlyContinue'; Get-CimInstance Win32_Service | Where-Object {$_.StartMode -eq 'Auto' -and $_.State -ne 'Running'} | Select-Object -First 30 Name,DisplayName,State,StartMode | Format-Table -AutoSize | Out-String -Width 180",
  }),
  Object.freeze({
    name: "Recent Windows system warnings and errors",
    powershell: "$ErrorActionPreference='SilentlyContinue'; Get-WinEvent -FilterHashtable @{LogName='System';Level=1,2,3;StartTime=(Get-Date).AddDays(-2)} | Select-Object -First 20 TimeCreated,Id,ProviderName,LevelDisplayName,@{N='Message';E={($_.Message -replace '\\s+',' ').Substring(0,[Math]::Min(500,($_.Message -replace '\\s+',' ').Length))}} | Format-List | Out-String -Width 200",
  }),
]);

function websiteFile() {
  return join(app.getPath("userData"), "website.url");
}

function automaticUpdatePreferenceFile() {
  return join(app.getPath("userData"), "automatic-updates.preference");
}

function automaticUpdatesEnabled() {
  return readText(automaticUpdatePreferenceFile()).trim().toLowerCase() !== "disabled";
}

function setAutomaticUpdatesEnabled(enabled) {
  writeFileSync(automaticUpdatePreferenceFile(), enabled ? "enabled\r\n" : "disabled\r\n", { encoding: "utf8", mode: 0o600 });
}

function readText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function configuredWebsite() {
  const saved = normalizeWebsiteUrl(readText(websiteFile()));
  if (saved) return saved;
  return normalizeWebsiteUrl(readText(join(process.resourcesPath, "JARVIS_WEBSITE_URL.txt")));
}

function iconPath() {
  return app.isPackaged ? join(process.resourcesPath, "jarvis.ico") : join(__dirname, "..", "assets", "jarvis.ico");
}

function wakeWordScriptPath() {
  return app.isPackaged ? join(process.resourcesPath, "wake-word-listener.ps1") : join(__dirname, "wake-word-listener.ps1");
}

function showJarvisWindow(forceToFront = false) {
  if (!currentWindow || currentWindow.isDestroyed()) return;
  currentWindow.setSkipTaskbar(false);
  if (currentWindow.isMinimized()) currentWindow.restore();
  if (!currentWindow.isVisible()) currentWindow.show();
  currentWindow.focus();
  if (!forceToFront) return;
  try {
    currentWindow.setAlwaysOnTop(true, "pop-up-menu");
    currentWindow.moveTop();
    const releaseTop = setTimeout(() => {
      if (currentWindow && !currentWindow.isDestroyed()) currentWindow.setAlwaysOnTop(false);
    }, 1_200);
    releaseTop.unref();
  } catch {}
}

function trayWakeLabel() {
  if (wakeWordReady) return "Hey JARVIS: Listening";
  if (wakeWordProcess) return "Hey JARVIS: Starting";
  return "Hey JARVIS: Off";
}

function refreshTray() {
  if (!tray) return;
  tray.setToolTip(wakeWordReady ? "JARVIS AI — listening for Hey JARVIS" : "JARVIS AI — running in the system tray");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Open JARVIS", click: () => showJarvisWindow(true) },
    { label: trayWakeLabel(), enabled: false },
    { type: "separator" },
    { label: "Check for desktop update", click: () => { showJarvisWindow(); checkForDesktopUpdate(true); } },
    { type: "separator" },
    { label: "Exit JARVIS", click: () => app.quit() },
  ]));
}

function ensureTray() {
  if (tray) {
    refreshTray();
    return;
  }
  tray = new Tray(iconPath());
  tray.setTitle("JARVIS");
  tray.on("click", () => showJarvisWindow(true));
  tray.on("double-click", () => showJarvisWindow(true));
  refreshTray();
}

function destroyTray() {
  if (!tray) return;
  tray.destroy();
  tray = null;
}

function hideJarvisToTray() {
  if (!currentWindow || currentWindow.isDestroyed()) return;
  ensureTray();
  currentWindow.setSkipTaskbar(true);
  currentWindow.hide();
  refreshTray();
  if (trayNoticeShown || !Notification.isSupported()) return;
  trayNoticeShown = true;
  new Notification({
    title: "JARVIS is active in the system tray",
    body: wakeWordReady ? "Hey JARVIS is listening. Say the wake phrase to bring JARVIS forward." : "Select the tray icon to reopen JARVIS.",
    icon: iconPath(),
    silent: true,
  }).show();
}

function sendWakeWordEvent(channel, payload) {
  if (!currentWindow || currentWindow.isDestroyed() || !trustedWebsiteUrl) return;
  if (!sameTrustedOrigin(currentWindow.webContents.getURL(), trustedWebsiteUrl)) return;
  if (channel === "jarvis:wake-word") showJarvisWindow(true);
  currentWindow.webContents.send(channel, payload);
}

function stopWakeWordProcess() {
  const child = wakeWordProcess;
  wakeWordProcess = null;
  wakeWordOutput = "";
  wakeWordReady = false;
  refreshTray();
  if (!child) return;
  child.removeAllListeners();
  if (child.stdout) child.stdout.removeAllListeners();
  if (child.stderr) child.stderr.removeAllListeners();
  try { child.kill(); } catch {}
}

function handleWakeWordOutput(chunk) {
  wakeWordOutput += String(chunk || "").replace(/\u0000/g, "");
  const lines = wakeWordOutput.split(/\r?\n/);
  wakeWordOutput = lines.pop() || "";
  for (const line of lines) {
    if (line.startsWith("JARVIS_READY|")) {
      wakeWordReady = true;
      refreshTray();
      sendWakeWordEvent("jarvis:wake-word-status", { status: "listening", engine: "windows", language: line.slice(13, 29) });
      continue;
    }
    if (!line.startsWith("JARVIS_WAKE|")) continue;
    try {
      const transcript = Buffer.from(line.slice(12), "base64").toString("utf8").slice(0, 500);
      sendWakeWordEvent("jarvis:wake-word", { transcript, engine: "windows" });
    } catch {}
  }
}

function startWakeWordProcess() {
  if (wakeWordProcess) return { status: "listening", engine: "windows" };
  const child = spawn(
    windowsPath("WindowsPowerShell\\v1.0\\powershell.exe"),
    ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", wakeWordScriptPath()],
    { windowsHide: true, shell: false, stdio: ["ignore", "pipe", "pipe"] },
  );
  wakeWordProcess = child;
  wakeWordOutput = "";
  wakeWordReady = false;
  refreshTray();
  let errorDetail = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", handleWakeWordOutput);
  child.stderr.on("data", (chunk) => { errorDetail = `${errorDetail}${chunk}`.slice(-1_000); });
  child.once("error", (error) => {
    if (wakeWordProcess === child) wakeWordProcess = null;
    wakeWordReady = false;
    refreshTray();
    sendWakeWordEvent("jarvis:wake-word-status", { status: "error", message: String(error.message || "Windows wake-word recognition could not start.").slice(0, 240) });
  });
  child.once("exit", (code) => {
    if (wakeWordProcess !== child) return;
    wakeWordProcess = null;
    wakeWordReady = false;
    refreshTray();
    sendWakeWordEvent("jarvis:wake-word-status", {
      status: code === 0 ? "stopped" : "error",
      message: code === 0 ? "" : (errorDetail.trim() || "Windows wake-word recognition stopped unexpectedly.").slice(0, 240),
    });
  });
  return { status: "starting", engine: "windows" };
}

async function setWakeWordFromDesktop(event, enabled) {
  requireJarvisSender(event);
  if (!enabled) {
    stopWakeWordProcess();
    return { status: "stopped", engine: "windows" };
  }
  return startWakeWordProcess();
}

function validateJarvisSender(event) {
  if (!currentWindow || currentWindow.isDestroyed()) return false;
  if (!event?.senderFrame || event.sender !== currentWindow.webContents) return false;
  if (event.senderFrame !== event.sender.mainFrame) return false;
  return sameTrustedOrigin(event.senderFrame.url, trustedWebsiteUrl);
}

function requireJarvisSender(event) {
  if (!validateJarvisSender(event)) throw new Error("This computer action was blocked because it did not come from the configured JARVIS window.");
  if (process.platform !== "win32") throw new Error("Windows computer controls are available only in the installed JARVIS Windows app.");
}

function windowsPath(fileName) {
  const windowsRoot = process.env.SystemRoot || "C:\\Windows";
  return join(windowsRoot, "System32", fileName);
}

function runDetached(executable, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
      shell: false,
    });
    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

function targetExecutable(target) {
  return target.searchPath ? target.executable : windowsPath(target.executable);
}

function runCaptured(executable, args, timeout = 25_000) {
  return new Promise((resolve, reject) => {
    execFile(
      executable,
      args,
      { encoding: "utf8", maxBuffer: 3 * 1024 * 1024, timeout, windowsHide: true, shell: false },
      (error, stdout, stderr) => {
        if (error) {
          const detail = String(stderr || error.message || "The diagnostic command failed.").trim().slice(0, 2_000);
          reject(new Error(detail));
          return;
        }
        const output = String(stdout || stderr || "The command completed without text output.")
          .replace(/\u0000/g, "")
          .trim();
        resolve(output.length > 24_000 ? `${output.slice(0, 24_000)}\n\n[Output shortened by JARVIS]` : output);
      },
    );
  });
}

function runPowerShell(command) {
  return new Promise((resolve, reject) => {
    execFile(
      windowsPath("WindowsPowerShell\\v1.0\\powershell.exe"),
      ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", command],
      { encoding: "utf8", maxBuffer: 2 * 1024 * 1024, timeout: 20_000, windowsHide: true },
      (error, stdout) => error ? reject(error) : resolve(stdout),
    );
  });
}

function updateManifestUrl() {
  return trustedWebsiteUrl ? new URL("/api/desktop-update", trustedWebsiteUrl).href : null;
}

async function preferredInstallerKind() {
  try {
    return inferInstallerKind(await runPowerShell(INSTALL_TYPE_COMMAND));
  } catch {
    return "exe";
  }
}

async function fetchDesktopUpdateManifest() {
  const endpoint = updateManifestUrl();
  if (!endpoint) throw new Error("The JARVIS website is not linked yet.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await net.fetch(endpoint, {
      method: "GET",
      headers: { accept: "application/json", "x-jarvis-desktop-version": app.getVersion() },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`The update service returned HTTP ${response.status}.`);
    return validateUpdateManifest(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}

async function downloadVerifiedInstaller(release, installer) {
  const extension = installer.kind === "msi" ? ".msi" : ".exe";
  if (!isTrustedDownloadSource(installer.url, "", extension)) {
    throw new Error("The installer address is not a trusted HTTPS download.");
  }
  const updateDirectory = join(app.getPath("temp"), "JARVIS-AI-Updates");
  mkdirSync(updateDirectory, { recursive: true });
  const destination = join(updateDirectory, `JARVIS-AI-${release.version}-${installer.kind}-${Date.now()}${extension}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15 * 60_000);
  try {
    const response = await net.fetch(installer.url, { method: "GET", cache: "no-store", signal: controller.signal });
    if (!response.ok || !response.body) throw new Error(`The installer download returned HTTP ${response.status}.`);
    if (!isTrustedDownloadSource(installer.url, response.url, extension)) {
      throw new Error("The installer redirected to an untrusted address.");
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > UPDATE_MAX_BYTES) throw new Error("The installer is larger than the 500 MB safety limit.");
    let received = 0;
    const hash = createHash("sha256");
    const verifier = new Transform({
      transform(chunk, _encoding, callback) {
        received += chunk.length;
        if (received > UPDATE_MAX_BYTES) {
          callback(new Error("The installer exceeded the 500 MB safety limit."));
          return;
        }
        hash.update(chunk);
        callback(null, chunk);
      },
    });
    await pipeline(Readable.fromWeb(response.body), verifier, createWriteStream(destination, { flags: "wx", mode: 0o600 }));
    if (hash.digest("hex") !== installer.sha256) throw new Error("The installer failed SHA-256 verification and was deleted.");
    return Object.freeze({ ...installer, version: release.version, path: destination });
  } catch (error) {
    try { unlinkSync(destination); } catch {}
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function launchDeferredInstaller(update) {
  if (!update || updateInstallLaunched || process.platform !== "win32") return Promise.resolve(false);
  const executable = update.kind === "msi" ? windowsPath("msiexec.exe") : update.path;
  const args = update.kind === "msi" ? ["/i", update.path] : [];
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      detached: true,
      stdio: "ignore",
      windowsHide: false,
      shell: false,
    });
    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      updateInstallLaunched = true;
      resolve(true);
    });
  });
}

async function presentPendingUpdate(manual) {
  if (!pendingUpdate) return;
  if (!manual) {
    if (Notification.isSupported()) {
      new Notification({
        title: `JARVIS ${pendingUpdate.version} is ready`,
        body: "The verified Windows installer will open when you close JARVIS.",
        icon: iconPath(),
      }).show();
    }
    return;
  }
  const result = await dialog.showMessageBox(currentWindow, {
    type: "info",
    title: "JARVIS update ready",
    message: `JARVIS ${pendingUpdate.version} is verified and ready to install.`,
    detail: "Windows will open the verified installer, then JARVIS will close. Complete the installer and select Run JARVIS on its finish screen.",
    buttons: ["Open installer and close JARVIS", "Later"],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });
  if (result.response === 0) app.quit();
}

async function performDesktopUpdateCheck(manual = false) {
  if (!app.isPackaged || process.platform !== "win32") {
    if (manual) await dialog.showMessageBox(currentWindow, { type: "info", title: "JARVIS desktop update", message: "Desktop updates are checked by the installed Windows EXE/MSI edition." });
    return;
  }
  if (pendingUpdate) {
    await presentPendingUpdate(manual);
    return;
  }
  const manifest = await fetchDesktopUpdateManifest();
  if (!manifest.enabled) {
    if (manual) await dialog.showMessageBox(currentWindow, { type: "info", title: "JARVIS desktop update", message: "Automatic desktop releases are not configured yet.", detail: manifest.reason });
    return;
  }
  if (compareVersions(manifest.version, app.getVersion()) <= 0) {
    if (manual) await dialog.showMessageBox(currentWindow, { type: "info", title: "JARVIS is up to date", message: `Version ${app.getVersion()} is the latest desktop version.` });
    return;
  }
  const installer = selectInstaller(manifest, await preferredInstallerKind());
  if (!installer) throw new Error("The release does not include a compatible Windows installer.");
  pendingUpdate = await downloadVerifiedInstaller(manifest, installer);
  installApplicationMenu();
  await presentPendingUpdate(manual);
}

function checkForDesktopUpdate(manual = false) {
  if (updateCheckPromise) return updateCheckPromise;
  updateCheckPromise = performDesktopUpdateCheck(manual)
    .catch(async (error) => {
      if (manual) {
        await dialog.showMessageBox(currentWindow, {
          type: "error",
          title: "JARVIS update unavailable",
          message: "JARVIS could not complete the desktop update check.",
          detail: error instanceof Error ? error.message : "Unknown update error.",
        });
      } else {
        console.error("JARVIS automatic update check failed:", error);
      }
    })
    .finally(() => { updateCheckPromise = null; });
  return updateCheckPromise;
}

function scheduleAutomaticUpdateChecks() {
  if (!app.isPackaged || process.platform !== "win32") return;
  const initial = setTimeout(() => {
    if (automaticUpdatesEnabled()) checkForDesktopUpdate(false);
  }, 12_000);
  initial.unref();
  const recurring = setInterval(() => {
    if (automaticUpdatesEnabled()) checkForDesktopUpdate(false);
  }, UPDATE_CHECK_INTERVAL_MS);
  recurring.unref();
}

async function confirmComputerAction(title, detail, actionLabel = "Open") {
  const result = await dialog.showMessageBox(currentWindow, {
    type: "question",
    title: "JARVIS computer action",
    message: title,
    detail: `${detail}\n\nJARVIS will only open this item. It will not change settings automatically.`,
    buttons: [actionLabel, "Cancel"],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });
  return result.response === 0;
}

async function confirmCriticalComputerAction(target) {
  const warning = await dialog.showMessageBox(currentWindow, {
    type: "warning",
    title: "JARVIS critical computer action",
    message: `${target.name}?`,
    detail: "This action can close your Windows session or interrupt your work. Save every open document before continuing.",
    buttons: ["Continue", "Cancel"],
    defaultId: 1,
    cancelId: 1,
    noLink: true,
  });
  if (warning.response !== 0) return false;
  const finalCheck = await dialog.showMessageBox(currentWindow, {
    type: "warning",
    title: "Final JARVIS confirmation",
    message: `Final confirmation: ${target.name}?`,
    detail: "JARVIS will run only this fixed Windows action. Select Cancel if you have any unsaved work.",
    buttons: ["Confirm action", "Cancel"],
    defaultId: 1,
    cancelId: 1,
    noLink: true,
  });
  return finalCheck.response === 0;
}

async function discoverInstalledApps(force = false) {
  if (!force && installedApps.size && Date.now() - installedAppsUpdatedAt < APP_CACHE_TTL_MS) {
    return [...installedApps.values()];
  }
  const rows = parseStartAppsJson(await runPowerShell(START_APPS_COMMAND));
  const next = new Map();
  for (const row of rows) {
    const token = createHash("sha256").update(row.appId, "utf8").digest("hex");
    next.set(token, Object.freeze({ ...row, token }));
  }
  installedApps = next;
  installedAppsUpdatedAt = Date.now();
  return [...installedApps.values()];
}

async function desktopCapabilities(event) {
  requireJarvisSender(event);
  return {
    available: true,
    platform: "windows",
    desktopVersion: app.getVersion(),
    automaticUpdates: automaticUpdatesEnabled(),
    updateReady: pendingUpdate ? pendingUpdate.version : "",
    confirmationRequired: true,
    screenCapture: true,
    itHealthCheck: true,
    wakeWord: true,
    wakeWordEngine: "windows",
    systemTray: true,
    wakeWordWhileHidden: true,
    settings: publicTargets(SETTING_TARGETS),
    controlPanels: publicTargets(CONTROL_TARGETS),
    tools: publicTargets(TOOL_TARGETS),
    folders: publicTargets(FOLDER_TARGETS),
    diagnostics: publicTargets(DIAGNOSTIC_TARGETS),
    powerActions: publicTargets(POWER_TARGETS),
  };
}

async function captureScreenFromDesktop(event) {
  requireJarvisSender(event);
  const approved = await dialog.showMessageBox(currentWindow, {
    type: "question",
    title: "JARVIS Screen Vision",
    message: "Capture the primary screen for one-time AI analysis?",
    detail: "JARVIS will capture one reduced-size image after you confirm. It will be sent to your configured JARVIS AI provider with your question. Continuous recording is never enabled.",
    buttons: ["Capture once", "Cancel"],
    defaultId: 1,
    cancelId: 1,
    noLink: true,
  });
  if (approved.response !== 0) return { status: "cancelled", target: "Primary screen" };

  const display = screen.getPrimaryDisplay();
  const scale = Math.min(1, 1600 / Math.max(1, display.size.width), 1000 / Math.max(1, display.size.height));
  const thumbnailSize = {
    width: Math.max(1, Math.round(display.size.width * scale)),
    height: Math.max(1, Math.round(display.size.height * scale)),
  };
  const sources = await desktopCapturer.getSources({ types: ["screen"], thumbnailSize, fetchWindowIcons: false });
  const source = sources.find((candidate) => String(candidate.display_id) === String(display.id)) || sources[0];
  if (!source || source.thumbnail.isEmpty()) throw new Error("Windows did not return a usable screen image.");
  const jpeg = source.thumbnail.toJPEG(82);
  if (jpeg.byteLength > 2_000_000) throw new Error("The screen image exceeded JARVIS's 2 MB vision safety limit.");
  return {
    status: "captured",
    target: source.name || "Primary screen",
    width: thumbnailSize.width,
    height: thumbnailSize.height,
    dataUrl: `data:image/jpeg;base64,${jpeg.toString("base64")}`,
  };
}

async function runItHealthCheckFromDesktop(event) {
  requireJarvisSender(event);
  const approved = await dialog.showMessageBox(currentWindow, {
    type: "question",
    title: "JARVIS Windows IT Copilot",
    message: "Run the read-only Windows IT health check?",
    detail: "The check reads Windows, network, storage, service, and recent System event information. It does not repair, stop, install, delete, or change anything. The report may be sent to your configured AI provider for analysis.",
    buttons: ["Run health check", "Cancel"],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });
  if (approved.response !== 0) return { status: "cancelled", target: "Windows IT health check" };

  const results = await Promise.allSettled(IT_HEALTH_CHECK_COMMANDS.map((check) =>
    check.powershell
      ? runPowerShell(check.powershell)
      : runCaptured(windowsPath(check.executable), [...check.args]),
  ));
  const sections = IT_HEALTH_CHECK_COMMANDS.map((check, index) => {
    const result = results[index];
    const output = result.status === "fulfilled"
      ? String(result.value || "No findings returned.").trim()
      : `Check unavailable: ${String(result.reason?.message || result.reason || "Unknown error").slice(0, 1_000)}`;
    return `### ${check.name}\n${output.slice(0, 18_000)}`;
  });
  return {
    status: "completed",
    target: "Windows IT health check",
    sections: sections.length,
    output: sections.join("\n\n").slice(0, 60_000),
  };
}

async function findAppsFromDesktop(event, rawQuery) {
  requireJarvisSender(event);
  const query = String(rawQuery || "").slice(0, 120);
  const ranked = findInstalledApps(query, await discoverInstalledApps(), query ? 8 : 20);
  return {
    query,
    matches: ranked.map(({ app: found, exact }) => ({ token: found.token, name: found.name, exact })),
    source: "Windows Start menu",
  };
}

async function openAppFromDesktop(event, rawToken) {
  requireJarvisSender(event);
  const token = String(rawToken || "").slice(0, 128);
  if (!installedApps.has(token)) await discoverInstalledApps(true);
  const found = installedApps.get(token);
  if (!found) return { status: "not_found" };
  if (!await confirmComputerAction(`Open ${found.name}?`, "This installed app was found in your Windows Start menu.")) {
    return { status: "cancelled", target: found.name };
  }
  await runDetached(windowsPath("explorer.exe"), [`shell:AppsFolder\\${found.appId}`]);
  return { status: "opened", target: found.name };
}

async function openSettingFromDesktop(event, rawQuery) {
  requireJarvisSender(event);
  const target = resolveTarget(String(rawQuery || "").slice(0, 120), SETTING_TARGETS);
  if (!target) return { status: "not_found" };
  if (!await confirmComputerAction(`Open ${target.name}?`, "This is an allowlisted Windows Settings page.")) {
    return { status: "cancelled", target: target.name };
  }
  await shell.openExternal(target.uri);
  return { status: "opened", target: target.name };
}

async function openControlPanelFromDesktop(event, rawQuery) {
  requireJarvisSender(event);
  const target = resolveTarget(String(rawQuery || "").slice(0, 120), CONTROL_TARGETS);
  if (!target) return { status: "not_found" };
  if (!await confirmComputerAction(`Open ${target.name}?`, "This is an allowlisted classic Control Panel item.")) {
    return { status: "cancelled", target: target.name };
  }
  await runDetached(windowsPath("control.exe"), CONTROL_ARGUMENTS[target.key]);
  return { status: "opened", target: target.name };
}

async function openToolFromDesktop(event, rawQuery) {
  requireJarvisSender(event);
  const target = resolveTarget(String(rawQuery || "").slice(0, 120), TOOL_TARGETS);
  if (!target) return { status: "not_found" };
  if (!await confirmComputerAction(`Open ${target.name}?`, "This is an allowlisted Windows utility. JARVIS will not type or run commands inside it.")) {
    return { status: "cancelled", target: target.name };
  }
  await runDetached(targetExecutable(target), target.args);
  return { status: "opened", target: target.name };
}

async function openFolderFromDesktop(event, rawQuery) {
  requireJarvisSender(event);
  const target = resolveTarget(String(rawQuery || "").slice(0, 120), FOLDER_TARGETS);
  if (!target) return { status: "not_found" };
  if (!await confirmComputerAction(`Open ${target.name}?`, "This is an allowlisted Windows folder location.")) {
    return { status: "cancelled", target: target.name };
  }
  if (target.pathName) {
    const error = await shell.openPath(app.getPath(target.pathName));
    if (error) throw new Error(error);
  } else {
    await runDetached(windowsPath("explorer.exe"), [target.explorerArg]);
  }
  return { status: "opened", target: target.name };
}

async function runDiagnosticFromDesktop(event, rawQuery) {
  requireJarvisSender(event);
  const target = resolveTarget(String(rawQuery || "").slice(0, 120), DIAGNOSTIC_TARGETS);
  if (!target) return { status: "not_found" };
  if (!await confirmComputerAction(`Run ${target.name}?`, "The read-only result will appear in this JARVIS conversation and may synchronize when cloud sync is enabled.", "Run diagnostic")) {
    return { status: "cancelled", target: target.name };
  }
  const output = await runCaptured(targetExecutable(target), target.args);
  return { status: "completed", target: target.name, output };
}

async function runPowerActionFromDesktop(event, rawQuery) {
  requireJarvisSender(event);
  const target = resolveTarget(String(rawQuery || "").slice(0, 120), POWER_TARGETS);
  if (!target) return { status: "not_found" };
  if (!await confirmCriticalComputerAction(target)) return { status: "cancelled", target: target.name };
  await runDetached(targetExecutable(target), target.args);
  return { status: "started", target: target.name };
}

function commonWindowOptions() {
  return {
    width: 1440,
    height: 940,
    minWidth: 420,
    minHeight: 640,
    backgroundColor: "#02080d",
    icon: iconPath(),
    show: false,
    autoHideMenuBar: true,
  };
}

function showWhenReady(window) {
  window.once("ready-to-show", () => {
    window.show();
    window.focus();
  });
}

function createSetupWindow(message = "") {
  stopWakeWordProcess();
  destroyTray();
  if (currentWindow && !currentWindow.isDestroyed()) currentWindow.destroy();
  trustedWebsiteUrl = null;
  currentWindow = new BrowserWindow({
    ...commonWindowOptions(),
    width: 760,
    height: 680,
    minWidth: 420,
    minHeight: 600,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, "setup-preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });
  showWhenReady(currentWindow);
  if (message) currentWindow.loadFile(SETUP_FILE, { query: { message } });
  else currentWindow.loadFile(SETUP_FILE);
  currentWindow.on("closed", () => { stopWakeWordProcess(); currentWindow = null; });
}

function configureTrustedSession(websiteUrl) {
  const trustedOrigin = new URL(websiteUrl).origin;
  const jarvisSession = session.fromPartition("persist:jarvis");
  const permissionAllowed = (requestingUrl, permission) => {
    let origin;
    try { origin = new URL(requestingUrl).origin; } catch { return false; }
    return origin === trustedOrigin && ["media", "clipboard-sanitized-write", "notifications"].includes(permission);
  };
  jarvisSession.setPermissionCheckHandler((_webContents, permission, requestingOrigin) => permissionAllowed(requestingOrigin, permission));
  jarvisSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    callback(permissionAllowed(details.requestingUrl || "", permission));
  });
  return jarvisSession;
}

function createJarvisWindow(websiteUrl) {
  stopWakeWordProcess();
  if (currentWindow && !currentWindow.isDestroyed()) currentWindow.destroy();
  trustedWebsiteUrl = websiteUrl;
  configureTrustedSession(websiteUrl);
  currentWindow = new BrowserWindow({
    ...commonWindowOptions(),
    title: "JARVIS AI",
    webPreferences: {
      partition: "persist:jarvis",
      preload: join(__dirname, "jarvis-preload.cjs"),
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      navigateOnDragDrop: false,
      spellcheck: true,
    },
  });

  currentWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });
  currentWindow.webContents.on("will-navigate", (event, url) => {
    if (sameTrustedOrigin(url, trustedWebsiteUrl)) return;
    event.preventDefault();
    if (url.startsWith("https://")) shell.openExternal(url);
  });
  currentWindow.webContents.on("will-attach-webview", (event) => event.preventDefault());
  currentWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedUrl, isMainFrame) => {
    if (!isMainFrame || errorCode === -3) return;
    dialog.showMessageBox(currentWindow, {
      type: "error",
      title: "JARVIS connection unavailable",
      message: "JARVIS could not open the configured website.",
      detail: `${errorDescription}\n${validatedUrl}\n\nCheck your connection or press Alt, then choose JARVIS → Change website address.`,
    });
  });
  showWhenReady(currentWindow);
  currentWindow.loadURL(websiteUrl);
  ensureTray();
  currentWindow.on("minimize", (event) => {
    event.preventDefault();
    hideJarvisToTray();
  });
  currentWindow.on("closed", () => { stopWakeWordProcess(); currentWindow = null; });
}

function saveWebsiteFromSetup(event, rawUrl) {
  if (!event.senderFrame || event.senderFrame.url.split("?")[0] !== SETUP_URL) {
    throw new Error("The website address can only be changed from the local JARVIS setup screen.");
  }
  const normalized = normalizeWebsiteUrl(rawUrl);
  if (!normalized) throw new Error("Enter a complete HTTPS address, such as https://jarvis.example.workers.dev");
  writeFileSync(websiteFile(), `${normalized}\r\n`, { encoding: "utf8", mode: 0o600 });
  createJarvisWindow(normalized);
  return normalized;
}

function installApplicationMenu() {
  const template = [
    {
      label: "JARVIS",
      submenu: [
        { label: "Change website address", click: () => createSetupWindow("Enter the replacement HTTPS address.") },
        { type: "separator" },
        { label: `Desktop version ${app.getVersion()}`, enabled: false },
        { label: "Check for desktop update", click: () => checkForDesktopUpdate(true) },
        {
          label: "Automatic desktop updates",
          type: "checkbox",
          checked: automaticUpdatesEnabled(),
          click: (item) => setAutomaticUpdatesEnabled(item.checked),
        },
        { label: "Open downloaded Windows installer", enabled: Boolean(pendingUpdate), click: () => app.quit() },
        { type: "separator" },
        { role: "quit", label: "Exit JARVIS" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload", label: "Reload JARVIS" },
        { role: "togglefullscreen", label: "Full screen" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function showUpdateResultConfirmation() {
  const updated = process.argv.includes("--updated");
  const failed = process.argv.some((argument) => argument.startsWith("--update-failed="));
  if (!updated && !failed) return;
  const timer = setTimeout(() => {
    if (!currentWindow || currentWindow.isDestroyed()) return;
    dialog.showMessageBox(currentWindow, {
      type: updated ? "info" : "error",
      title: updated ? "JARVIS update complete" : "JARVIS update failed",
      message: updated ? "Update test successful" : "The automatic installer could not complete.",
      detail: updated
        ? `JARVIS desktop version ${app.getVersion()} is now installed and running.`
        : "JARVIS reopened without changing the installed version. Download the release installer manually or try the update again.",
      buttons: ["Continue"],
      defaultId: 0,
      noLink: true,
    });
  }, 1_500);
  timer.unref();
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.setAppUserModelId(APP_ID);
  ipcMain.handle("jarvis:save-website", saveWebsiteFromSetup);
  ipcMain.handle("jarvis:cancel-setup", () => app.quit());
  ipcMain.handle("jarvis:desktop-capabilities", desktopCapabilities);
  ipcMain.handle("jarvis:find-apps", findAppsFromDesktop);
  ipcMain.handle("jarvis:open-app", openAppFromDesktop);
  ipcMain.handle("jarvis:open-setting", openSettingFromDesktop);
  ipcMain.handle("jarvis:open-control-panel", openControlPanelFromDesktop);
  ipcMain.handle("jarvis:open-tool", openToolFromDesktop);
  ipcMain.handle("jarvis:open-folder", openFolderFromDesktop);
  ipcMain.handle("jarvis:run-diagnostic", runDiagnosticFromDesktop);
  ipcMain.handle("jarvis:run-it-health-check", runItHealthCheckFromDesktop);
  ipcMain.handle("jarvis:capture-screen", captureScreenFromDesktop);
  ipcMain.handle("jarvis:power-action", runPowerActionFromDesktop);
  ipcMain.handle("jarvis:set-wake-word", setWakeWordFromDesktop);
  app.on("second-instance", () => {
    if (!currentWindow || currentWindow.isDestroyed()) return;
    showJarvisWindow(true);
  });
  app.whenReady().then(() => {
    installApplicationMenu();
    if (process.argv.includes("--reset-website")) {
      try { unlinkSync(websiteFile()); } catch {}
    }
    const websiteUrl = configuredWebsite();
    if (websiteUrl) createJarvisWindow(websiteUrl);
    else createSetupWindow();
    scheduleAutomaticUpdateChecks();
    showUpdateResultConfirmation();
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length) return;
    const websiteUrl = configuredWebsite();
    if (websiteUrl) createJarvisWindow(websiteUrl);
    else createSetupWindow();
  });
  app.on("window-all-closed", () => { stopWakeWordProcess(); destroyTray(); app.quit(); });
  app.on("before-quit", (event) => {
    const wakeWasActive = Boolean(wakeWordProcess);
    stopWakeWordProcess();
    if (!pendingUpdate || updateInstallLaunched) return;
    event.preventDefault();
    if (updateQuitInProgress) return;
    updateQuitInProgress = true;
    launchDeferredInstaller(pendingUpdate)
      .then((started) => {
        if (!started) throw new Error("The Windows installer helper did not start.");
        app.quit();
      })
      .catch(async (error) => {
        updateQuitInProgress = false;
        if (!currentWindow || currentWindow.isDestroyed()) return;
        ensureTray();
        if (wakeWasActive) startWakeWordProcess();
        showJarvisWindow(true);
        await dialog.showMessageBox(currentWindow, {
          type: "error",
          title: "JARVIS update could not start",
          message: "JARVIS stayed open because the Windows installer helper could not start.",
          detail: error instanceof Error ? error.message : "Unknown installer launch error.",
          buttons: ["Continue"],
          defaultId: 0,
          noLink: true,
        });
      });
  });
  app.on("will-quit", destroyTray);
}
