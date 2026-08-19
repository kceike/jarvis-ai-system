# JARVIS AI 1.12.4

## Fixed

- The **Always listen for Hey JARVIS** switch now enables or disables the listener immediately without waiting for Save Configuration.
- The control clearly displays `STARTING`, `ON`, or `OFF` beside the switch.
- The visual switch position, locally saved preference, synchronized preference, and actual listener state now remain aligned.
- Turning the switch off immediately stops browser and native Windows wake-word listeners and cancels pending restarts.
- A Windows or browser listener startup failure automatically saves the feature as disabled and returns the switch to `OFF`.
- Browser `service-not-allowed` failures are no longer incorrectly reported as Windows microphone-permission denials.
- The installed EXE/MSI no longer falls back to browser speech recognition after its native Windows listener fails; the native error remains visible for accurate troubleshooting.

## Preserved

- Hey JARVIS can continue listening from the Windows system tray when the native listener starts successfully.
- The v1.12.3 minimize/restore repaint protection remains active.
- All prior chat, voice, Windows control, updater, memory, RAG, reflection, Help Center, and safety-confirmation features remain available.
