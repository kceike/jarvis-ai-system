"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  compareVersions,
  inferInstallerKind,
  normalizeHttpsUrl,
  selectInstaller,
  validateUpdateManifest,
} = require("../update-manager.cjs");

const HASH_A = "a".repeat(64);
const HASH_B = "b".repeat(64);

test("compares stable desktop versions numerically", () => {
  assert.equal(compareVersions("1.10.0", "1.9.9"), 1);
  assert.equal(compareVersions("v2.0.0", "2.0.0"), 0);
  assert.equal(compareVersions("1.9.0", "1.10.0"), -1);
  assert.throws(() => compareVersions("latest", "1.0.0"));
});

test("accepts only HTTPS installer URLs without embedded credentials", () => {
  assert.equal(normalizeHttpsUrl("https://downloads.example/JARVIS.exe", ".exe"), "https://downloads.example/JARVIS.exe");
  assert.equal(normalizeHttpsUrl("http://downloads.example/JARVIS.exe", ".exe"), null);
  assert.equal(normalizeHttpsUrl("https://user:pass@downloads.example/JARVIS.exe", ".exe"), null);
  assert.equal(normalizeHttpsUrl("https://downloads.example/JARVIS.zip", ".exe"), null);
});

test("validates the release manifest and preserves both installer formats", () => {
  const manifest = validateUpdateManifest({
    schema: 1,
    enabled: true,
    version: "1.10.0",
    notes: "Automatic update support.",
    installers: {
      exe: { url: "https://github.com/example/jarvis/releases/download/jarvis-v1.10.0/JARVIS.exe", sha256: HASH_A },
      msi: { url: "https://github.com/example/jarvis/releases/download/jarvis-v1.10.0/JARVIS.msi", sha256: HASH_B },
    },
  });
  assert.equal(manifest.version, "1.10.0");
  assert.equal(selectInstaller(manifest, "msi").kind, "msi");
  assert.equal(selectInstaller(manifest, "exe").kind, "exe");
});

test("rejects an installer whose SHA-256 is missing or malformed", () => {
  assert.throws(() => validateUpdateManifest({
    schema: 1,
    version: "1.10.0",
    installers: { exe: { url: "https://downloads.example/JARVIS.exe", sha256: "unsafe" } },
  }));
});

test("infers MSI installations from the Windows uninstall registration", () => {
  assert.equal(inferInstallerKind('{"DisplayName":"JARVIS AI","WindowsInstaller":1}'), "msi");
  assert.equal(inferInstallerKind('{"UninstallString":"MsiExec.exe /I{ABC}"}'), "msi");
  assert.equal(inferInstallerKind('{"UninstallString":"C:\\\\JARVIS\\\\Uninstall.exe"}'), "exe");
});
