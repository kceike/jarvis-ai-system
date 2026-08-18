"use strict";

function target(key, name, uri, aliases = []) {
  return Object.freeze({ key, name, uri, aliases: Object.freeze(aliases) });
}

const SETTING_TARGETS = Object.freeze([
  target("settings-home", "Windows Settings", "ms-settings:", ["settings", "windows settings", "settings home"]),
  target("about", "About this PC", "ms-settings:about", ["about", "system information", "device specifications"]),
  target("activation", "Windows activation", "ms-settings:activation", ["activation", "windows license"]),
  target("advanced-display", "Advanced display", "ms-settings:display-advanced", ["advanced display", "monitor refresh rate"]),
  target("advanced-network", "Advanced network settings", "ms-settings:network-advancedsettings", ["advanced network", "network adapters"]),
  target("airplane-mode", "Airplane mode", "ms-settings:network-airplanemode", ["airplane mode", "flight mode"]),
  target("apps", "Installed apps", "ms-settings:appsfeatures", ["apps", "installed apps", "apps and features", "uninstall apps"]),
  target("apps-websites", "Apps for websites", "ms-settings:appsforwebsites", ["apps for websites", "website apps"]),
  target("autoplay", "AutoPlay", "ms-settings:autoplay", ["autoplay"]),
  target("battery", "Battery", "ms-settings:batterysaver", ["battery", "battery saver"]),
  target("battery-usage", "Battery usage", "ms-settings:batterysaver-usagedetails", ["battery usage", "battery details"]),
  target("bluetooth", "Bluetooth", "ms-settings:bluetooth", ["bluetooth", "bluetooth and devices"]),
  target("camera", "Camera settings", "ms-settings:camera", ["camera", "webcam device"]),
  target("clipboard", "Clipboard", "ms-settings:clipboard", ["clipboard", "clipboard history"]),
  target("color-filters", "Color filters", "ms-settings:easeofaccess-colorfilter", ["color filters", "colour filters"]),
  target("colors", "Personalization colors", "ms-settings:personalization-colors", ["colors", "colours", "accent color"]),
  target("connected-devices", "Connected devices", "ms-settings:connecteddevices", ["connected devices", "devices"]),
  target("control-center", "Control center", "ms-settings:controlcenter", ["control center", "quick settings"]),
  target("date-time", "Date and time", "ms-settings:dateandtime", ["date", "time", "date and time", "clock"]),
  target("default-apps", "Default apps", "ms-settings:defaultapps", ["default apps", "file associations"]),
  target("delivery-optimization", "Delivery Optimization", "ms-settings:delivery-optimization", ["delivery optimization", "update bandwidth"]),
  target("developers", "For developers", "ms-settings:developers", ["developer settings", "for developers", "developer mode"]),
  target("device-encryption", "Device encryption", "ms-settings:deviceencryption", ["device encryption", "encryption", "bitlocker settings"]),
  target("device-usage", "Device usage", "ms-settings:deviceusage", ["device usage"]),
  target("disks-volumes", "Disks and volumes", "ms-settings:disksandvolumes", ["disks", "volumes", "disks and volumes"]),
  target("display", "Display", "ms-settings:display", ["display", "screen", "monitor"]),
  target("dynamic-lighting", "Dynamic Lighting", "ms-settings:personalization-lighting", ["dynamic lighting", "rgb lighting"]),
  target("email-accounts", "Email and app accounts", "ms-settings:emailandaccounts", ["email accounts", "app accounts"]),
  target("energy", "Energy recommendations", "ms-settings:energyrecommendations", ["energy recommendations", "energy"]),
  target("ethernet", "Ethernet", "ms-settings:network-ethernet", ["ethernet", "lan"]),
  target("family", "Family", "ms-settings:family-group", ["family", "family safety"]),
  target("find-device", "Find my device", "ms-settings:findmydevice", ["find my device", "find device"]),
  target("focus", "Focus", "ms-settings:quiethours", ["focus", "focus assist", "do not disturb"]),
  target("fonts", "Fonts", "ms-settings:fonts", ["fonts", "installed fonts"]),
  target("gaming-bar", "Game Bar", "ms-settings:gaming-gamebar", ["game bar", "xbox game bar"]),
  target("gaming-captures", "Gaming captures", "ms-settings:gaming-gamedvr", ["game captures", "game dvr"]),
  target("gaming-mode", "Game Mode", "ms-settings:gaming-gamemode", ["game mode"]),
  target("graphics", "Graphics", "ms-settings:display-advancedgraphics", ["graphics", "gpu settings", "graphics settings"]),
  target("hearing", "Hearing devices", "ms-settings:easeofaccess-hearingaids", ["hearing devices", "hearing aids"]),
  target("high-contrast", "Contrast themes", "ms-settings:easeofaccess-highcontrast", ["high contrast", "contrast themes"]),
  target("keyboard-accessibility", "Accessibility keyboard", "ms-settings:easeofaccess-keyboard", ["accessibility keyboard", "sticky keys", "filter keys"]),
  target("known-networks", "Manage known Wi-Fi networks", "ms-settings:network-wifisettings", ["known networks", "saved wifi", "manage wifi"]),
  target("language", "Language and region", "ms-settings:regionlanguage", ["language", "language and region", "keyboard language"]),
  target("location", "Location privacy", "ms-settings:privacy-location", ["location", "location privacy"]),
  target("lock-screen", "Lock screen", "ms-settings:lockscreen", ["lock screen"]),
  target("magnifier", "Magnifier", "ms-settings:easeofaccess-magnifier", ["magnifier", "zoom accessibility"]),
  target("microphone", "Microphone privacy", "ms-settings:privacy-microphone", ["microphone", "mic privacy", "microphone privacy"]),
  target("mobile-hotspot", "Mobile hotspot", "ms-settings:network-mobilehotspot", ["mobile hotspot", "hotspot"]),
  target("mouse-touchpad", "Mouse and touchpad", "ms-settings:mousetouchpad", ["mouse", "mouse and touchpad"]),
  target("multitasking", "Multitasking", "ms-settings:multitasking", ["multitasking", "snap windows"]),
  target("narrator", "Narrator", "ms-settings:easeofaccess-narrator", ["narrator", "screen reader"]),
  target("network", "Network and internet", "ms-settings:network-status", ["network", "network and internet", "internet"]),
  target("night-light", "Night light", "ms-settings:nightlight", ["night light", "blue light"]),
  target("notifications", "Notifications", "ms-settings:notifications", ["notifications", "notification settings"]),
  target("optional-features", "Optional features", "ms-settings:optionalfeatures", ["optional features", "windows features"]),
  target("other-users", "Other users", "ms-settings:otherusers", ["other users", "family and other users"]),
  target("pen", "Pen and Windows Ink", "ms-settings:pen", ["pen", "windows ink", "stylus"]),
  target("personalization", "Personalization", "ms-settings:personalization", ["personalization", "personalisation"]),
  target("phone-link", "Mobile devices and Phone Link", "ms-settings:mobile-devices", ["phone link", "mobile devices", "your phone"]),
  target("power", "Power and battery", "ms-settings:powersleep", ["power", "sleep", "power and battery", "power and sleep"]),
  target("presence", "Presence sensing", "ms-settings:presence", ["presence sensing", "presence"]),
  target("printers", "Printers and scanners", "ms-settings:printers", ["printers", "scanners", "printers and scanners"]),
  target("privacy", "Privacy", "ms-settings:privacy", ["privacy", "privacy and security"]),
  target("privacy-account", "Account info privacy", "ms-settings:privacy-accountinfo", ["account info privacy"]),
  target("privacy-app-diagnostics", "App diagnostics privacy", "ms-settings:privacy-appdiagnostics", ["app diagnostics privacy"]),
  target("privacy-calendar", "Calendar privacy", "ms-settings:privacy-calendar", ["calendar privacy"]),
  target("privacy-camera", "Camera privacy", "ms-settings:privacy-webcam", ["camera privacy", "webcam privacy"]),
  target("privacy-contacts", "Contacts privacy", "ms-settings:privacy-contacts", ["contacts privacy"]),
  target("privacy-documents", "Documents privacy", "ms-settings:privacy-documents", ["documents privacy"]),
  target("privacy-downloads", "Downloads folder privacy", "ms-settings:privacy-downloadsfolder", ["downloads privacy", "downloads folder privacy"]),
  target("privacy-email", "Email privacy", "ms-settings:privacy-email", ["email privacy"]),
  target("privacy-feedback", "Diagnostics and feedback", "ms-settings:privacy-feedback", ["diagnostics", "feedback", "diagnostics and feedback"]),
  target("privacy-files", "File system privacy", "ms-settings:privacy-broadfilesystemaccess", ["file system privacy", "files privacy"]),
  target("privacy-messaging", "Messaging privacy", "ms-settings:privacy-messaging", ["messaging privacy"]),
  target("privacy-notifications", "Notification privacy", "ms-settings:privacy-notifications", ["notification privacy"]),
  target("privacy-pictures", "Pictures privacy", "ms-settings:privacy-pictures", ["pictures privacy", "photos privacy"]),
  target("privacy-speech", "Speech privacy", "ms-settings:privacy-speech", ["speech privacy", "online speech recognition"]),
  target("privacy-videos", "Videos privacy", "ms-settings:privacy-videos", ["videos privacy"]),
  target("project", "Projecting to this PC", "ms-settings:project", ["projecting", "projecting to this pc", "wireless display"]),
  target("proxy", "Proxy", "ms-settings:network-proxy", ["proxy", "proxy server"]),
  target("recovery", "Recovery", "ms-settings:recovery", ["recovery", "reset this pc", "advanced startup"]),
  target("region", "Region format", "ms-settings:regionformatting", ["region", "regional format"]),
  target("remote-desktop", "Remote Desktop", "ms-settings:remotedesktop", ["remote desktop", "rdp settings"]),
  target("search", "Windows Search", "ms-settings:search", ["search", "windows search"]),
  target("search-permissions", "Search permissions", "ms-settings:search-permissions", ["search permissions"]),
  target("signin", "Sign-in options", "ms-settings:signinoptions", ["sign in", "signin", "sign-in options", "windows hello", "password pin"]),
  target("sound", "Sound", "ms-settings:sound", ["sound", "audio"]),
  target("sound-devices", "Sound devices", "ms-settings:sound-devices", ["sound devices", "audio devices"]),
  target("speech", "Speech", "ms-settings:speech", ["speech", "speech language"]),
  target("start", "Start menu", "ms-settings:personalization-start", ["start", "start menu"]),
  target("startup-apps", "Startup apps", "ms-settings:startupapps", ["startup apps", "startup programs"]),
  target("storage", "Storage", "ms-settings:storagesense", ["storage", "disk space"]),
  target("storage-sense", "Storage Sense", "ms-settings:storagepolicies", ["storage sense", "temporary files automation"]),
  target("taskbar", "Taskbar", "ms-settings:taskbar", ["taskbar"]),
  target("text-cursor", "Text cursor", "ms-settings:easeofaccess-cursor", ["text cursor"]),
  target("themes", "Themes", "ms-settings:themes", ["themes", "windows theme"]),
  target("touch", "Touch", "ms-settings:devices-touch", ["touch", "touch screen"]),
  target("touch-keyboard", "Touch keyboard", "ms-settings:personalization-touchkeyboard", ["touch keyboard"]),
  target("touchpad", "Touchpad", "ms-settings:devices-touchpad", ["touchpad", "trackpad"]),
  target("troubleshoot", "Troubleshoot", "ms-settings:troubleshoot", ["troubleshoot", "troubleshooter"]),
  target("typing", "Typing", "ms-settings:typing", ["typing", "typing suggestions"]),
  target("usb", "USB", "ms-settings:usb", ["usb", "usb notifications"]),
  target("video-playback", "Video playback", "ms-settings:videoplayback", ["video playback", "hdr video"]),
  target("visual-effects", "Accessibility visual effects", "ms-settings:easeofaccess-visualeffects", ["visual effects", "animation effects"]),
  target("volume-mixer", "Volume mixer", "ms-settings:apps-volume", ["volume mixer", "app volume"]),
  target("vpn", "VPN", "ms-settings:network-vpn", ["vpn", "virtual private network"]),
  target("wifi", "Wi-Fi", "ms-settings:network-wifi", ["wifi", "wi-fi", "wireless network"]),
  target("windows-security", "Windows Security", "ms-settings:windowsdefender", ["windows security", "defender", "antivirus"]),
  target("windows-update", "Windows Update", "ms-settings:windowsupdate", ["windows update", "updates", "update"]),
  target("update-history", "Windows Update history", "ms-settings:windowsupdate-history", ["update history", "windows update history"]),
  target("update-options", "Advanced Windows Update options", "ms-settings:windowsupdate-options", ["advanced update options", "update options"]),
  target("update-optional", "Optional Windows updates", "ms-settings:windowsupdate-optionalupdates", ["optional updates", "driver updates"]),
  target("work-school", "Access work or school", "ms-settings:workplace", ["work or school", "access work or school", "work account"]),
  target("your-info", "Your info", "ms-settings:yourinfo", ["your info", "account info"]),
]);

