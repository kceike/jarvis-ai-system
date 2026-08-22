# JARVIS 1.15.1 Release Audit

## Result

The v1.15.1 source package is release-ready. The patch repairs the misleading v1.15.0 Cloudflare inference diagnostic without removing earlier features.

## Verified

- 63 automated Worker and Windows desktop tests pass.
- The authenticated brain self-check probes four account-bound routes independently.
- Allocation, rate-limit, billing, access, timeout, model, and unknown failures are classified separately.
- Diagnostic output redacts bearer credentials, URL tokens, API-key-shaped strings, and is length-bounded.
- Ordinary chat can recover from a model-specific access failure through a configured free fallback route.
- Account-wide allocation, rate-limit, and billing failures stop immediately instead of wasting additional requests.
- Login, sessions, chat, reflection, research, Knowledge Update Agent, D1 sync, Vectorize RAG, document conversion, voice, image, mission, IoT, desktop controls, updater, and installers remain covered.
- Version identifiers agree on 1.15.1 across Worker, login, PWA cache, package metadata, desktop package, Windows installer script, build output, documentation, and tests.

## Live deployment check

After `UPDATE_AND_UPLOAD_TO_CLOUDFLARE.bat` deploys the Worker, run `/aicheck`. The report uses the deployed account-bound `AI` binding and shows the exact sanitized result for GLM, Qwen, GPT-OSS, and Llama. The public Cloudflare Playground is not treated as proof of account-bound inference.

