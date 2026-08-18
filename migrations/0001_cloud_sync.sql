CREATE TABLE IF NOT EXISTS jarvis_sync (
  id TEXT PRIMARY KEY NOT NULL,
  revision INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0,
  device_id TEXT NOT NULL DEFAULT '',
  payload TEXT NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO jarvis_sync (id, revision, updated_at, device_id, payload)
VALUES ('primary', 0, 0, '', '');
