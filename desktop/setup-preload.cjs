"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jarvisSetup", Object.freeze({
  saveWebsite: (url) => ipcRenderer.invoke("jarvis:save-website", url),
  cancel: () => ipcRenderer.invoke("jarvis:cancel-setup"),
}));
