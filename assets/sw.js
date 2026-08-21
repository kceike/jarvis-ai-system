const VERSION = "jarvis-pwa-1.12.9";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(() => new Response(
      "JARVIS is offline. Reconnect to the internet and reopen the app. Your locally stored conversations remain on this device.",
      {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8", "x-jarvis-version": VERSION },
      },
    )),
  );
});
