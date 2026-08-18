$ErrorActionPreference = "Stop"

$shell = New-Object -ComObject WScript.Shell
$desktop = $shell.SpecialFolders.Item("Desktop")
$programs = [Environment]::GetFolderPath("Programs")
$appDirectory = Join-Path $env:LOCALAPPDATA "JARVIS"
$startMenuDirectory = Join-Path $programs "JARVIS AI"

$desktopShortcut = Join-Path $desktop "JARVIS AI.lnk"
if (Test-Path -LiteralPath $desktopShortcut) { Remove-Item -LiteralPath $desktopShortcut -Force }
if (Test-Path -LiteralPath $startMenuDirectory) { Remove-Item -LiteralPath $startMenuDirectory -Recurse -Force }

$uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\JARVISAI"
if (Test-Path $uninstallKey) { Remove-Item -Path $uninstallKey -Recurse -Force }

Write-Host "JARVIS Windows app shortcuts were removed." -ForegroundColor Green
Write-Host "Your Cloudflare deployment, synchronized memory, and website were not deleted." -ForegroundColor DarkCyan

Start-Sleep -Milliseconds 400
if (Test-Path -LiteralPath $appDirectory) {
    $cleanup = 'Start-Sleep -Seconds 1; Remove-Item -LiteralPath "' + $appDirectory + '" -Recurse -Force -ErrorAction SilentlyContinue'
    Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @('-NoProfile', '-Command', $cleanup)
}
