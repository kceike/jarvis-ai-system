# JARVIS 1.12.0 — Hey JARVIS Wake Phrase

- Adds an optional **Always listen for “Hey JARVIS”** setting under Voice and Response.
- Shows persistent **HEY JARVIS ARMED**, awake, paused, and error states in the composer.
- Supports “Hey Jarvis” followed by a dictated request or “Hey Jarvis, [command]” in one sentence.
- The Windows EXE/MSI uses the installed English Windows speech-recognition engine and restricts the native grammar to the wake phrase plus an optional command.
- Edge and Chrome use their available speech-recognition implementation, which may use an online service.
- Wake-word detection pauses while JARVIS speaks so it cannot trigger itself.
- Detection pauses when the JARVIS page is hidden and stops on logout, window close, or application exit.
- Wake-word preference is device-local and is not enabled remotely through cross-device synchronization.
- Protected Windows, power, IoT, and other computer actions retain every existing confirmation.
- Includes the v1.11.2 Help Center scrolling correction and every previous JARVIS function.
