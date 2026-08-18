@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"
title JARVIS AI - Upload to GitHub
color 0B

set "JARVIS_GITHUB_REPOSITORY=kceike/jarvis-ai-system"
set "JARVIS_GITHUB_REMOTE=https://github.com/kceike/jarvis-ai-system.git"

echo ============================================================
echo             JARVIS AI - ONE-CLICK GITHUB UPLOAD
echo ============================================================
echo.
echo Destination: %JARVIS_GITHUB_REPOSITORY%
echo This uploads the extracted JARVIS project, not your Cloudflare
echo secrets. Files such as .dev.vars, .env, certificates, build
echo folders, node_modules, and ZIP files are excluded by .gitignore.
echo.

if not exist "package.json" (
  echo [ERROR] package.json is missing.
  echo Extract the complete JARVIS ZIP and run this BAT from inside
  echo the JARVIS_AI_SYSTEM folder.
  goto :failed
)

if not exist ".github\workflows\build-windows-installers.yml" (
  echo [ERROR] The GitHub Actions installer workflow is missing.
  goto :failed
)

where git.exe >nul 2>nul
if errorlevel 1 (
  echo [SETUP] Git for Windows is not installed. Attempting installation...
  where winget.exe >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Install Git for Windows from https://git-scm.com/download/win
    goto :failed
  )
  winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
  if errorlevel 1 goto :failed
  set "PATH=%ProgramFiles%\Git\cmd;%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
)

where git.exe >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git was installed but is not available yet.
  echo Close this window, reopen the JARVIS folder, and run this BAT again.
  goto :failed
)

where gh.exe >nul 2>nul
if errorlevel 1 (
  echo [SETUP] GitHub CLI is not installed. Attempting installation...
  where winget.exe >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Install GitHub CLI from https://cli.github.com/
    goto :failed
  )
  winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements
  if errorlevel 1 goto :failed
  set "PATH=%ProgramFiles%\GitHub CLI;%LOCALAPPDATA%\Programs\GitHub CLI;%PATH%"
)

where gh.exe >nul 2>nul
if errorlevel 1 (
  echo [ERROR] GitHub CLI was installed but is not available yet.
  echo Close this window, reopen the JARVIS folder, and run this BAT again.
  goto :failed
)

echo.
echo [1/7] Checking the secure GitHub browser login...
gh auth status --hostname github.com >nul 2>nul
if errorlevel 1 (
  echo Your browser will open. Sign in to the GitHub account kceike.
  echo JARVIS will never ask for your GitHub password in this window.
  gh auth login --hostname github.com --git-protocol https --web
  if errorlevel 1 goto :failed
)

call :activate_github_account
if errorlevel 1 (
  echo The active GitHub account is not kceike. Sign in as kceike now.
  gh auth login --hostname github.com --git-protocol https --web
  if errorlevel 1 goto :failed
  call :activate_github_account
  if errorlevel 1 (
    echo [ERROR] GitHub account kceike is not active.
    goto :failed
  )
)

call :has_workflow_scope
if errorlevel 1 (
  echo.
  echo GitHub must approve the workflow permission used to upload the
  echo included Windows installer builder. A browser will open now.
  gh auth refresh --hostname github.com --scopes workflow
  if errorlevel 1 goto :failed
  call :has_workflow_scope
  if errorlevel 1 (
    echo [ERROR] GitHub did not grant the required workflow permission.
    goto :failed
  )
)

gh auth setup-git
if errorlevel 1 goto :failed

echo.
echo [2/7] Verifying the destination repository through GitHub...
gh repo view "%JARVIS_GITHUB_REPOSITORY%" --json nameWithOwner --jq .nameWithOwner >nul 2>nul
if errorlevel 1 (
  echo The repository is not available to the active account. Creating it now...
  gh repo create "%JARVIS_GITHUB_REPOSITORY%" --public --description "JARVIS AI Cloudflare website and Windows desktop application" --disable-issues --disable-wiki
  if errorlevel 1 (
    echo [ERROR] GitHub could not find or create %JARVIS_GITHUB_REPOSITORY%.
    goto :failed
  )
)

