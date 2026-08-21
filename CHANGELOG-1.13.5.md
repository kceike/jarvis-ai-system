# JARVIS 1.13.5

## Google Gemini API maximum profile

- Adds Google Gemini API as an optional intelligence provider without removing Cloudflare AI, Ollama, Auto Director, natural commands, or slash commands.
- Keeps `GEMINI_API_KEY` in a Cloudflare Worker secret; it is never sent to the browser, stored in the app, or committed to GitHub.
- Uses `gemini-3.7-flash` by default and supports a validated `GEMINI_MODEL` override for future model availability.
- Supports chat, coding, image and screen analysis, uploaded-file context, Windows IT report analysis, cited Deep Research, and the Knowledge Update Generator/Critic.
- Maximum mode allows the JARVIS 120K context setting and up to 8,192 output tokens.
- Reflection runs a Gemini Generator → Critic → optional Revision workflow.
- Structured Gemini JSON output supports the controlled Knowledge Update Agent while retaining source checks and mandatory human approval.
- Adds `CONFIGURE_GEMINI_API.bat` for secure one-time setup and deployment.

Gemini free quota is limited rather than unlimited. Google controls availability, quotas, pricing, and data handling for the selected Gemini service tier.
