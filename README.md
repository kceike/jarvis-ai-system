# JARVIS AI System

An original, responsive personal AI, coding copilot, image generator, and voice assistant for Cloudflare Workers AI.

## Features

- General AI chat and multiple saved conversations
- Responsive JARVIS security login with one authorized account
- Spoken time-based greeting when the login page opens
- Distinct successful and failed login sounds, plus “Welcome, sir” after authentication
- Secure seven-day session cookie and a Log Out button on the home page
- Encrypted Cloudflare D1 synchronization across signed-in computers, phones, and tablets
- Revision-aware merging for conversations, deletions, preferences, corrections, and Memory Vault entries
- Helpful and correction buttons that feed a retrieval-based personalization loop
- Generator → critic → revision reflection with an optional human review queue
- Cloudflare Vectorize semantic embeddings for meaning-based synchronized memory retrieval
- Multimodal text, microphone, source-file, and PNG/JPEG/WebP vision input
- Responsive multimodal agent matrix showing the real orchestrator, memory, and tool flow
- Mission Control that converts goals into reviewable steps, preserves mission status across synchronized devices, and runs only approved allowlisted commands
- One-time Screen Vision for a user-approved desktop or browser screen capture, with continuous recording disabled
- Windows IT Copilot that collects five fixed read-only health sections and asks the AI for an evidence-based support analysis
- Daily proactive briefing with weather, desktop-update status, active missions, and pending human reviews
- Smart Skills Dashboard for enabling or disabling Mission Control, Screen Vision, Windows IT Copilot, proactive briefings, and the Knowledge Update Agent
- Responsive Help Center with searchable commands, complete function explanations, step-by-step tutorials, runnable examples, Copy Guide, and Save Guide (.md)
- Coding copilot for writing, reviewing, debugging, and explaining code
- Text-to-image generation
- Six selectable Cloudflare text models for economy, speed, general work, stronger answers, reasoning, and coding
- Optional Google Gemini API provider with long context, coding, vision, Deep Research, structured Knowledge Agent output, and Gemini Generator → Critic → Revision
- Optional local Ollama provider with no per-message cloud AI quota
- Optional current-web research through your own SearXNG server, with source links
- Controlled Knowledge Update Agent with two-query research, independent-domain checks, Generator + Critic validation, and mandatory human approval before RAG storage
- Local Memory Vault that learns by retrieval from JARVIS chats and explicit `/remember ...` notes
- Official ChatGPT export import (`conversations.json` and numbered conversation JSON files)
- Microphone dictation in supported browsers
- Spoken replies using an available English system voice
- Keyless current weather and three-day forecasts through Open-Meteo
- Safe website, web search, YouTube, and Google Maps launch commands
- Confirmed native Windows controls for 90+ Settings pages, classic Control Panel, and common applets
- Installed Start-menu app discovery and launch commands in the genuine EXE/MSI (`/apps`, `/app [name]`)
- Additive Windows Command Center for system utilities, approved folders, fixed read-only diagnostics, and double-confirmed PC actions
- Optional confirmed HTTPS IoT webhook actions through `/iot ...`
- Browser-visible local system, network, storage, screen, and battery diagnostics
- Safe local arithmetic calculator, direct speech, mute, help, and new-transmission commands
- Local text/source-file context (up to 200 KB each)
- Local conversation history and settings
- Copy, image download, and Markdown chat export
- Responsive desktop, tablet, and phone interface
- Automatic chat follow-scroll that keeps sent messages, processing state, and JARVIS replies above the composer
- A **Latest Response** button when you intentionally scroll away, plus dynamic spacing for mobile keyboards and attachments
- Installable Progressive Web App with standalone window, Start Menu support, and custom JARVIS icons
- Included no-admin Windows script installer plus Edge/Chrome Progressive Web App installation linked to the live Cloudflare website
- Build-ready standard Electron NSIS EXE and WiX MSI installers with a Windows build batch and GitHub Actions workflow
- Verified Windows EXE/MSI auto-updater that checks the linked JARVIS website, downloads in the background, and installs when the app closes
- Custom JARVIS reactor favicon in the browser address bar
- Graceful Cloudflare free-quota messaging
- No OpenAI API key required

