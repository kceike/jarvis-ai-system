"use strict";

const UPDATE_SCHEMA = 1;
const MAX_NOTES_LENGTH = 4_000;

function parseStableVersion(value) {
  const match = String(value || "").trim().match(/^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
  if (!match) return null;
  return match.slice(1).map(Number);
}

function compareVersions(left, right) {
  const a = parseStableVersion(left);
  const b = parseStableVersion(right);
  if (!a || !b) throw new Error("JARVIS desktop update versions must use the stable x.y.z format.");
  for (let index = 0; index < 3; index += 1) {
    if (a[index] > b[index]) return 1;
    if (a[index] < b[index]) return -1;
  }
  return 0;
}

function normalizeHttpsUrl(value, extension) {
  const text = String(value || "").trim();
  if (!text || text.length > 2_048) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (extension && !url.pathname.toLowerCase().endsWith(extension)) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function normalizeInstaller(rawInstaller, kind) {
  if (!rawInstaller || typeof rawInstaller !== "object") return null;
  const url = normalizeHttpsUrl(rawInstaller.url, kind === "msi" ? ".msi" : ".exe");
  const sha256 = String(rawInstaller.sha256 || "").trim().toLowerCase();
  if (!url || !/^[a-f0-9]{64}$/.test(sha256)) return null;
  return Object.freeze({ kind, url, sha256 });
}

function validateUpdateManifest(raw) {
  if (!raw || typeof raw !== "object" || raw.schema !== UPDATE_SCHEMA) {
    throw new Error("The JARVIS desktop update manifest is not supported.");
  }
  if (raw.enabled === false) {
    return Object.freeze({ schema: UPDATE_SCHEMA, enabled: false, reason: String(raw.reason || "Updates are not configured.").slice(0, 240) });
  }
  const version = String(raw.version || "").trim().replace(/^v/i, "");
  if (!parseStableVersion(version)) throw new Error("The JARVIS desktop update version is invalid.");
  const installers = Object.freeze({
    exe: normalizeInstaller(raw.installers?.exe, "exe"),
    msi: normalizeInstaller(raw.installers?.msi, "msi"),
  });
  if (!installers.exe && !installers.msi) throw new Error("No verified Windows installer is available in the update manifest.");
  return Object.freeze({
    schema: UPDATE_SCHEMA,
    enabled: true,
    version,
    publishedAt: typeof raw.publishedAt === "string" ? raw.publishedAt.slice(0, 64) : "",
    notes: typeof raw.notes === "string" ? raw.notes.slice(0, MAX_NOTES_LENGTH) : "",
    installers,
  });
}

function selectInstaller(manifest, preferredKind = "exe") {
  if (!manifest?.enabled) return null;
  const preferred = preferredKind === "msi" ? "msi" : "exe";
  return manifest.installers[preferred] || manifest.installers[preferred === "msi" ? "exe" : "msi"] || null;
}

function inferInstallerKind(registryOutput) {
  const text = String(registryOutput || "");
  return /"WindowsInstaller"\s*:\s*(?:1|"1")/i.test(text) || /msiexec(?:\.exe)?/i.test(text) ? "msi" : "exe";
}

module.exports = {
  UPDATE_SCHEMA,
  compareVersions,
  inferInstallerKind,
  normalizeHttpsUrl,
  parseStableVersion,
  selectInstaller,
  validateUpdateManifest,
};