const CONTROL_TARGETS = Object.freeze([
  target("control-panel", "Control Panel", null, ["control panel", "classic control panel", "home"]),
  target("programs-features", "Programs and Features", null, ["programs and features", "uninstall program", "installed programs"]),
  target("network-connections", "Network Connections", null, ["network connections", "network adapters", "adapter settings"]),
  target("sound-control", "Classic Sound Control Panel", null, ["sound control panel", "classic sound", "playback devices", "recording devices"]),
  target("system-properties", "System Properties", null, ["system properties", "advanced system settings"]),
  target("power-options", "Power Options", null, ["power options", "power plans"]),
  target("windows-firewall", "Windows Defender Firewall", null, ["windows firewall", "firewall"]),
  target("internet-options", "Internet Properties", null, ["internet options", "internet properties"]),
  target("mouse-properties", "Mouse Properties", null, ["mouse properties", "classic mouse"]),
  target("keyboard-properties", "Keyboard Properties", null, ["keyboard properties", "classic keyboard"]),
  target("date-time-control", "Date and Time", null, ["date and time control panel", "classic date and time"]),
  target("credential-manager", "Credential Manager", null, ["credential manager", "windows credentials"]),
  target("devices-printers", "Devices and Printers", null, ["devices and printers"]),
  target("file-explorer-options", "File Explorer Options", null, ["file explorer options", "folder options"]),
  target("fonts-control", "Fonts", null, ["fonts control panel", "classic fonts"]),
]);

