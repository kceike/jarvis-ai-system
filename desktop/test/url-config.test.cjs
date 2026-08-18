"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { normalizeWebsiteUrl, sameTrustedOrigin } = require("../url-config.cjs");

test("accepts only a complete HTTPS website without embedded credentials", () => {
  assert.equal(normalizeWebsiteUrl("https://jarvis.example.workers.dev"), "https://jarvis.example.workers.dev/");
  assert.equal(normalizeWebsiteUrl("http://jarvis.example.workers.dev"), null);
  assert.equal(normalizeWebsiteUrl("https://user:pass@jarvis.example.workers.dev"), null);
});

test("extracts the first usable address from the packaged configuration text", () => {
  const text = "Paste your address below\nExample: https://jarvis-ai-system.YOUR-SUBDOMAIN.workers.dev\nhttps://jarvis.kristian.example/path#section";
  assert.equal(normalizeWebsiteUrl(text), "https://jarvis.kristian.example/path");
});

test("allows navigation only within the configured website origin", () => {
  assert.equal(sameTrustedOrigin("https://jarvis.example.workers.dev/api/login", "https://jarvis.example.workers.dev/"), true);
  assert.equal(sameTrustedOrigin("https://example.com/", "https://jarvis.example.workers.dev/"), false);
});
