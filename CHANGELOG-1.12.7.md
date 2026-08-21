# JARVIS AI 1.12.7

## Natural weather command correction

- Corrected natural requests such as `Research today’s weather in Iloilo City and show your sources`.
- The client parser now separates the actual location from trailing response instructions.
- The Worker weather endpoint independently sanitizes the location as a second reliability layer.
- Legitimate place names containing words such as `and` or `Show` remain intact.
- Open-Meteo attribution and the existing three-day forecast remain unchanged.
- Added regression coverage for typed, spoken, browser, and Windows-app requests that use the shared web interface.

All earlier JARVIS functions, safeguards, confirmations, Knowledge Update Agent behavior, system-tray support, voice controls, and automatic-update features remain available.