const CONTROL_ARGUMENTS = Object.freeze({
  "control-panel": [],
  "programs-features": ["appwiz.cpl"],
  "network-connections": ["ncpa.cpl"],
  "sound-control": ["mmsys.cpl"],
  "system-properties": ["sysdm.cpl"],
  "power-options": ["powercfg.cpl"],
  "windows-firewall": ["firewall.cpl"],
  "internet-options": ["inetcpl.cpl"],
  "mouse-properties": ["main.cpl"],
  "keyboard-properties": ["main.cpl", "@1"],
  "date-time-control": ["timedate.cpl"],
  "credential-manager": ["/name", "Microsoft.CredentialManager"],
  "devices-printers": ["/name", "Microsoft.DevicesAndPrinters"],
  "file-explorer-options": ["/name", "Microsoft.FolderOptions"],
  "fonts-control": ["/name", "Microsoft.Fonts"],
});

function nativeTarget(key, name, executable, args = [], aliases = [], options = {}) {
  return Object.freeze({
    key,
    name,
    executable,
    args: Object.freeze(args),
    aliases: Object.freeze(aliases),
    ...options,
  });
}

const TOOL_TARGETS = Object.freeze([
  nativeTarget("task-manager", "Task Manager", "taskmgr.exe", [], ["task manager", "process manager"]),
  nativeTarget("device-manager", "Device Manager", "mmc.exe", ["devmgmt.msc"], ["device manager", "devices manager"]),
  nativeTarget("services", "Services", "mmc.exe", ["services.msc"], ["services", "windows services", "service manager"]),
  nativeTarget("event-viewer", "Event Viewer", "mmc.exe", ["eventvwr.msc"], ["event viewer", "event logs"]),
  nativeTarget("disk-management", "Disk Management", "mmc.exe", ["diskmgmt.msc"], ["disk management", "partition manager"]),
  nativeTarget("computer-management", "Computer Management", "mmc.exe", ["compmgmt.msc"], ["computer management"]),
  nativeTarget("task-scheduler", "Task Scheduler", "mmc.exe", ["taskschd.msc"], ["task scheduler", "scheduled tasks"]),
  nativeTarget("local-users", "Local Users and Groups", "mmc.exe", ["lusrmgr.msc"], ["local users", "local users and groups"]),
  nativeTarget("certificates", "Certificate Manager", "mmc.exe", ["certmgr.msc"], ["certificate manager", "certificates"]),
  nativeTarget("group-policy", "Local Group Policy Editor", "mmc.exe", ["gpedit.msc"], ["group policy", "local group policy"]),
  nativeTarget("firewall-advanced", "Windows Firewall with Advanced Security", "mmc.exe", ["wf.msc"], ["advanced firewall", "firewall advanced security"]),
  nativeTarget("shared-folders", "Shared Folders", "mmc.exe", ["fsmgmt.msc"], ["shared folders", "shares manager"]),
  nativeTarget("print-management", "Print Management", "mmc.exe", ["printmanagement.msc"], ["print management", "printer management"]),
  nativeTarget("performance-monitor", "Performance Monitor", "perfmon.exe", [], ["performance monitor", "perfmon"]),
  nativeTarget("resource-monitor", "Resource Monitor", "resmon.exe", [], ["resource monitor", "resmon"]),
  nativeTarget("system-information", "System Information", "msinfo32.exe", [], ["system information", "msinfo32"]),
  nativeTarget("system-configuration", "System Configuration", "msconfig.exe", [], ["system configuration", "msconfig"]),
  nativeTarget("registry-editor", "Registry Editor", "regedit.exe", [], ["registry editor", "regedit", "registry"]),
  nativeTarget("directx-diagnostic", "DirectX Diagnostic Tool", "dxdiag.exe", [], ["directx diagnostic", "dxdiag"]),
  nativeTarget("remote-desktop", "Remote Desktop Connection", "mstsc.exe", [], ["remote desktop connection", "mstsc", "rdp client"]),
  nativeTarget("memory-diagnostic", "Windows Memory Diagnostic", "mdsched.exe", [], ["memory diagnostic", "windows memory diagnostic"]),
  nativeTarget("command-prompt", "Command Prompt", "cmd.exe", [], ["command prompt", "cmd", "cmd exe"]),
  nativeTarget("powershell", "Windows PowerShell", "WindowsPowerShell\\v1.0\\powershell.exe", [], ["powershell", "windows powershell"]),
  nativeTarget("terminal", "Windows Terminal", "wt.exe", [], ["terminal", "windows terminal"], { searchPath: true }),
  nativeTarget("snipping-tool", "Snipping Tool", "SnippingTool.exe", [], ["snipping tool", "screenshot tool"]),
  nativeTarget("character-map", "Character Map", "charmap.exe", [], ["character map", "special characters"]),
  nativeTarget("on-screen-keyboard", "On-Screen Keyboard", "osk.exe", [], ["on screen keyboard", "virtual keyboard"]),
  nativeTarget("magnifier-tool", "Magnifier", "magnify.exe", [], ["magnifier tool", "magnify"]),
]);

