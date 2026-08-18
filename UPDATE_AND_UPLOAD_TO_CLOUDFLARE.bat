@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title JARVIS AI - Update and Upload to Cloudflare
color 0B

echo ============================================================
echo        JARVIS AI - CLOUDFLARE UPDATE AND UPLOAD
echo ============================================================
echo.
echo This will test and deploy the files in this folder.
echo Cloudflare Workers AI usage is subject to your account limits.
echo.

if not exist "package.json" (
  echo [ERROR] package.json was not found.
  echo Keep this BAT file inside the extracted JARVIS project folder.
  goto :failed
)

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or is not in PATH.
  echo Install the LTS version from https://nodejs.org/ and run this file again.
  goto :failed
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm is not available.
  echo Reinstall the Node.js LTS version, then run this file again.
  goto :failed
)

echo [1/9] Installing or updating required packages...
call npm install
if errorlevel 1 (
  echo [ERROR] Package installation failed.
  goto :failed
)

echo.
echo [2/9] Checking your Cloudflare login...
call npx wrangler whoami >nul 2>&1
if errorlevel 1 (
  echo Cloudflare login is required. Your browser will open.
  call npx wrangler login
  if errorlevel 1 (
    echo [ERROR] Cloudflare login was not completed.
    goto :failed
  )
) else (
  echo Cloudflare account is connected.
)

echo.
echo [3/9] Preparing the semantic Memory Vault index...
call npx wrangler vectorize get jarvis-memory-v1 >nul 2>&1
if errorlevel 1 (
  echo Creating the free-tier compatible 384-dimension Vectorize index...
  call npx wrangler vectorize create jarvis-memory-v1 --dimensions=384 --metric=cosine
  if errorlevel 1 (
    echo [ERROR] The semantic Memory Vault index could not be created.
    goto :failed
  )
) else (
  echo Semantic Memory Vault index is already configured.
)

echo.
echo [4/9] Running JARVIS safety tests...
call npm test
if errorlevel 1 (
  echo [ERROR] Tests failed. Upload stopped to protect the live version.
  goto :failed
)

echo.
echo [5/9] Uploading the latest JARVIS version to Cloudflare...
call npm run deploy
if errorlevel 1 (
  echo [ERROR] Cloudflare deployment failed.
  goto :failed
)

echo.
echo [6/9] Preparing the encrypted cross-device database...
call npx wrangler d1 migrations apply JARVIS_SYNC_DB --remote
if errorlevel 1 (
  echo [ERROR] The JARVIS synchronization database could not be prepared.
  goto :failed
)

echo.
echo [7/9] Verifying the private JARVIS login password...
call npx wrangler secret list 2>nul | findstr /I "JARVIS_PASSWORD" >nul
if errorlevel 1 (
  echo Enter the JARVIS login password when prompted.
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$secure=Read-Host 'JARVIS login password' -AsSecureString; $ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure); try{$plain=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr); $plain | & npx.cmd wrangler secret put JARVIS_PASSWORD; exit $LASTEXITCODE} finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}"
  if errorlevel 1 (
    echo [ERROR] The private JARVIS login password could not be saved.
    goto :failed
  )
) else (
  echo Private JARVIS login password is already configured.
)

echo.
echo [8/9] Verifying the secure login session key...
call npx wrangler secret list 2>nul | findstr /I "JARVIS_SESSION_SECRET" >nul
if errorlevel 1 (
  echo Creating a private Cloudflare session key for JARVIS...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$bytes=New-Object byte[] 32; $rng=[Security.Cryptography.RandomNumberGenerator]::Create(); try{$rng.GetBytes($bytes)} finally{$rng.Dispose()}; $secret=[Convert]::ToBase64String($bytes); $secret | & npx.cmd wrangler secret put JARVIS_SESSION_SECRET; exit $LASTEXITCODE"
  if errorlevel 1 (
    echo [ERROR] The JARVIS login session key could not be created.
    goto :failed
  )
) else (
  echo Secure login session key is already configured.
)

echo.
echo [9/9] Verifying the encrypted cloud synchronization key...
call npx wrangler secret list 2>nul | findstr /I "JARVIS_SYNC_SECRET" >nul
if errorlevel 1 (
  echo Creating a private encryption key for synchronized JARVIS data...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$bytes=New-Object byte[] 32; $rng=[Security.Cryptography.RandomNumberGenerator]::Create(); try{$rng.GetBytes($bytes)} finally{$rng.Dispose()}; $secret=[Convert]::ToBase64String($bytes); $secret | & npx.cmd wrangler secret put JARVIS_SYNC_SECRET; exit $LASTEXITCODE"
  if errorlevel 1 (
    echo [ERROR] The encrypted synchronization key could not be created.
    goto :failed
  )
) else (
  echo Encrypted cloud synchronization key is already configured.
)

echo.
echo ============================================================
echo SUCCESS: JARVIS AI was updated on Cloudflare.
echo Login security is active for the single authorized account.
echo Encrypted cross-device synchronization is active.
echo Semantic Vectorize memory and reflection modules are active.
echo To add the Windows desktop app, run INSTALL_JARVIS_WINDOWS_APP.bat.
echo The live workers.dev address is shown above.
echo ============================================================
echo.
pause
exit /b 0

:failed
echo.
echo ============================================================
echo Upload was stopped. Review the error above, then try again.
echo Your existing live Cloudflare deployment was not replaced by
echo this script unless Wrangler reported a successful deployment.
echo ============================================================
echo.
pause
exit /b 1