## Deploy to Cloudflare

You need a free Cloudflare account and Node.js 20 or newer.

1. Extract the ZIP.
2. Open a terminal in the extracted `JARVIS_AI_SYSTEM` folder.
3. Run `npm install`.
4. Run `npx wrangler login` and approve the connection in your browser.
5. Run `npx wrangler vectorize create jarvis-memory-v1 --dimensions=384 --metric=cosine`. If it already exists, keep it and continue.
6. Run `npm run deploy`. Wrangler automatically provisions the included `JARVIS_SYNC_DB` D1 binding when it does not exist.
7. Run `npx wrangler d1 migrations apply JARVIS_SYNC_DB --remote`.
8. Run `npx wrangler secret put JARVIS_PASSWORD` and enter the private JARVIS login password.
9. Run `npx wrangler secret put JARVIS_SESSION_SECRET` and enter a long random session value.
10. Run `npx wrangler secret put JARVIS_SYNC_SECRET` and enter a separate long random encryption value.
11. Open the `workers.dev` address shown in the terminal.

The included `wrangler.jsonc` creates the `AI` binding automatically.

### Windows one-click update and upload

After extracting the ZIP, double-click:

`UPDATE_AND_UPLOAD_TO_CLOUDFLARE.bat`

The batch file will:

1. Check that Node.js and npm are installed.
2. Install or update the required project packages.
3. Check your Cloudflare login and open the official login flow if needed.
4. Create or reuse the 384-dimension semantic Vectorize index.
5. Run the included JARVIS tests.
6. Upload the latest files in the folder to your configured Cloudflare Worker.
7. Automatically provision and migrate the cross-device D1 database.
8. Securely prompt for the private login password when it has not been configured yet.
9. Automatically create the private Cloudflare login-session and synchronization encryption secrets when they do not exist yet.

Keep the BAT file in the same folder as `package.json`. Whenever you edit or replace JARVIS project files, run the BAT file again to update the live Cloudflare deployment. Do not close its window while an upload is in progress.

### One-click GitHub upload

Double-click `UPLOAD_TO_GITHUB.bat` to upload the extracted project to `kceike/jarvis-ai-system`. On its first run, the script can install Git for Windows and GitHub CLI through Windows Package Manager, then opens GitHub's official browser authorization. It also requests GitHub's `workflow` scope because that permission is required to upload the included Actions installer builder. It never asks for a GitHub password or personal access token in the command window.

The script initializes the folder, commits new or changed project files, pushes the `main` branch, and opens the repository Actions page. `.gitignore` excludes local Cloudflare development secrets, environment files, certificates, dependencies, generated installers, and ZIP archives. If the remote repository already has an unrelated manual-upload history, the script stops instead of force-overwriting it; use a new empty repository for the first one-click upload.

## Install the Windows app

JARVIS opens the live Cloudflare deployment in a standalone Microsoft Edge or Google Chrome application window. Login, AI, synchronization, and updates continue to come from the same website, so updating Cloudflare updates the Windows app immediately.

1. Finish deploying JARVIS with `UPDATE_AND_UPLOAD_TO_CLOUDFLARE.bat`.
2. Copy the complete HTTPS `workers.dev` address shown by Wrangler.
3. Right-click the downloaded ZIP, select **Extract All**, and open the extracted folder. Do not run the installer while it is still inside the ZIP.
4. Double-click `INSTALL_JARVIS_WINDOWS_APP.bat`.
5. Paste the HTTPS address when prompted, then use **JARVIS AI** from the Desktop or Start Menu.

The script installer:

- Installs for the current Windows user without administrator permission.
- Requires Microsoft Edge or Google Chrome for the live application window.
- Creates a dedicated app-style window without the normal browser address bar.
- Installs the custom JARVIS icon and Start Menu entries.
- Adds JARVIS to **Windows Settings → Apps → Installed apps** for removal.
- Stores only the website address locally; it does not embed the JARVIS password.

