# JARVIS 1.13.9

## Gemini diagnostic and interrupted-chat hotfix

- Corrected **Test Gemini Connection** from the unsupported `minimal` thinking level to `low`, matching models that allow only Low, Medium, and High.
- Kept normal Standard, Deep, and Maximum generation mapped to Low, Medium, and High respectively.
- Preserved the tiny live Interactions API diagnostic, API-key secrecy, bounded timeout, visible error, and spoken status behavior.
- Removed the eight-second recovery condition that could miss a request interrupted immediately after sending.
- Rechecks unanswered user messages whenever the interface renders while no request is active, covering startup, update, reload, cloud-sync merge, and system-tray restoration.
- Updated the Help Center to distinguish the low-cost diagnostic setting from normal Maximum reasoning.
- Retained every v1.13.8 function, route, command, interface control, provider fallback, safety confirmation, and updater behavior.
