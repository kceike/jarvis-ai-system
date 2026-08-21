$ErrorActionPreference = "Stop"

Write-Host "JARVIS Windows application installer" -ForegroundColor Cyan
Write-Host "This app window will always load your live Cloudflare website." -ForegroundColor DarkCyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
$urlFile = Join-Path $projectRoot "JARVIS_WEBSITE_URL.txt"
$websiteUrl = ""

if (Test-Path $urlFile) {
    $candidate = (Get-Content -LiteralPath $urlFile -ErrorAction SilentlyContinue | Where-Object { $_ -match '^https://' } | Select-Object -First 1)
    if ($candidate -and $candidate -notmatch 'YOUR-SUBDOMAIN') {
        $websiteUrl = $candidate.Trim()
    }
}

if (-not $websiteUrl) {
    $websiteUrl = (Read-Host "Paste your JARVIS HTTPS website address").Trim()
}

$uri = $null
if (-not [Uri]::TryCreate($websiteUrl, [UriKind]::Absolute, [ref]$uri) -or $uri.Scheme -ne "https") {
    throw "Enter the complete HTTPS address shown by Cloudflare, for example https://jarvis-ai-system.example.workers.dev"
}

$browserCandidates = @()
if (${env:ProgramFiles(x86)}) {
    $browserCandidates += Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"
    $browserCandidates += Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe"
}
if ($env:ProgramFiles) {
    $browserCandidates += Join-Path $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"
    $browserCandidates += Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"
}
if ($env:LOCALAPPDATA) {
    $browserCandidates += Join-Path $env:LOCALAPPDATA "Microsoft\Edge\Application\msedge.exe"
}
$browserCandidates = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ }

$browserPath = $browserCandidates | Select-Object -First 1
if (-not $browserPath) {
    $browserCommand = Get-Command msedge.exe, chrome.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($browserCommand) { $browserPath = $browserCommand.Source }
}
if (-not $browserPath) {
    throw "Microsoft Edge or Google Chrome is required. Install one of them, then run this installer again."
}

$appDirectory = Join-Path $env:LOCALAPPDATA "JARVIS"
New-Item -ItemType Directory -Path $appDirectory -Force | Out-Null

$sourceIcon = Join-Path $projectRoot "assets\jarvis.ico"
$installedIcon = Join-Path $appDirectory "jarvis.ico"
if (Test-Path -LiteralPath $sourceIcon) {
    Copy-Item -LiteralPath $sourceIcon -Destination $installedIcon -Force
}

$installedUninstaller = Join-Path $appDirectory "Uninstall-Jarvis.ps1"
Copy-Item -LiteralPath (Join-Path $PSScriptRoot "Uninstall-Jarvis.ps1") -Destination $installedUninstaller -Force
Set-Content -LiteralPath (Join-Path $appDirectory "website.url") -Value $uri.AbsoluteUri -Encoding UTF8

$shell = New-Object -ComObject WScript.Shell
$desktop = $shell.SpecialFolders.Item("Desktop")
$programs = [Environment]::GetFolderPath("Programs")
$startMenuDirectory = Join-Path $programs "JARVIS AI"
New-Item -ItemType Directory -Path $startMenuDirectory -Force | Out-Null

function New-JarvisShortcut([string]$Path) {
    $shortcut = $shell.CreateShortcut($Path)
    $shortcut.TargetPath = $browserPath
    $shortcut.Arguments = '--app="' + $uri.AbsoluteUri + '" --start-maximized'
    $shortcut.WorkingDirectory = Split-Path -Parent $browserPath
    $shortcut.Description = "JARVIS Personal Intelligence System"
    if (Test-Path -LiteralPath $installedIcon) { $shortcut.IconLocation = $installedIcon }
    $shortcut.Save()
}

$desktopShortcut = Join-Path $desktop "JARVIS AI.lnk"
$startShortcut = Join-Path $startMenuDirectory "JARVIS AI.lnk"
New-JarvisShortcut $desktopShortcut
New-JarvisShortcut $startShortcut

$uninstallShortcut = $shell.CreateShortcut((Join-Path $startMenuDirectory "Uninstall JARVIS AI.lnk"))
$uninstallShortcut.TargetPath = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$uninstallShortcut.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $installedUninstaller + '"'
$uninstallShortcut.IconLocation = if (Test-Path -LiteralPath $installedIcon) { $installedIcon } else { $browserPath }
$uninstallShortcut.Save()

$uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\JARVISAI"
New-Item -Path $uninstallKey -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name DisplayName -Value "JARVIS AI" -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name DisplayVersion -Value "1.13.7" -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name Publisher -Value "JARVIS Personal Intelligence System" -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name URLInfoAbout -Value $uri.AbsoluteUri -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name DisplayIcon -Value $installedIcon -PropertyType String -Force | Out-Null
$uninstallCommand = 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "' + $installedUninstaller + '"'
New-ItemProperty -Path $uninstallKey -Name UninstallString -Value $uninstallCommand -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name NoModify -Value 1 -PropertyType DWord -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name NoRepair -Value 1 -PropertyType DWord -Force | Out-Null

Write-Host ""
Write-Host "JARVIS was linked to $($uri.AbsoluteUri)" -ForegroundColor Green
Write-Host "Desktop and Start Menu shortcuts were created." -ForegroundColor Green
Start-Process -FilePath $browserPath -ArgumentList @('--app="' + $uri.AbsoluteUri + '"', '--start-maximized')
