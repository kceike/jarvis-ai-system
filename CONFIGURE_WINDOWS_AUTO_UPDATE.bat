@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title JARVIS AI - Configure Windows Auto Update
color 0B

echo ============================================================
echo       JARVIS AI - WINDOWS AUTO UPDATE CONFIGURATION
echo ============================================================
echo.
echo First publish a Windows release using the included GitHub
echo Actions workflow. The GitHub repository must be public so
echo installed JARVIS apps can download the verified installers.
echo.

if not exist "wrangler.jsonc" (
  echo [ERROR] Keep this BAT file inside the complete JARVIS project.
  goto :failed
)

where npx.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js and npm are required.
  goto :failed
)

set "JARVIS_GITHUB_REPOSITORY="
set /p "JARVIS_GITHUB_REPOSITORY=Enter GitHub owner/repository, for example kristian/jarvis: "
if not defined JARVIS_GITHUB_REPOSITORY goto :failed

for /f "delims=" %%U in ('powershell -NoProfile -Command "$repo=$env:JARVIS_GITHUB_REPOSITORY.Trim(); if($repo -notmatch '^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$'){exit 2}; 'https://github.com/'+$repo+'/releases/latest/download/jarvis-desktop-update.json'"') do set "JARVIS_DESKTOP_MANIFEST_URL=%%U"
if not defined JARVIS_DESKTOP_MANIFEST_URL (
  echo [ERROR] Enter only the GitHub owner and repository name.
  goto :failed
)

echo.
echo Checking your Cloudflare login...
call npx.cmd wrangler whoami >nul 2>&1
if errorlevel 1 (
  call npx.cmd wrangler login
  if errorlevel 1 goto :failed
)

echo Registering the stable JARVIS release channel...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:JARVIS_DESKTOP_MANIFEST_URL | & npx.cmd wrangler secret put JARVIS_DESKTOP_MANIFEST_URL; exit $LASTEXITCODE"
if errorlevel 1 goto :failed

echo Deploying the update endpoint to your linked JARVIS website...
call npx.cmd wrangler deploy
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo SUCCESS: Windows automatic updates are connected.
echo Existing JARVIS EXE/MSI apps check every six hours and when
echo manually selected from JARVIS ^> Check for desktop update.
echo Verified updates install automatically when JARVIS closes.
echo ============================================================
echo.
pause
exit /b 0

:failed
echo.
echo [ERROR] Auto-update configuration did not complete.
echo Confirm the repository name, release, internet, and login.
echo.
pause
exit /b 1
