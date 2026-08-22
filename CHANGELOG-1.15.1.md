# JARVIS 1.15.1 — Account-Bound Brain Diagnostics

## Fixed

- Corrected `/aicheck` so it no longer combines allocation, authentication, permission, billing, rate-limit, timeout, and model failures into one misleading message.
- Corrected ordinary chat so an access or permission failure is not reported as “daily free allowance reached.”
- Added safe model-specific access fallback while preserving immediate stop behavior for account-wide allocation, rate-limit, and billing failures.
- Removed restrictive health-probe output parameters so every route is tested using the basic Cloudflare Workers AI binding format.

## Added

- Account-bound probes for the general GLM 4.7 Flash, Qwen3 code, GPT-OSS 120B reasoning, and Llama 4 Scout vision-text routes.
- Per-route status, latency, model identifier, sanitized Cloudflare error classification, and error code.
- A route summary showing tested, ready, and failed routes plus whether account-bound inference was reached.
- Redaction of bearer credentials, URL tokens, API-key-shaped strings, and oversized diagnostic text before any error reaches the browser.
- Regression coverage for route matrices, sanitized failures, model-specific access fallback, and correct account-access messaging.

## Preserved

All v1.15.0 functions remain available, including the Free-Max Unified Brain, adaptive reflection, 120K managed context, natural and slash commands, Memory Vault/RAG, D1 synchronization, Knowledge Update Agent, SearXNG research, Office/PSD/file analysis, image generation, screen vision, speech, wake phrase, Mission Control, Windows tools, tray behavior, verified updater, EXE/MSI workflow, and optional local Ollama.