Use the Start Menu uninstaller, `UNINSTALL_JARVIS_WINDOWS_APP.bat`, or **Windows Settings → Apps → Installed apps** to remove the app. Uninstalling it does not delete the Cloudflare Worker, synchronized history, or D1/Vectorize data.

The previous custom `JARVIS_Setup.exe` has been withdrawn because it was not accepted by Windows on the tested PC. This package does not include another hand-crafted executable. The included BAT and PowerShell scripts use Windows' own installed scripting engine and are readable before running. If a company-managed PC blocks scripts, use the browser-native installation below or ask the device administrator to approve the project.

### Build a genuine EXE or MSI

The complete project now includes a secure Electron desktop wrapper and standard installer configurations. On a Windows PC with Node.js 22 LTS, double-click `BUILD_WINDOWS_INSTALLERS.bat`. It tests the desktop wrapper and builds:

- `desktop\dist\JARVIS-AI-Setup-1.13.9-x64.exe` — the recommended assisted NSIS installer.
- `desktop\dist\JARVIS-AI-1.13.9-x64.msi` — a WiX/MSI package for SCCM, Intune, Group Policy, and silent deployment.

The first launch asks for the live JARVIS HTTPS address. Press `Alt` and choose **JARVIS → Change website address** to replace it later. The remote page runs with Electron Node integration disabled, context isolation and Chromium sandboxing enabled, and external links restricted to the system browser. The native bridge validates the configured JARVIS origin, accepts only fixed Windows targets or applications returned by Windows itself, and shows a native confirmation before every computer action.

### Windows computer controls

Native computer controls require the genuine Electron EXE/MSI. They are intentionally unavailable in the normal browser, Progressive Web App, and lightweight BAT/Edge app because web pages must not receive unrestricted access to local programs.

Version 1.13.9 retains every v1.13.8 feature and earlier slash command. The small Gemini Interactions API diagnostic now uses the model-supported Low thinking level; normal Maximum requests still use High. Interrupted requests are recovered immediately on launch and whenever synchronized state reintroduces an unanswered user message, without the previous eight-second startup gap. Every normal answer remains in chat and is spoken automatically while Automatic voice response is enabled. All confirmations and permission boundaries remain enforced.

- `/mission [goal]` — create a 2–8 step plan. Model-generated commands are filtered through a strict allowlist; power, IoT, shell, install, delete, registry, credential, and bypass commands are rejected.
- `/missions` — open the responsive Mission Control dashboard and review, run, complete, skip, pause, resume, or cancel steps.
- `/screen [question]` — capture one selected screen for vision analysis. The Electron app shows a native confirmation that defaults to **Cancel**; browsers show their own screen picker. JARVIS never enables continuous recording.
- `/itcheck` — collect fixed read-only Windows, network, storage, service, and recent System event information, then request an AI support analysis. No repair is performed automatically.
- `/briefing` — show the current weather, desktop/update link status, active mission count, and pending human reviews. When enabled, JARVIS creates this once per local day.
- `/skills` — show the current Smart Skills status. Open Settings to change individual skills.
- `/help` or `/tutorial` — open the searchable Help Center. Select **SAVE GUIDE (.MD)** to store and download every command, function, and tutorial instruction.
- `/learn [topic]` — open the Knowledge Update Agent, research and cross-check a topic, review the cited proposals, and explicitly approve only the facts JARVIS may add to synchronized RAG memory.
- **Hey JARVIS** — enable it under Settings → Voice and Response. Say “Hey Jarvis” and wait for the acknowledgement, or say “Hey Jarvis, open Notepad” in one sentence. In the Windows EXE/MSI, minimize JARVIS to keep it available from the system tray; the wake phrase brings it to the front. It never bypasses confirmations for Windows, power, IoT, or other protected actions.

