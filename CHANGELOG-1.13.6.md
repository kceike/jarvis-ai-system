# JARVIS 1.13.6

## Unified Brain and Gemini reliability hotfix

- Added **Unified JARVIS Brain** as the simple automatic provider mode.
- Added a one-click **Maximum Unified Brain** profile: maximum reasoning, 120K context, reflection, web research, neural voice with system fallback, and automatic spoken replies.
- Unified mode prefers configured Gemini, safely falls back to Cloudflare Workers AI, and in the genuine Windows app can use configured local Ollama as the last fallback.
- Corrected Gemini REST payload fields to Google's canonical JSON names, including multimodal inline data.
- Added bounded request timeouts, one controlled retry for transient errors, shorter critic/revision limits, clearer quota errors, and API-key redaction.
- Added **Test Gemini Connection** in Advanced AI Overrides. It reports the deployed model and latency without exposing the key.
- Added visible stages while waiting: provider selection, generation, and self-correction.
- Natural chat/code/image intent routing no longer depends on the Cloudflare model dropdown.
- AI failures are returned as visible chat messages and spoken when Automatic voice response is enabled.
- Preserved slash commands, manual provider overrides, Ollama, Cloudflare AI, Gemini, files, memory/RAG, desktop controls, updater, and all confirmation safeguards.