const FOLDER_TARGETS = Object.freeze([
  Object.freeze({ key: "this-pc", name: "This PC", aliases: Object.freeze(["this pc", "computer"]), explorerArg: "shell:MyComputerFolder" }),
  Object.freeze({ key: "home-folder", name: "Home folder", aliases: Object.freeze(["home folder", "user folder", "profile folder"]), pathName: "home" }),
  Object.freeze({ key: "desktop-folder", name: "Desktop", aliases: Object.freeze(["desktop", "desktop folder"]), pathName: "desktop" }),
  Object.freeze({ key: "documents-folder", name: "Documents", aliases: Object.freeze(["documents", "documents folder", "my documents"]), pathName: "documents" }),
  Object.freeze({ key: "downloads-folder", name: "Downloads", aliases: Object.freeze(["downloads", "downloads folder"]), pathName: "downloads" }),
  Object.freeze({ key: "pictures-folder", name: "Pictures", aliases: Object.freeze(["pictures", "pictures folder", "photos folder"]), pathName: "pictures" }),
  Object.freeze({ key: "videos-folder", name: "Videos", aliases: Object.freeze(["videos", "videos folder"]), pathName: "videos" }),
  Object.freeze({ key: "music-folder", name: "Music", aliases: Object.freeze(["music", "music folder"]), pathName: "music" }),
  Object.freeze({ key: "temp-folder", name: "Temporary files folder", aliases: Object.freeze(["temp", "temporary files", "temp folder"]), pathName: "temp" }),
  Object.freeze({ key: "recycle-bin", name: "Recycle Bin", aliases: Object.freeze(["recycle bin", "trash"]), explorerArg: "shell:RecycleBinFolder" }),
  Object.freeze({ key: "network-folder", name: "Network", aliases: Object.freeze(["network folder", "network places"]), explorerArg: "shell:NetworkPlacesFolder" }),
  Object.freeze({ key: "all-apps-folder", name: "Windows Applications folder", aliases: Object.freeze(["applications folder", "all apps folder", "apps folder"]), explorerArg: "shell:AppsFolder" }),
  Object.freeze({ key: "startup-folder", name: "Startup folder", aliases: Object.freeze(["startup folder"]), explorerArg: "shell:Startup" }),
  Object.freeze({ key: "recent-folder", name: "Recent items", aliases: Object.freeze(["recent items", "recent folder"]), explorerArg: "shell:Recent" }),
]);