- `/settings` or “open Windows settings” — open Settings home.
- `/settings bluetooth`, `/settings display`, `/settings privacy`, `/settings update history`, and similar requests — open an allowlisted Settings page.
- `/controlpanel` — open classic Control Panel.
- `/controlpanel sound`, `/controlpanel programs`, `/controlpanel network`, and similar requests — open an allowlisted classic applet.
- `/apps` — list up to 20 apps registered in the current user’s Windows Start menu.
- `/app notepad`, `/app Microsoft Word`, or “launch Calculator” — find and open an installed Start-menu app.
- `/tools` and `/tool task manager` — list or open approved utilities such as Task Manager, Device Manager, Services, Event Viewer, Disk Management, PowerShell, Command Prompt, and Windows Terminal.
- `/folders` and `/folder downloads` — list or open approved local locations such as This PC, Documents, Downloads, Pictures, Recycle Bin, Network, and Startup.
- `/diagnostics` and `/diagnose ipconfig` — list or run fixed read-only reports including system information, identity, processes, drivers, connections, routes, DNS cache, power capabilities, services, and computer name.
- `/pc` — list approved session and power actions. Lock, sign out, restart, shut down, and hibernate require two native confirmations whose default button is **Cancel**.

JARVIS never treats chat text as a PowerShell, Command Prompt, or executable command. A native Windows confirmation identifies the exact target before it opens, and JARVIS does not automatically change the setting afterward. Apps that do not register in the Start menu are not discoverable through `/apps`. Diagnostic output becomes conversation content and can synchronize when cloud sync is enabled. Save all work before confirming any session or power action.

You may also upload the project to GitHub and run the included **Build JARVIS Windows Installers** workflow. See `BUILDING-EXE-MSI.md`. The resulting files are genuine installer packages, but they are unsigned until you configure a private Authenticode code-signing certificate. Windows may therefore show an **Unknown publisher** warning.

### Automatic EXE/MSI updates

Install JARVIS 1.10.0 or later manually once because an older executable cannot add an updater to itself. Then:

1. Upload the complete project to a public GitHub repository.
2. Run `UPLOAD_TO_GITHUB.bat`. It can safely attach a freshly extracted ZIP to the existing repository history, uploads the new version, and starts **Build JARVIS Windows Installers** automatically. The workflow publishes the EXE, MSI, and their SHA-256 update manifest as a GitHub Release.
3. Double-click `CONFIGURE_WINDOWS_AUTO_UPDATE.bat`, enter the repository as `owner/repository`, and allow it to redeploy the Cloudflare update endpoint through `npx wrangler deploy` without requiring a prior local `npm install`.

The installed app checks its linked JARVIS website shortly after launch and every six hours. When the website reports a higher stable desktop version, JARVIS chooses the matching EXE or MSI, downloads it over HTTPS, and verifies its SHA-256. When you approve the update or close JARVIS after it is ready, JARVIS opens the verified installer directly through Windows and then exits; complete the visible installer and select **Run JARVIS** on its finish screen. Select **Alt → JARVIS → Check for desktop update** for an immediate check or clear **Automatic desktop updates** to disable background checks.

The v1.10.1 hotfix accounts for Electron's documented limitation that `net.fetch()` may expose an incorrect or empty final response URL. JARVIS still requires the manifest installer address to use HTTPS, rejects any observed non-HTTPS final URL, enforces the 500 MB limit, and verifies the complete installer against its release SHA-256 before installation. Because v1.10.0 contains the earlier client-side check, install the corrected v1.10.1 manually once; automatic updating can then be tested with v1.10.2 and later.

The v1.10.3 installer-handoff hotfix removes the detached PowerShell stage. It launches the verified EXE/MSI directly as a visible Windows installer, waits for Windows to confirm that process started, and only then closes JARVIS. A launch failure is shown immediately instead of silently closing the app.

Normal website, interface, prompt, and Cloudflare AI changes do not require an installer update because the EXE/MSI already loads the live website. Publish a new native release only when desktop/Electron code, Windows controls, icons, or installer configuration changes.

### Install directly from the website

JARVIS is also a Progressive Web App. After the updated Worker is deployed, Edge or Chrome can display **INSTALL APP** in the JARVIS header. Select it to install the same standalone application through the browser. The install control stays hidden when the browser does not support installation or JARVIS is already running as an installed app.

The included service worker does not cache authenticated pages or AI responses. An internet connection remains required to open the secure website and use cloud features; locally stored browser conversations remain on the device.

