@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title JARVIS AI - Build EXE and MSI Installers
color 0B

echo ============================================================
echo       JARVIS AI - STANDARD WINDOWS INSTALLER BUILDER
echo ============================================================
echo.
echo This builds a standard NSIS Setup EXE and WiX MSI package.
echo Node.js 22 LTS and an internet connection are recommended.
echo.

where node.exe >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or is missing from PATH.
  echo Install Node.js 22 LTS, reopen this folder, and try again.
  goto :failed
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Repair or reinstall Node.js 22 LTS.
  goto :failed
)

if not exist "desktop\package.json" (
  echo [ERROR] desktop\package.json is missing.
  echo Keep this BAT file inside the complete extracted JARVIS project.
  goto :failed
)

for /f "delims=" %%V in ('node -p "process.versions.node.split('.')[0]"') do set "JARVIS_NODE_MAJOR=%%V"
if not "%JARVIS_NODE_MAJOR%"=="22" (
  echo [WARNING] Node.js %JARVIS_NODE_MAJOR% is installed. Node.js 22 LTS is the tested build version.
  echo.
)

pushd "desktop"
echo [1/3] Installing the pinned Electron Windows build tools...
call npm install --no-audit --no-fund
if errorlevel 1 goto :build_failed

echo.
echo [2/3] Testing the secure desktop URL and navigation rules...
call npm test
if errorlevel 1 goto :build_failed

echo.
echo [3/3] Building the genuine Windows EXE and MSI installers...
call npm run dist
if errorlevel 1 goto :build_failed
popd

echo.
echo ============================================================
echo SUCCESS: Windows installers were created in:
echo %~dp0desktop\dist
echo.
echo Recommended: JARVIS-AI-Setup-1.12.3-x64.exe
echo Enterprise:  JARVIS-AI-1.12.3-x64.msi
echo ============================================================
echo.
pause
exit /b 0

:build_failed
popd
echo.
echo [ERROR] The Windows installer build did not complete.
echo Review the message above. Confirm internet access and Node.js 22 LTS.

:failed
echo.
pause
exit /b 1
