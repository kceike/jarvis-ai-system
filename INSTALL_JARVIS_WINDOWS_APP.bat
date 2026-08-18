@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title JARVIS AI - Windows App Installer
color 0B

echo ============================================================
echo            JARVIS AI - WINDOWS APP INSTALLER
echo ============================================================
echo.
echo This installs JARVIS as a Windows desktop and Start Menu app.
echo It connects directly to your deployed Cloudflare website.
echo Administrator permission is not required.
echo IMPORTANT: Extract the complete ZIP before running this file.
echo.

if not exist "windows-app\Install-Jarvis.ps1" (
  echo [ERROR] windows-app\Install-Jarvis.ps1 was not found.
  echo Right-click the ZIP, choose Extract All, then run this file
  echo from the extracted JARVIS folder.
  goto :failed
)

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Windows PowerShell was not found on this PC.
  echo Open the JARVIS website in Edge and use Apps ^> Install this site as an app.
  goto :failed
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-app\Install-Jarvis.ps1"
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo SUCCESS: JARVIS is installed as a Windows app.
echo Use the Desktop or Start Menu shortcut to open it.
echo ============================================================
echo.
pause
exit /b 0

:failed
echo.
echo Installation was not completed. Review the message above.
echo.
pause
exit /b 1
