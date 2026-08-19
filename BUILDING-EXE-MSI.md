# Build the genuine JARVIS EXE and MSI

JARVIS 1.11.2 includes a secure Electron desktop wrapper and standard electron-builder configurations for two Windows formats:

- `JARVIS-AI-Setup-1.11.2-x64.exe` — assisted NSIS installer for normal personal installation.
- `JARVIS-AI-1.11.2-x64.msi` — WiX/MSI installer for IT deployment, SCCM, Intune, Group Policy, and standard `/quiet` or `/passive` installation.

These files must be compiled on a real Windows build runner. They are not hand-crafted PE files.

## Build on your Windows PC

1. Install **Node.js 22 LTS**.
2. Extract the complete JARVIS project ZIP.
3. Double-click `BUILD_WINDOWS_INSTALLERS.bat`.
4. Wait while it downloads the pinned Electron build tools, tests the desktop wrapper, and creates both installers.
5. Open `desktop\dist` and use the EXE or MSI.

The first launch asks for the complete HTTPS address of your deployed JARVIS Cloudflare website. Press `Alt` inside the desktop app and choose **JARVIS → Change website address** if it must be changed later.

The EXE/MSI edition is required for `/controlpanel`, `/apps`, `/app [name]`, `/tools`, `/folders`, `/diagnostics`, `/pc`, and confirmed native Windows Settings commands. Install version 1.10.0 or later once to add the updater; versions that predate the updater cannot install it themselves.

The v1.11.2 Smart Upgrade Pack is additive: every earlier JARVIS feature and command remains present. It fixes Help Center title overlap with a separate scrollable guide while preserving the searchable guide, offline Markdown export, Screen Vision confirmations, fixed read-only IT checks, Mission Control allowlists, and the verified visible installer handoff.

## Build with GitHub Actions

Upload the complete project to a **public** GitHub repository. `UPLOAD_TO_GITHUB.bat` safely attaches a freshly extracted project to the existing `origin/main` history when necessary, preserves GitHub-only tracked files, and starts **Build JARVIS Windows Installers** automatically after a successful push. The Windows job builds both installers, computes their SHA-256 hashes, publishes a versioned GitHub Release, and creates `jarvis-desktop-update.json`. It also provides the `JARVIS-Windows-Installers` workflow artifact.

After the first release is published, run `CONFIGURE_WINDOWS_AUTO_UPDATE.bat` and enter `owner/repository`. The script links your Cloudflare website to the stable release manifest. Installed JARVIS apps check the website twelve seconds after launch and every six hours, download only a higher stable version, and verify the selected installer hash. JARVIS then opens the verified EXE/MSI directly as a visible Windows installer and closes only after Windows confirms the process started. Use **Alt → JARVIS → Check for desktop update** to check immediately.

Website-only changes still arrive from Cloudflare without an EXE/MSI reinstall. A native update occurs only when `desktop/package.json` has a higher `x.y.z` version and that version's workflow publishes new installers. Always update both root and desktop package versions together before publishing.

## Security and signing

The remote JARVIS website runs with Node integration disabled, context isolation enabled, Chromium sandboxing enabled, HTTPS-only navigation, and restricted permissions. External HTTPS links open in the default browser. Privileged IPC validates the configured top-level JARVIS origin. Settings, Control Panel, tools, folders, diagnostics, and PC actions resolve through fixed allowlists; app launches resolve only through entries discovered from the current user’s Windows Start menu. Every native computer action requires visible confirmation, arbitrary CMD or PowerShell text is never executed, and captured diagnostic output is shortened before it returns to chat.

The updater accepts only HTTPS manifests and installer links, caps downloads at 500 MB, and verifies the exact SHA-256 from the manifest before installation. The generated installers remain **unsigned** unless a private Windows code-signing certificate is configured. A hash protects against a corrupted or mismatched download, while Authenticode provides stronger publisher identity. Windows may show an **Unknown publisher** or SmartScreen warning. Production distribution should use an Authenticode certificate; never place a private signing certificate or password directly in this project ZIP.

Electron bundles its own Chromium runtime, so these installers are much larger than the BAT/PWA version. Cloudflare remains the live backend, and updating the deployed Worker updates the desktop experience without rebuilding the installer.