const DIAGNOSTIC_TARGETS = Object.freeze([
  nativeTarget("ipconfig", "Complete IP configuration", "ipconfig.exe", ["/all"], ["ipconfig", "ip configuration", "network configuration"]),
  nativeTarget("systeminfo", "System information report", "systeminfo.exe", [], ["systeminfo", "system report", "windows version report"]),
  nativeTarget("whoami", "Current identity and privileges", "whoami.exe", ["/all"], ["whoami", "identity", "user privileges"]),
  nativeTarget("tasklist", "Running process list", "tasklist.exe", ["/v", "/fo", "table"], ["tasklist", "running processes", "process list"]),
  nativeTarget("driverquery", "Installed driver list", "driverquery.exe", ["/v", "/fo", "table"], ["driverquery", "driver list", "installed drivers"]),
  nativeTarget("netstat", "Network connection list", "netstat.exe", ["-ano"], ["netstat", "network connections", "open ports"]),
  nativeTarget("route", "Network route table", "route.exe", ["print"], ["route", "route table", "routing table"]),
  nativeTarget("arp", "ARP cache", "arp.exe", ["-a"], ["arp", "arp cache"]),
  nativeTarget("dns-cache", "DNS resolver cache", "ipconfig.exe", ["/displaydns"], ["dns cache", "display dns"]),
  nativeTarget("power-capabilities", "Power and sleep capabilities", "powercfg.exe", ["/a"], ["power capabilities", "sleep states", "powercfg"]),
  nativeTarget("services-status", "Windows service status", "sc.exe", ["query", "type=", "service", "state=", "all"], ["service status", "services status", "sc query"]),
  nativeTarget("hostname", "Computer name", "hostname.exe", [], ["hostname", "computer name"]),
]);

