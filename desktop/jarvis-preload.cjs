"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jarvisDesktop", Object.freeze({
  getCapabilities: () => ipcRenderer.invoke("jarvis:desktop-capabilities"),
  findApps: (query) => ipcRenderer.invoke("jarvis:find-apps", String(query || "").slice(0, 120)),
  openApp: (token) => ipcRenderer.invoke("jarvis:open-app", String(token || "").slice(0, 128)),
  openSetting: (query) => ipcRenderer.invoke("jarvis:open-setting", String(query || "").slice(0, 120)),
  openControlPanel: (query) => ipcRenderer.invoke("jarvis:open-control-panel", String(query || "").slice(0, 120)),
  openTool: (query) => ipcRenderer.invoke("jarvis:open-tool", String(query || "").slice(0, 120)),
  openFolder: (query) => ipcRenderer.invoke("jarvis:open-folder", String(query || "").slice(0, 120)),
  runDiagnostic: (query) => ipcRenderer.invoke("jarvis:run-diagnostic", String(query || "").slice(0, 120)),
  powerAction: (query) => ipcRenderer.invoke("jarvis:power-action", String(query || "").slice(0, 120)),
}));
