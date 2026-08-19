# JARVIS AI 1.12.3

## Fixed

- Fixed the solid black content area that could appear after reopening the Electron EXE/MSI from the Windows system tray.
- Schedules an immediate full Chromium repaint and two delayed repaint passes after the window becomes visible.
- Restores focus to both the native BrowserWindow and its WebContents.
- Cancels stale hide and repaint timers during quick minimize/restore sequences and shutdown.
- Returns the renderer to Chromium's normal hidden-window lifecycle while the independent native wake-word listener remains active.

## Preserved

- Restoring JARVIS does not reload the Cloudflare website, so the current chat, login session, and unsent input are preserved.
- **Hey JARVIS** continues listening from the system tray and brings the existing window forward.
- All earlier chat, voice, Windows control, updater, memory, RAG, reflection, Help Center, and safety-confirmation features remain available.

## Technical note

Electron's documented `webContents.invalidate()` method is used to schedule a full repaint of the window. The repaint passes run only while JARVIS is visible.