const POWER_TARGETS = Object.freeze([
  nativeTarget("lock", "Lock this PC", "rundll32.exe", ["user32.dll,LockWorkStation"], ["lock", "lock pc", "lock computer"]),
  nativeTarget("sign-out", "Sign out of Windows", "shutdown.exe", ["/l"], ["sign out", "log out windows", "logout windows"]),
  nativeTarget("restart", "Restart this PC", "shutdown.exe", ["/r", "/t", "0"], ["restart", "reboot", "restart pc"]),
  nativeTarget("shutdown", "Shut down this PC", "shutdown.exe", ["/s", "/t", "0"], ["shutdown", "shut down", "power off"]),
  nativeTarget("hibernate", "Hibernate this PC", "shutdown.exe", ["/h"], ["hibernate", "hibernate pc"]),
  nativeTarget("cancel-shutdown", "Cancel a pending shutdown", "shutdown.exe", ["/a"], ["cancel shutdown", "abort shutdown", "cancel restart"]),
]);

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/wi[ -]?fi/g, "wifi")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(?:please|open|show|launch|go|to|my|the|windows|setting|settings|page)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreTarget(query, item) {
  const normalized = normalizeText(query);
  if (!normalized) return item.key.endsWith("home") || item.key === "control-panel" ? 100 : 0;
  const choices = [item.key, item.name, ...item.aliases].map(normalizeText).filter(Boolean);
  if (choices.includes(normalized)) return 100;
  let score = 0;
  const words = normalized.split(" ");
  for (const choice of choices) {
    if (choice.includes(normalized)) score = Math.max(score, 80 - Math.max(0, choice.length - normalized.length));
    if (normalized.includes(choice)) score = Math.max(score, 75 - Math.max(0, normalized.length - choice.length));
    const matched = words.filter((word) => choice.split(" ").includes(word)).length;
    if (matched === words.length) score = Math.max(score, 55 + matched * 3);
  }
  return score;
}

