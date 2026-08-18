"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  SETTING_TARGETS,
  CONTROL_TARGETS,
  CONTROL_ARGUMENTS,
  TOOL_TARGETS,
  FOLDER_TARGETS,
  DIAGNOSTIC_TARGETS,
  POWER_TARGETS,
  resolveTarget,
  parseStartAppsJson,
  findInstalledApps,
} = require("../windows-control.cjs");

test("resolves common Windows Settings requests only to allowlisted URIs", () => {
  assert.equal(resolveTarget("open bluetooth settings", SETTING_TARGETS).uri, "ms-settings:bluetooth");
  assert.equal(resolveTarget("show installed apps", SETTING_TARGETS).uri, "ms-settings:appsfeatures");
  assert.equal(resolveTarget("Windows Update history", SETTING_TARGETS).uri, "ms-settings:windowsupdate-history");
  assert.equal(resolveTarget("run calc.exe", SETTING_TARGETS), null);
  assert.ok(SETTING_TARGETS.length >= 90);
  assert.ok(SETTING_TARGETS.every((item) => /^ms-settings:[a-z0-9-]*$/i.test(item.uri)));
});

test("resolves only fixed classic Control Panel targets", () => {
  assert.equal(resolveTarget("open control panel", CONTROL_TARGETS).key, "control-panel");
  assert.deepEqual(CONTROL_ARGUMENTS[resolveTarget("programs and features", CONTROL_TARGETS).key], ["appwiz.cpl"]);
  assert.equal(resolveTarget("powershell remove-item", CONTROL_TARGETS), null);
});

test("parses and searches the Windows Start-menu application list", () => {
  const apps = parseStartAppsJson(JSON.stringify([
    { Name: "Microsoft Word", AppID: "Microsoft.Office.WINWORD.EXE.15" },
    { Name: "Google Chrome", AppID: "Chrome" },
    { Name: "Duplicate Chrome", AppID: "Chrome" },
    { Name: "", AppID: "MissingName" },
  ]));
  assert.equal(apps.length, 2);
  assert.equal(findInstalledApps("chrome", apps)[0].app.name, "Google Chrome");
  assert.equal(findInstalledApps("Microsoft Word", apps)[0].exact, true);
  assert.deepEqual(findInstalledApps("cmd /c whoami", apps), []);
});

test("adds Windows tools and folders without weakening the existing allowlists", () => {
  assert.equal(resolveTarget("task manager", TOOL_TARGETS).executable, "taskmgr.exe");
  assert.equal(resolveTarget("device manager", TOOL_TARGETS).args[0], "devmgmt.msc");
  assert.equal(resolveTarget("downloads", FOLDER_TARGETS).pathName, "downloads");
  assert.equal(resolveTarget("recycle bin", FOLDER_TARGETS).explorerArg, "shell:RecycleBinFolder");
  assert.ok(TOOL_TARGETS.length >= 25);
  assert.ok(FOLDER_TARGETS.length >= 12);
});

test("limits diagnostics and PC actions to fixed argument arrays", () => {
  assert.deepEqual(resolveTarget("ipconfig", DIAGNOSTIC_TARGETS).args, ["/all"]);
  assert.deepEqual(resolveTarget("netstat", DIAGNOSTIC_TARGETS).args, ["-ano"]);
  assert.deepEqual(resolveTarget("restart", POWER_TARGETS).args, ["/r", "/t", "0"]);
  assert.deepEqual(resolveTarget("shutdown", POWER_TARGETS).args, ["/s", "/t", "0"]);
  assert.ok(!POWER_TARGETS.some((item) => item.args.includes("/f")));
  const catalog = JSON.stringify({ TOOL_TARGETS, DIAGNOSTIC_TARGETS, POWER_TARGETS }).toLowerCase();
  assert.doesNotMatch(catalog, /diskpart|format\.com|remove-item|taskkill|del\.exe/);
});
