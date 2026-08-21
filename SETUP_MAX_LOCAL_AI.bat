@echo off
setlocal EnableExtensions EnableDelayedExpansion
title JARVIS AI - Maximum Local Processing Setup
color 0B

echo ============================================================
echo       JARVIS AI - ADAPTIVE MAXIMUM LOCAL PROCESSING
echo ============================================================
echo.
echo This setup detects system memory, selects a practical Ollama model,
echo and configures a large local context. Models require several GB.
echo Nothing is installed or downloaded without your confirmation.
echo.

where ollama.exe >nul 2>nul
if errorlevel 1 (
  echo [STOPPED] Ollama is not installed or is not in PATH.
  echo Download the official Windows installer from:
  echo https://ollama.com/download/windows
  echo Install Ollama, restart Windows Terminal, then run this BAT again.
  pause
  exit /b 1
)

for /f %%R in ('powershell.exe -NoProfile -Command "[math]::Floor((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB)"') do set "RAM_GB=%%R"
if not defined RAM_GB set "RAM_GB=8"
set "CHAT_MODEL=qwen3:4b"
set "CODE_MODEL=qwen2.5-coder:3b"
set "VISION_MODEL=gemma3:4b"
set "CONTEXT=32768"
set "PARALLEL=1"

if !RAM_GB! GEQ 16 (
  set "CHAT_MODEL=qwen3:8b"
  set "CODE_MODEL=qwen2.5-coder:7b"
  set "CONTEXT=65536"
)
if !RAM_GB! GEQ 32 (
  set "CHAT_MODEL=qwen3:14b"
  set "CODE_MODEL=qwen2.5-coder:14b"
  set "VISION_MODEL=gemma3:12b"
  set "CONTEXT=98304"
)
if !RAM_GB! GEQ 64 (
  set "CHAT_MODEL=qwen3:30b-a3b"
  set "CODE_MODEL=qwen2.5-coder:32b"
  set "VISION_MODEL=gemma3:27b"
  set "CONTEXT=131072"
  set "PARALLEL=2"
)

echo Detected physical memory: !RAM_GB! GB
echo Recommended general model: !CHAT_MODEL!
echo Recommended coding model:  !CODE_MODEL!
echo Recommended vision model:  !VISION_MODEL!
echo Local context target:       !CONTEXT! tokens
echo.
choice /C YN /N /M "Apply this local profile and download the models? (Y/N): "
if errorlevel 2 (
  echo Setup cancelled. No Ollama settings or models were changed.
  pause
  exit /b 0
)

setx OLLAMA_CONTEXT_LENGTH !CONTEXT! >nul
setx OLLAMA_NUM_PARALLEL !PARALLEL! >nul
setx OLLAMA_MAX_LOADED_MODELS 2 >nul
setx OLLAMA_FLASH_ATTENTION 1 >nul
echo.
echo Pulling !CHAT_MODEL! ...
ollama pull !CHAT_MODEL!
if errorlevel 1 goto :failed
echo Pulling !CODE_MODEL! ...
ollama pull !CODE_MODEL!
if errorlevel 1 goto :failed
echo Pulling !VISION_MODEL! ...
ollama pull !VISION_MODEL!
if errorlevel 1 goto :failed
echo Pulling semantic embedding model ...
ollama pull nomic-embed-text
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo SUCCESS - MAXIMUM LOCAL AI PROFILE IS READY
echo ============================================================
echo Restart Ollama and JARVIS so the environment settings apply.
echo In JARVIS Settings choose:
echo   Intelligence provider: Local Ollama
echo   Ollama endpoint: http://localhost:11434/v1
echo   Ollama model: !CHAT_MODEL!
echo   Reasoning power: Maximum
echo   Context window: 120K
echo.
echo For coding, temporarily change the Ollama model to !CODE_MODEL!.
echo For local image understanding, the installed model is !VISION_MODEL!.
pause
exit /b 0

:failed
echo.
echo [ERROR] A model download did not complete.
echo Check free disk space and internet access, then run this BAT again.
echo Already downloaded model layers will be reused.
pause
exit /b 1
