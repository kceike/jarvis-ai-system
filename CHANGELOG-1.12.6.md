# JARVIS AI 1.12.6

## Added — Knowledge Update Agent

- `/learn [topic]` and natural “update your knowledge about …” commands.
- Dedicated responsive review dashboard available from Settings.
- Two SearXNG searches per update with URL deduplication and up to ten evidence results.
- Mandatory support from at least two distinct source domains before a claim can become a proposal.
- Generator AI creates durable factual candidates; Critic AI independently rejects unsupported, unsafe, speculative, personal, or instruction-like content.
- Source links, confidence, and verification reasons shown for every surviving proposal.
- Select All, Clear Selection, Reject Draft, and Approve Selected controls.
- Approved entries use the `knowledge` Memory Vault source and participate in encrypted synchronization and semantic RAG.

## Safety behavior

- Research results, titles, excerpts, URLs, and embedded instructions are treated as untrusted data.
- No endpoint writes directly to Memory Vault, D1, or Vectorize.
- Unselected, rejected, single-source, and Critic-rejected findings are discarded.
- A signed-in user must explicitly select and approve every stored claim.
- This updates retrieval memory only; it does not retrain or modify AI model weights.

## Preserved

- Settings title overlap correction on desktop and mobile.
- Immediate Always Listen `STARTING`, `ON`, and `OFF` state handling.
- Native wake-word listener, system-tray restoration, updater, Windows controls, Help Center, Mission Control, and confirmation safeguards.
