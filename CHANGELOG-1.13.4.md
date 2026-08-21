# JARVIS 1.13.4

- Added a universal Natural Language Intent Director across JARVIS features.
- Normal requests are mapped locally to Help, conversations, memory, file learning, Knowledge Update, Deep Research, Mission Control, screen vision, IT health, briefings, skills, local file search, diagnostics, Windows actions, IoT, speech, calculations, and other existing handlers.
- Slash commands remain optional deterministic fallbacks.
- Auto Director now classifies ordinary input as chat, code, or image generation and selects the corresponding Cloudflare or Ollama route.
- Code requests automatically receive the coding system prompt and coding model route.
- Image requests automatically use image generation without requiring the user to select Vision first.
- Original conversational wording is preserved in chat instead of displaying an internal command.
- Ambiguous requests fall through to normal AI conversation rather than triggering a tool.
- Native confirmations, double-confirmed power actions, Memory Vault approval, Knowledge Update approval, and all permission boundaries remain unchanged.
