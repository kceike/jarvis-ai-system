# JARVIS 1.14.1

## Reliable chat delivery hotfix

- Fixes the repeated false message claiming that the previous AI request was interrupted.
- Adds a pending marker only to a real in-flight AI request and clears it after either a successful response or a visible provider error.
- Runs startup recovery only for a marked request that was genuinely interrupted by closing, reloading, updating, or ending the app before completion.
- Pauses encrypted cloud synchronization while JARVIS is generating a response so background merging cannot replace the active conversation.
- Resolves the current conversation by its stable ID before saving a completed or failed response, preventing replies from being written to an obsolete in-memory copy.
- Updates the Help Center, offline guide, service-worker cache, Windows installer metadata, automatic-update release notes, and regression tests.

No command or feature was removed. Unified Cloudflare AI, optional local Ollama, natural and slash commands, code, vision, image generation, voice, Hey JARVIS, file and Office/PSD analysis, Memory Vault/RAG, encrypted sync, research, Knowledge Update Agent, Mission Control, Windows controls, updater, EXE/MSI build, and all confirmations remain available.
