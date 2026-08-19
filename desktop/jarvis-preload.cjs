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
  runItHealthCheck: () => ipcRenderer.invoke("jarvis:run-it-health-check"),
  captureScreen: () => ipcRenderer.invoke("jarvis:capture-screen"),
  powerAction: (query) => ipcRenderer.invoke("jarvis:power-action", String(query || "").slice(0, 120)),
  setWakeWordEnabled: (enabled) => ipcRenderer.invoke("jarvis:set-wake-word", enabled === true),
  onWakeWord: (callback) => {
    if (typeof callback !== "function") return () => {};
    const listener = (_event, payload) => callback(Object.freeze({
      transcript: String(payload?.transcript || "").slice(0, 500),
      engine: payload?.engine === "windows" ? "windows" : "unknown",
    }));
    ipcRenderer.on("jarvis:wake-word", listener);
    return () => ipcRenderer.removeListener("jarvis:wake-word", listener);
  },
  onWakeWordStatus: (callback) => {
    if (typeof callback !== "function") return () => {};
    const listener = (_event, payload) => callback(Object.freeze({
      status: String(payload?.status || "").slice(0, 30),
      engine: String(payload?.engine || "").slice(0, 30),
      language: String(payload?.language || "").slice(0, 30),
      message: String(payload?.message || "").slice(0, 240),
    }));
    ipcRenderer.on("jarvis:wake-word-status", listener);
    return () => ipcRenderer.removeListener("jarvis:wake-word-status", listener);
  },
}));
