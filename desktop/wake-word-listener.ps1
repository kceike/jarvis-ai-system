$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Speech

$recognizerInfo = [System.Speech.Recognition.SpeechRecognitionEngine]::InstalledRecognizers() |
    Where-Object { $_.Culture.Name -like "en-*" } |
    Select-Object -First 1

if (-not $recognizerInfo) {
    throw "Install an English Windows speech-recognition language before enabling Hey JARVIS."
}

$recognizer = [System.Speech.Recognition.SpeechRecognitionEngine]::new($recognizerInfo)
$exactBuilder = [System.Speech.Recognition.GrammarBuilder]::new()
$exactBuilder.Culture = $recognizerInfo.Culture
$exactBuilder.Append("hey jarvis")
$recognizer.LoadGrammar([System.Speech.Recognition.Grammar]::new($exactBuilder))

try {
    $commandBuilder = [System.Speech.Recognition.GrammarBuilder]::new()
    $commandBuilder.Culture = $recognizerInfo.Culture
    $commandBuilder.Append("hey jarvis")
    $commandBuilder.AppendDictation()
    $recognizer.LoadGrammar([System.Speech.Recognition.Grammar]::new($commandBuilder))
} catch {
    # Exact wake-word detection remains available if dictation grammar is unavailable.
}

$handler = [System.EventHandler[System.Speech.Recognition.SpeechRecognizedEventArgs]] {
    param($sender, $eventArgs)
    $text = [string]$eventArgs.Result.Text
    if ($eventArgs.Result.Confidence -lt 0.52 -or $text -notmatch '(?i)^hey\s+jarvis\b') { return }
    $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($text))
    [Console]::Out.WriteLine("JARVIS_WAKE|$encoded")
    [Console]::Out.Flush()
}

try {
    $recognizer.add_SpeechRecognized($handler)
    $recognizer.SetInputToDefaultAudioDevice()
    [Console]::Out.WriteLine("JARVIS_READY|$($recognizerInfo.Culture.Name)")
    [Console]::Out.Flush()
    $recognizer.RecognizeAsync([System.Speech.Recognition.RecognizeMode]::Multiple)
    while ($true) { Start-Sleep -Milliseconds 500 }
} finally {
    try { $recognizer.RecognizeAsyncCancel() } catch {}
    try { $recognizer.remove_SpeechRecognized($handler) } catch {}
    $recognizer.Dispose()
}
