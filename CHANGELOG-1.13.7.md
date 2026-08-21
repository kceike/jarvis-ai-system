# JARVIS 1.13.7

## Gemini chat-response reliability hotfix

- Migrated normal Gemini text and coding requests to Google's current Interactions API.
- Preserved the established multimodal and structured-output compatibility route for image analysis and schema-bound tasks.
- Changed **Test Gemini Connection** to send a tiny live response through the same endpoint used by normal chat; an ONLINE result now verifies actual generation instead of model-name access alone.
- Added bounded timeouts, one controlled retry for transient Gemini failures, API-key redaction, and clear errors for quota, blocked, empty, or failed responses.
- Added startup recovery for a request interrupted by an app close, reload, update, or system-tray lifecycle event. JARVIS now inserts a visible retry message instead of leaving only the user's bubble.
- Retained automatic code-intent routing, complete Markdown code-block display and copy controls, chat-plus-voice replies, Unified Brain fallback to Cloudflare and local Ollama, slash commands, memory/RAG, file analysis, desktop controls, updater behavior, and confirmation safeguards.
