"use strict";

function normalizeWebsiteUrl(value) {
  const candidates = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("https://") && !line.includes("YOUR-SUBDOMAIN"));

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (url.protocol !== "https:" || !url.hostname || url.username || url.password) continue;
      url.hash = "";
      return url.href;
    } catch {
      // Try the next line in a README-style configuration file.
    }
  }
  return null;
}

function sameTrustedOrigin(candidate, trustedUrl) {
  try {
    return new URL(candidate).origin === new URL(trustedUrl).origin;
  } catch {
    return false;
  }
}

module.exports = { normalizeWebsiteUrl, sameTrustedOrigin };
