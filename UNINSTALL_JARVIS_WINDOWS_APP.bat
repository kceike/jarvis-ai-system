@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title JARVIS AI - Windows App Uninstaller
color 0B

if exist "%LOCALAPPDATA%\JARVIS\Uninstall-Jarvis.ps1" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%LOCALAPPDATA%\JARVIS\Uninstall-Jarvis.ps1"
) else if exist "windows-app\Uninstall-Jarvis.ps1" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-app\Uninstall-Jarvis.ps1"
) else (
  echo [ERROR] The JARVIS uninstaller was not found.
  pause
  exit /b 1
)

if errorlevel 1 (
  echo JARVIS could not be completely removed.
  pause
  exit /b 1
)

echo JARVIS Windows app was removed. Your cloud data was not deleted.
pause
exit /b 0
