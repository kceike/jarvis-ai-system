# JARVIS 1.13.0 — Maximum Intelligence

## Intelligence and reasoning

- Added **Auto Director** routing for general, reasoning, and coding requests.
- Added Standard, Deep, and Maximum reasoning profiles.
- Maximum mode uses a stronger task model, reasoning Critic, revision pass, and larger output budget.
- Added configurable 32K, 64K, and 120K context limits.
- Expanded local Ollama requests with context and generation controls.

## Research, files, vision, and voice

- Added `/deepresearch [question]` with four searches, URL deduplication, up to eighteen sources, disagreement analysis, and cited synthesis.
- Added PDF, DOCX, XLSX, and PPTX conversion through Cloudflare Workers AI Markdown Conversion.
- Increased plain-text attachment support and added MP3, WAV, WebM, MP4, and M4A transcription through Whisper.
- Added optional Cloudflare neural speech with automatic Windows/browser voice fallback.
- Preserved one-time, user-approved Screen Vision and existing image generation.

## Windows and local AI

- Added `/filesearch [name or text]` to the genuine EXE/MSI. The user must select the folder in a native picker; hidden folders, oversized files, and broad scans are restricted.
- Added `SETUP_MAX_LOCAL_AI.bat`, which detects physical memory and asks before applying Ollama settings or downloading chat, coding, vision, and embedding models.
- Added Flash Attention, adaptive context, and model-size recommendations without pretending unsupported hardware can run the largest model.

## Image and video generation

- Preserved Cloudflare FLUX image generation.
- Added `/video [description]` through an optional credential-free HTTPS provider endpoint.
- Added `CONFIGURE_VIDEO_GENERATION.bat`; secrets remain in Cloudflare and are not saved in the project.

## Safety and compatibility

- Every previous command, Memory Vault rule, Knowledge Update approval rule, sync function, updater, and native Windows confirmation remains present.
- Paid third-party models are never represented as unlimited or free. JARVIS continues to prefer Cloudflare’s free allocation and local Ollama processing.