## Single-user login

The only authorized username is `Kristian`. Use the password supplied when this build was created. The password is not included in the ZIP or `wrangler.jsonc`; the Windows batch stores it as an encrypted Cloudflare Worker secret.

Successful authentication creates an HttpOnly, Secure, SameSite session cookie that expires after seven days. Its private token comes from `JARVIS_SESSION_SECRET`, which the Windows deployment batch generates and stores privately in Cloudflare. Selecting **Log Out** removes the browser session immediately.

The login screen attempts to speak its greeting when opened. Some browsers block automatic speech until the page receives a click; successful and failed login sounds occur after the user presses the login button and are therefore more reliable.

## Free-use limits

Cloudflare Workers AI includes 10,000 Neurons per day at no charge, resetting at 00:00 UTC. It is not unlimited. JARVIS displays a clear message when the daily allowance is exhausted. Check the [current Workers AI pricing page](https://developers.cloudflare.com/workers-ai/platform/pricing/) before deployment because limits and model prices can change.

For operation without a per-message cloud AI quota, select Local Ollama in JARVIS Settings. Ollama runs on your own computer, so practical limits are your hardware, storage, electricity, and the model you install. It is not a hosted, unlimited service and is not automatically installed by this project.

Voice input and spoken replies use browser capabilities and do not consume Workers AI Neurons. Chrome or Edge has the broadest speech-recognition support. The available voice depends on the device and browser.

Cloud synchronization uses Cloudflare D1, which is available on the Workers Free plan but is not unlimited. At the time this build was prepared, Cloudflare documented free daily allowances of 5 million rows read and 100,000 rows written, with 5 GB total included storage. Current limits can change, so verify the [official D1 pricing page](https://developers.cloudflare.com/d1/platform/pricing/).

Semantic memory uses Cloudflare Vectorize. At the time this build was prepared, the Workers Free plan included 30 million queried vector dimensions and 5 million stored vector dimensions per month. Embedding generation also consumes Workers AI Neurons. Verify the [official Vectorize pricing](https://developers.cloudflare.com/vectorize/platform/pricing/) and [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) because these allowances can change.

## Cross-device synchronization

After running the Windows update-and-upload batch file, sign in to the same JARVIS Worker from each device with the single authorized account. JARVIS then:

- Pulls the latest cloud snapshot after login and while the page is active.
- Synchronizes approximately every 30 seconds and shortly after local changes.
- Merges conversations by their latest update time instead of blindly replacing the whole browser history.
- Carries conversation deletions and Memory Vault clearing to other devices.
- Synchronizes model preferences, response style, weather location, helpful ratings, corrections, and supported Memory Vault text.
- Detects a newer cloud revision and retries the merge before writing.
- Keeps working from local browser storage when offline, then retries after the connection returns.

The snapshot is encrypted inside the Worker with AES-GCM using the private `JARVIS_SYNC_SECRET` before it is written to D1. Transport also uses HTTPS. This is application-level server-side encryption, not end-to-end encryption: the deployed Worker can decrypt the data for an authenticated synchronization request.

Generated images are intentionally excluded from cloud synchronization. The encrypted snapshot accepts up to 850 KB of plaintext and prioritizes the newest text and memory entries; older items that do not fit remain on their original device. Select **Settings → Sync All Devices Now** for an immediate merge. **Replace Cloud With This Device** is a recovery control and requires confirmation.

The project uses Wrangler's [automatic resource provisioning](https://developers.cloudflare.com/changelog/post/2025-10-24-automatic-resource-provisioning/) and the included D1 migration. You do not need to copy a database identifier into the ZIP manually.

## Learning engine

JARVIS implements the requested learning components without claiming control over proprietary model training:

| Component | JARVIS implementation |
| --- | --- |
| Base model | Selectable Cloudflare Workers AI model or the device's Local Ollama model |
| Feedback loop | **Helpful** saves a successful answer; **Correct** asks what JARVIS should learn instead |
| Memory/knowledge base | Browser IndexedDB Memory Vault, encrypted synchronized D1 snapshot, and Cloudflare Vectorize embeddings |
| Updating mechanism | Hybrid Retrieval-Augmented Generation combines local keyword scoring with synchronized semantic similarity |
| Internet knowledge updates | Two SearXNG searches, URL deduplication, at least two independent source domains, Generator + Critic review, and explicit approval before storage |
| Reflection | A generator drafts, a fast critic returns `PASS`, `REVISE`, or `UNCERTAIN`, and the generator revises when needed |
| Human-in-the-loop | Uncertain answers enter the Settings review queue; approval or correction becomes clean feedback memory |
| Tool use | The orchestrator calls only approved functions for semantic memory, knowledge research, vision, web research, weather, browser actions, device pages, and configured IoT webhooks |

Corrections receive the highest retrieval priority. This changes the context used for later responses; it does not modify Cloudflare's or Ollama's underlying model weights. That distinction makes the behavior testable, reversible through **Clear Memory Vault**, and safer than hidden online weight updates.

Reflection is enabled by default. It can use three text-model calls for one answer (draft, critic, revision), and semantic retrieval can add one embedding call. Disable **Reflection and self-correction** in Settings when conserving the daily free AI allocation matters more than the extra review pass. Critic notes are used as short editorial feedback and are not exposed as hidden chain-of-thought.

## Multimodal agent matrix

The attached architecture has been implemented as this guarded flow:

```text
[Voice / Text / Vision Input] --> [Orchestrator LLM] --> [Approved Memory: local RAG + D1 + Vectorize]
                                      |
                                      +--> [Approved Tools: PC settings, weather/web APIs, IoT webhook]
                                      |
                                      +--> [Knowledge Generator] --> [Knowledge Critic] --> [Human Approval]
                                      |
                                      +--> [Reflection Critic] --> [Revision or Human Review Queue]
```

PNG, JPEG, and WebP attachments up to 2 MB can be analyzed in JARVIS and Copilot modes. Text/source attachments retain the 200 KB per-file context limit. Generated images remain a separate Vision mode and are not synchronized.

The included visual matrix deliberately says **multimodal agent matrix**, not AGI. This project coordinates capable models, memory, and tools, but it cannot honestly claim human-level general intelligence, unrestricted autonomy, perfect accuracy, or the ability to make anything. Tool calls remain allowlisted, explicit, and subject to browser, Cloudflare, model, and third-party service limits.

## Smart actions

Smart actions run through a deterministic command router, so simple local actions do not spend Cloudflare AI Neurons. You may type them or say them with the microphone button.

| Command | Example | Action |
| --- | --- | --- |
| `/weather [place]` | `/weather Iloilo City` | Gets current conditions and a three-day forecast |
| `/learn [topic]` | `/learn Windows 11 security updates` | Researches, cross-checks, and opens human-reviewed knowledge proposals; saves nothing automatically |
| `/open [site or URL]` | `/open youtube` | Opens an explicit HTTP or HTTPS website in a new tab |
| `/search [query]` | `/search Cloudflare Workers docs` | Opens DuckDuckGo search results |
| `/youtube [query]` | `/youtube Windows 11 tips` | Opens YouTube search results |
| `/maps [place]` | `/maps Iloilo City Hall` | Opens a Google Maps search |
| `/settings [area]` | `/settings bluetooth` | Asks Windows to open the matching Settings page |
| `/system` | `/system` | Shows information the browser exposes about this device |
| `/calculate [math]` | `/calculate (42*8)+7` | Calculates arithmetic locally without `eval` |
| `/iot [action]` | `/iot lights on` | After confirmation, posts an action to the configured HTTPS IoT webhook |
| `/speak [text]` | `/speak Systems are online` | Speaks the supplied text |
| `/mute` | `/mute` | Stops current voice output |
| `/help` | `/help` | Shows the complete command guide |

You can also use natural phrases such as `weather in Manila`, `open GitHub`, `search the web for Cloudflare`, `open Bluetooth settings`, or `show my computer info`. Set the fallback weather place in **JARVIS Settings → Smart Actions**.

Weather uses the official [Open-Meteo forecast](https://open-meteo.com/en/docs) and [geocoding](https://open-meteo.com/en/docs/geocoding-api) services without an API key. Availability and acceptable-use limits remain subject to Open-Meteo's current service terms; the project does not promise unlimited third-party service.

Browsers cannot silently change protected Windows settings, read private files, control other applications, or run arbitrary computer commands. `/settings` opens an official `ms-settings:` page and Windows or the browser may ask for permission. Website tabs can also require pop-up permission. These boundaries protect the computer from a compromised webpage.

### Optional IoT webhook

Set `IOT_WEBHOOK_URL` in `wrangler.jsonc` to an HTTPS endpoint that you control. If the endpoint requires authentication, run `npx wrangler secret put IOT_WEBHOOK_SECRET`; JARVIS sends it in the `x-jarvis-webhook-secret` header. Then redeploy. Every `/iot ...` action displays a confirmation before the Worker sends it, and the request times out after ten seconds. Do not point this at a webhook that performs dangerous physical actions without its own authorization, validation, and emergency controls.

## AI models

- Eco: `@cf/meta/llama-3.2-1b-instruct`
- Fast: `@cf/meta/llama-3.2-3b-instruct`
- Balanced: `@cf/meta/llama-3.1-8b-instruct-fp8-fast`
- Strong: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
- Reasoning: `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`
- Coding: `@cf/qwen/qwen3-30b-a3b-fp8`
- Images: `@cf/black-forest-labs/flux-1-schnell`
- Vision understanding: `@cf/meta/llama-3.2-11b-vision-instruct`
- Semantic embeddings: `@cf/baai/bge-small-en-v1.5` (384 dimensions)

The allowlist is near the top of `src/worker.js`. All Cloudflare options consume the same account-level free daily allocation at model-specific rates. Check the current catalog before changing IDs because models and billing requirements can change.

The Llama 3.2 Vision model requires acceptance of Meta's license in the Cloudflare account before first use. Follow the [official Cloudflare model page](https://developers.cloudflare.com/workers-ai/models/llama-3.2-11b-vision-instruct/) and accept the license deliberately; the batch file does not accept legal terms on your behalf.

## Google Gemini API — optional maximum profile

Gemini is optional. It does not replace or remove Cloudflare AI, Ollama, natural-language commands, slash commands, voice, memory, tools, or the Windows app.

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Double-click `CONFIGURE_GEMINI_API.bat` in the extracted project folder.
3. Paste the key only at Wrangler's hidden secret prompt. The helper stores it as the Cloudflare Worker secret `GEMINI_API_KEY` and redeploys JARVIS.
4. In JARVIS, open **Settings → Intelligence provider → Google Gemini API**.
5. For the strongest JARVIS profile, choose **Reasoning power → Maximum**, **Context window → 120K**, and leave **Reflection and self-correction** enabled.

The default is `gemini-3.7-flash`. The setup helper can store a validated `GEMINI_MODEL` override when Google changes model availability. Advanced deployers may also set `GEMINI_FAST_MODEL`, `GEMINI_REASONING_MODEL`, `GEMINI_CODE_MODEL`, and `GEMINI_VISION_MODEL`; JARVIS falls back to the primary model when an override is absent.

The maximum profile supports chat, coding, uploaded text and document context, PNG/JPEG/WebP vision, one-time Screen Vision, Windows IT report analysis, cited Deep Research, structured Knowledge Update generation/criticism, up to 8,192 output tokens, and Gemini-based Generator → Critic → optional Revision. Image generation, audio transcription, neural voice, embeddings, and other existing specialist modules keep their established Cloudflare routes.

Gemini is not unlimited. Free availability, rate limits, daily quotas, model access, pricing, and data handling are controlled by Google and can change. Review the current [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing), [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), and [terms](https://ai.google.dev/gemini-api/terms) before using confidential or regulated content. Never put a Gemini key in `wrangler.jsonc`, `.env`, JavaScript, GitHub, the browser, the EXE, or the MSI.

## Local AI with Ollama

1. Install [Ollama](https://ollama.com/download) on the computer that will run the model.
2. In a terminal, install a model, for example: `ollama pull qwen3:4b`.
3. Configure Ollama's allowed web origins so your exact `https://YOUR-WORKER.workers.dev` address may connect, then restart Ollama. See Ollama's `OLLAMA_ORIGINS` documentation for your operating system.
4. Open JARVIS Settings, choose **Local Ollama**, keep the default endpoint `http://localhost:11434/v1`, and enter the installed model name.

The browser must be on the same computer as Ollama. Browser CORS or private-network protections may require additional local configuration. Image generation still uses Cloudflare Workers AI.

## Web research with SearXNG

JARVIS can query a SearXNG metasearch server and give the AI current results with source URLs. Normal Web Research is off by default. The explicitly launched Knowledge Update Agent uses two searches, deduplicates up to ten results, and requires at least two source domains even when the normal Web Research toggle is off.

1. Use a SearXNG instance you control. Public instances often disable JSON output and may rate-limit requests.
2. Ensure the SearXNG JSON search format is enabled.
3. Double-click `CONFIGURE_KNOWLEDGE_AGENT.bat`, then enter the HTTPS base URL, for example `https://search.example.com`. The helper validates HTTPS, stores the address as a Cloudflare Worker secret, and redeploys JARVIS.
4. Enable **Web research** for cited normal chat answers. The Knowledge Update Agent is a separate explicit Smart Skill available through `/learn [topic]` or **Settings → Open Knowledge Update Agent**.

SearXNG aggregates configured search engines; it does not guarantee access to every page on the internet. Search titles, excerpts, URLs, and embedded instructions are treated as untrusted data. The Knowledge Agent shows its source links for your review, does not claim to read beyond returned excerpts, and cannot save any proposal without your approval. See the [SearXNG search API documentation](https://docs.searxng.org/dev/search_api.html).

## Personal Memory Vault and ChatGPT import

JARVIS does not secretly access a ChatGPT account. To bring supported chat text into JARVIS:

1. In ChatGPT, request an official export from **Settings → Data controls → Export**. See [OpenAI's export instructions](https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data).
2. Download and extract the export ZIP.
3. In JARVIS Settings, select **Import ChatGPT Export** and choose `conversations.json` or the numbered conversation JSON files.

The importer stores supported user and assistant text in IndexedDB on that browser. Images, uploaded files, account settings, memories, custom instructions, and GPT configurations are not imported. This is searchable retrieval, not model training or live synchronization. Re-import a newer export to update the vault; deterministic ChatGPT message IDs prevent duplicates when possible.

When Memory Vault is enabled, relevant excerpts accompany a matching question. Use `/remember I prefer concise technical answers` to add an explicit note. Use **Clear Memory Vault** to permanently erase the local entries.

## Local preview

After `npm install`, run `npm run dev`. Workers AI uses your Cloudflare account even during local development. Without a working AI binding, JARVIS falls back to a setup response so the UI, history, export, and voice controls remain testable.

## Privacy and safety

- Conversation history, imported ChatGPT text, feedback, and Memory Vault entries are stored in the current browser. When Cloud Sync is enabled, the newest supported text is also encrypted and synchronized through your Cloudflare account.
- Attached text and relevant Memory Vault excerpts are sent to the selected AI provider as context for that request. With Local Ollama, they are sent to the configured Ollama endpoint.
- Web-research queries are sent to the SearXNG server configured by the deployer.
- Vector embeddings and image-analysis requests are sent to Cloudflare Workers AI when those modules are used.
- `/iot` actions are sent only after confirmation to the HTTPS webhook configured by the deployer.
- The login password is stored as an encrypted Cloudflare secret and is not embedded in the project files.
- The cloud synchronization encryption key is a separate Cloudflare secret and is not embedded in the project files.
- Review important answers and test generated code safely.
- Add Cloudflare Access or rate limiting for stronger brute-force protection before sharing the deployment address publicly.
- This project does not contain proprietary ChatGPT, Microsoft Copilot, Marvel, or actor voice technology. Its persona and visual interface are original and JARVIS-inspired.
