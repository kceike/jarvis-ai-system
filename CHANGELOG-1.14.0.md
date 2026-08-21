# JARVIS 1.14.0

## Unified Cloudflare Brain cleanup

- Removes the Google Gemini provider, API calls, connection diagnostic, Settings option, Worker endpoint, setup BAT, and active Help Center instructions at the owner's request.
- Migrates any legacy saved Gemini provider selection to **Unified JARVIS Brain** automatically.
- Routes chat, coding, reasoning, reflection, one-time screen vision, Deep Research, and the Knowledge Update Agent through the existing Cloudflare Workers AI binding.
- Keeps optional local Ollama for supported text work and preserves Unified-mode Ollama fallback in the genuine Windows app.
- Preserves every non-Gemini function: natural commands, slash commands, image generation, voice input/output, Hey JARVIS, files and Microsoft Office/PSD analysis, Memory Vault/RAG, encrypted sync, SearXNG research, Mission Control, Windows controls, updater, EXE/MSI build, and all confirmation safeguards.
- Updates the built-in Help Center, installer guides, version metadata, cache version, and release messaging to 1.14.0.
- Updates the one-click GitHub uploader to stage deletion of the retired Gemini setup BAT even when a fresh ZIP is safely attached to an older repository history.

An unused `GEMINI_API_KEY` secret may still exist in an already-deployed Cloudflare Worker until the owner deletes it in Cloudflare. Version 1.14.0 never reads or sends that secret.