function resolveTarget(query, targets) {
  return targets
    .map((item) => ({ item, score: scoreTarget(query, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))[0]?.item || null;
}

function publicTargets(targets) {
  return targets.map(({ key, name, aliases }) => ({ key, name, aliases: [...aliases] }));
}

function parseStartAppsJson(stdout) {
  if (!String(stdout || "").trim()) return [];
  let parsed;
  try {
    parsed = JSON.parse(String(stdout).trim());
  } catch {
    throw new Error("Windows returned an unreadable installed-app list.");
  }
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  const seen = new Set();
  return rows
    .map((row) => ({ name: String(row?.Name || "").trim(), appId: String(row?.AppID || row?.AppId || "").trim() }))
    .filter((row) => row.name && row.appId && !seen.has(row.appId) && seen.add(row.appId))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function findInstalledApps(query, apps, limit = 8) {
  const normalized = normalizeText(query);
  const ranked = apps.map((app) => {
    const name = normalizeText(app.name);
    let score = normalized ? 0 : 1;
    if (name === normalized) score = 100;
    else if (name.startsWith(normalized)) score = 85;
    else if (name.includes(normalized)) score = 70;
    else if (normalized && normalized.split(" ").every((word) => name.includes(word))) score = 55;
    return { app, score, exact: name === normalized };
  });
  return ranked
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.app.name.localeCompare(b.app.name))
    .slice(0, Math.max(1, Math.min(Number(limit) || 8, 20)));
}

module.exports = Object.freeze({
  SETTING_TARGETS,
  CONTROL_TARGETS,
  CONTROL_ARGUMENTS,
  TOOL_TARGETS,
  FOLDER_TARGETS,
  DIAGNOSTIC_TARGETS,
  POWER_TARGETS,
  normalizeText,
  resolveTarget,
  publicTargets,
  parseStartAppsJson,
  findInstalledApps,
});
