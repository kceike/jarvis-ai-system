# JARVIS 1.12.1 — Background Wake Word and System Tray

- Minimizing the genuine Windows EXE/MSI now hides JARVIS from the taskbar and keeps it in the Windows system tray.
- The tray tooltip and context menu visibly report **Hey JARVIS: Listening**, **Starting**, or **Off**.
- The native Windows wake-word process remains active while JARVIS is minimized or hidden in the tray.
- Saying “Hey Jarvis” restores, raises, and focuses the JARVIS window before the request is handled.
- The tray icon can reopen JARVIS with one click or from **Open JARVIS**.
- The tray menu also provides **Check for desktop update** and **Exit JARVIS**.
- A one-time Windows notification explains that JARVIS remains active after minimization.
- Closing or choosing **Exit JARVIS** still stops the microphone listener and removes the tray icon.
- Browser/PWA wake-word detection continues to pause when its page is hidden because browsers do not provide the native tray lifecycle.
- Every existing confirmation for settings, applications, diagnostics, power, IoT, and protected computer actions remains enforced.
