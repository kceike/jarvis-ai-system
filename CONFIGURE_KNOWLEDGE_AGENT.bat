@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title JARVIS AI - Configure Knowledge Update Agent
color 0B

echo ============================================================
echo       JARVIS AI - KNOWLEDGE UPDATE AGENT SETUP
echo ============================================================
echo.
echo This connects JARVIS to an HTTPS SearXNG server that you
echo control. Public instances may block JSON results or rate-limit
echo requests. JARVIS will never save research without approval.
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

echo Checking your Cloudflare login...
call npx.cmd wrangler whoami >nul 2>&1
if errorlevel 1 (
  call npx.cmd wrangler login
  if errorlevel 1 goto :failed
)

echo.
echo Enter the complete HTTPS base address when prompted.
echo Example: https://search.example.com
powershell -NoProfile -ExecutionPolicy Bypass -Command "$secure=Read-Host 'SearXNG HTTPS address' -AsSecureString; $ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure); try{$plain=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr); $uri=$null; if(-not [Uri]::TryCreate($plain,[UriKind]::Absolute,[ref]$uri) -or $uri.Scheme -ne 'https' -or $uri.UserInfo){throw 'Enter a complete HTTPS address without a username or password.'}; $plain.TrimEnd('/') | & npx.cmd wrangler secret put SEARXNG_URL; exit $LASTEXITCODE} catch {Write-Host ('[ERROR] '+$_.Exception.Message); exit 2} finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}"
if errorlevel 1 goto :failed

echo Deploying the configured Knowledge Update Agent...
call npx.cmd wrangler deploy
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo SUCCESS: Knowledge Update Agent search is connected.
echo Open JARVIS and type: /learn Windows 11 security updates
echo Review sources and select proposals before approving them.
echo ============================================================
echo.
pause
exit /b 0

:failed
echo.
echo [ERROR] Knowledge Update Agent setup did not complete.
echo Confirm the HTTPS SearXNG address, internet, and Cloudflare login.
echo.
pause
exit /b 1
