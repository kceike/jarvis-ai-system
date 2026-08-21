# JARVIS 1.15.0 — Free-Max Unified Brain

## Intelligence routing

- Replaces retired or older default text and vision routes with current Cloudflare-hosted models: GLM 4.7 Flash for general work, GPT-OSS 120B for maximum reasoning, Qwen3 30B for coding, and Llama 4 Scout for image and screen understanding.
- Keeps FLUX.1 Schnell image generation, BGE small semantic embeddings, Whisper Large v3 Turbo transcription, and MeloTTS neural voice.
- Adds a bounded Cloudflare model fallback cascade for temporary model, capacity, timeout, and availability errors.
- Never retries or hides quota, billing, authentication, permission, or rate-limit failures.
- Excludes Cloudflare routes documented as requiring paid billing. Cloudflare's account-level free allocation and model-specific consumption still apply.
- Reads both classic Workers AI `response` results and current OpenAI-compatible `choices[].message.content` results.

## Context, reflection, and reliability

- Applies the selected 32K, 64K, or 120K managed-character budget globally across chat history, attachments, Memory Vault, synchronized semantic RAG, web evidence, and system instructions.
- Clamps coding input to a safe budget for the Qwen3 route.
- Preserves the most recent conversation messages when older context must be trimmed.
- Uses adaptive Generator → Critic → Revision for code, complex analysis, research, and higher-risk work while avoiding extra free calls for trivial chat.
- Keeps normal chat available when optional SearXNG research is temporarily unavailable and displays a clear notice that the answer has no live evidence.
- Applies the same graceful research behavior to local Ollama text requests.
- Enforces request-body byte limits even when a client omits the `Content-Length` header.
- Preserves the v1.14.1 protections against cloud-sync chat races and false interrupted-request messages.

## Unified self-check

- Adds `/aicheck`, `/selfcheck`, the natural phrases “check JARVIS brain” and “is JARVIS working,” plus a Settings button.
- Performs an authenticated live Cloudflare model inference and reports latency and the actual route.
- Reports Cloudflare AI, document conversion, encrypted D1 sync, Vectorize semantic memory, SearXNG research, managed context, paid-route policy, Windows desktop link, and updater status without exposing secrets.
- Distinguishes optional unconfigured resources from a failed core chat route.

## Free-Max profile and Help Center

- **ACTIVATE FREE-MAX UNIFIED BRAIN** enables automatic routing, Maximum reasoning, 120K managed context, adaptive reflection, web research, memory/RAG, encrypted sync, every Smart Skill, full responses, neural voice, and automatic spoken replies.
- The always-listening Hey JARVIS microphone remains a separate explicit privacy switch.
- Updates the searchable and downloadable Help Center with the current model matrix, global context behavior, adaptive reflection, live self-check, safe fallback behavior, optional-resource notices, and retained-function policy.
- Retains every natural command and slash command, Mission Control, Windows tools, files and Office/PSD analysis, local Ollama fallback, updater, voice, wake phrase, memory, synchronization, and safety confirmation.

## Verification

- 60 automated Worker and desktop tests.
- JavaScript syntax validation for Worker, Electron, preload, analyzers, updater, URL configuration, and Windows controls.
- JSON validation for package, desktop build, manifest, and Wrangler configuration files.
- Static audits for retired model IDs, retired Google/Gemini integration, version consistency, missing local references, embedded secrets, and installer workflow integrity.
