# JARVIS 1.11.0 — Smart Upgrade Pack

## New functions

- Mission Control with AI-generated 2–8 step plans, persistent mission status, a responsive dashboard, and explicit execution approval.
- Strict mission command filtering. Power, IoT, arbitrary shell, install, delete, registry, credential, and bypass commands cannot be generated as runnable mission steps.
- One-time Screen Vision in the Windows EXE/MSI and supported browsers. The desktop confirmation defaults to Cancel, the image is reduced before analysis, and continuous recording is never enabled.
- Windows IT Copilot with five fixed read-only checks: Windows/hardware, network configuration, storage health, automatic services not running, and recent System warnings/errors.
- Daily operational briefing with weather, desktop/update link status, active missions, and human-review count.
- Smart Skills Dashboard for Mission Control, Screen Vision, Windows IT Copilot, and proactive briefings.
- New commands: `/mission`, `/missions`, `/screen`, `/itcheck`, `/briefing`, and `/skills`.

## Preserved functions

All JARVIS 1.10.4 chat, Copilot, image, voice, weather, memory/RAG, reflection, human review, encrypted synchronization, Settings, Control Panel, application launch, Windows Command Center, IoT, PWA, EXE/MSI, and verified updater functions remain available.

## Verification

- Worker and desktop JavaScript syntax checks pass.
- 36 automated Worker, updater, URL-security, Windows-control, synchronization, vision, reflection, and Mission Control tests pass.
- The GitHub Actions release workflow builds `JARVIS-AI-Setup-1.11.0-x64.exe` and `JARVIS-AI-1.11.0-x64.msi` and publishes their SHA-256 update manifest.
