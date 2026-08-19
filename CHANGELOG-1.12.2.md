# JARVIS AI 1.12.2

## Fixed

- Fixed the Windows app freeze that could occur after minimizing JARVIS to the system tray and reopening it.
- Keeps the Electron renderer responsive while the window is tray-hidden.
- Defers native hide and focus transitions so Windows can finish its minimize or restore operation first.
- Cancels a pending tray hide if JARVIS is reopened immediately.
- Removes the synchronous taskbar and always-on-top state toggles that could conflict with Windows window management.

## Preserved

- The optional local **Hey JARVIS** listener remains active while JARVIS is in the system tray.
- A recognized wake phrase restores and focuses the existing JARVIS window.
- All prior chat, voice, Windows control, update, memory, RAG, reflection, Help Center, and safety-confirmation features remain available.

## Note

Keeping the renderer active while tray-hidden can use slightly more background CPU or memory, but it prevents Chromium from suspending the interface that must respond immediately to a tray click or wake phrase.
