# JARVIS 1.13.2

- Added dedicated Photoshop PSD analysis to the genuine Windows EXE/MSI.
- Extracts standard PSD canvas dimensions, channels, bit depth, color mode, layer hierarchy, names, visibility, opacity, blend modes, bounds, masks, Smart Object indicators, and available text-layer content.
- PSD reports can be used immediately in chat or explicitly approved through `/learnfiles` for Memory Vault RAG.
- Parsing is structure-only: layer pixels, composite pixels, thumbnails, and linked-file payloads are skipped.
- PSD actions, macros, scripts, and embedded content are never executed.
- Enforces a 20 MB PSD limit and a 500-layer report limit.
- Standard PSD is supported; PSB large-document format and some newer Photoshop features are not.
