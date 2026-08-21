@echo off
setlocal EnableExtensions
title JARVIS AI - Configure Google Gemini API
color 0B
cd /d "%~dp0"

echo ============================================================
echo       JARVIS AI - SECURE GEMINI API CONFIGURATION
echo ============================================================
echo.
echo This stores your Gemini API key only as a Cloudflare Worker
echo secret. It is not written to this project, GitHub, the website,
echo browser storage, the EXE, or the MSI.
echo.
echo Get a key from: https://aistudio.google.com/app/apikey
echo Gemini free quota is limited. Google controls model availability,
echo quotas, pricing, and free-tier data handling.
echo.

where npx >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js and npm are required.
  echo Download the current Node.js LTS release from https://nodejs.org/
  pause
  exit /b 1
)

echo Checking your Cloudflare login...
call npx wrangler whoami >nul 2>&1
if errorlevel 1 (
  echo Cloudflare login is required. Your browser will open now.
  call npx wrangler login
  if errorlevel 1 goto :failed
)

echo.
echo Wrangler will now ask for the Gemini API key securely.
echo Paste the key at Wrangler's hidden prompt, then press Enter.
call npx wrangler secret put GEMINI_API_KEY
if errorlevel 1 goto :failed

echo.
echo Default Gemini model: gemini-3.7-flash
echo You may override it when Google changes model availability.
choice /C YN /N /M "Set a custom Gemini model name now? [Y/N]: "
if errorlevel 2 goto :deploy
if errorlevel 1 (
  echo Enter only a model name such as gemini-3.7-flash.
  call npx wrangler secret put GEMINI_MODEL
  if errorlevel 1 goto :failed
)

:deploy
echo.
echo Deploying the secure Gemini-enabled JARVIS Worker...
call npx wrangler deploy
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo SUCCESS: Gemini is connected securely to JARVIS.
echo Open JARVIS Settings and select Google Gemini API.
echo For the strongest profile choose:
echo   Reasoning power: Maximum
echo   Context window: 120K
echo   Reflection and self-correction: On
echo ============================================================
pause
exit /b 0

:failed
echo.
echo [ERROR] Gemini configuration did not complete.
echo No API key was written into the project files.
echo Review the message above, then run this BAT again.
pause
exit /b 1