echo.
echo [3/7] Preparing the local JARVIS repository...
if not exist ".git" (
  git init
  if errorlevel 1 goto :failed
)

git config user.name >nul 2>nul
if errorlevel 1 git config user.name "Kristian Relova"
git config user.email >nul 2>nul
if errorlevel 1 git config user.email "kceike@users.noreply.github.com"

rem Reset stale Windows credentials for this repository and use only the
rem GitHub CLI account that was verified above. The empty helper resets any
rem inherited helper list before the active GitHub CLI helper is added.
git config --local --unset-all credential.https://github.com.helper >nul 2>nul
git config --local --add credential.https://github.com.helper ""
if errorlevel 1 goto :failed
git config --local --add credential.https://github.com.helper "!gh auth git-credential"
if errorlevel 1 goto :failed

git branch -M main
if errorlevel 1 goto :failed

echo.
echo [4/7] Linking https://github.com/%JARVIS_GITHUB_REPOSITORY% ...
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin "%JARVIS_GITHUB_REMOTE%"
) else (
  git remote set-url origin "%JARVIS_GITHUB_REMOTE%"
)
if errorlevel 1 goto :failed

echo.
echo [5/7] Staging changed JARVIS files...
git add -A
if errorlevel 1 goto :failed

for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "JARVIS_UPLOAD_TIME=%%T"
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "JARVIS update %JARVIS_UPLOAD_TIME%"
  if errorlevel 1 goto :failed
) else (
  echo No new local file changes require a commit.
)

echo.
echo [6/7] Checking the GitHub repository...
git ls-remote --exit-code --heads origin main >nul 2>nul
if not errorlevel 1 (
  git fetch origin main
  if errorlevel 1 goto :failed
  git merge-base HEAD origin/main >nul 2>nul
  if errorlevel 1 (
    echo.
    echo [STOPPED] GitHub already contains a different upload history.
    echo This safety check will not overwrite it automatically.
    echo For the first automatic upload, use a new empty repository or
    echo delete the manually uploaded files and recreate the repository.
    goto :failed
  )
  git rebase origin/main
  if errorlevel 1 (
    echo [ERROR] GitHub contains changes that conflict with this folder.
    echo Resolve the Git conflict before trying the upload again.
    goto :failed
  )
)

echo.
echo [7/7] Uploading JARVIS to GitHub...
git push -u origin main
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo SUCCESS: JARVIS was uploaded to:
echo https://github.com/%JARVIS_GITHUB_REPOSITORY%
echo.
echo The GitHub Actions page will open next. Select:
echo Build JARVIS Windows Installers ^> Run workflow
echo ============================================================
echo.
start "" "https://github.com/%JARVIS_GITHUB_REPOSITORY%/actions"
pause
exit /b 0

:failed
echo.
echo ============================================================
echo Upload stopped safely. Existing GitHub files were not erased.
echo Review the message above, then run this BAT again.
echo ============================================================
echo.
pause
exit /b 1

:activate_github_account
gh auth switch --hostname github.com --user kceike >nul 2>nul
set "JARVIS_ACTIVE_GITHUB_ACCOUNT="
for /f "delims=" %%A in ('gh api user --jq .login 2^>nul') do set "JARVIS_ACTIVE_GITHUB_ACCOUNT=%%A"
if /I "%JARVIS_ACTIVE_GITHUB_ACCOUNT%"=="kceike" exit /b 0
exit /b 1

:has_workflow_scope
set "JARVIS_AUTH_STATUS_FILE=%TEMP%\jarvis-gh-auth-%RANDOM%-%RANDOM%.txt"
gh auth status --hostname github.com >"%JARVIS_AUTH_STATUS_FILE%" 2>&1
findstr /I /C:"workflow" "%JARVIS_AUTH_STATUS_FILE%" >nul 2>nul
set "JARVIS_SCOPE_RESULT=%ERRORLEVEL%"
del /q "%JARVIS_AUTH_STATUS_FILE%" >nul 2>nul
exit /b %JARVIS_SCOPE_RESULT%
