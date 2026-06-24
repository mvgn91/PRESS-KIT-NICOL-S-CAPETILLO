<#
.SYNOPSIS
    MVGN Loader - bootstraps the MVGN system by parsing all .mvgn layers and building structured context.
.DESCRIPTION
    Called internally by mvgn.ps1. Also usable standalone for CI/CD or AI session initialization.
    Outputs context as JSON to stdout for pipe-friendly consumption.

    Format modes:
      json     -> full context (all layers, all metadata) - for CLI/CI/CD
      brief    -> compressed JSON - for minimal payload
      text     -> human-readable table
      for-ai   -> MINIMAL output: only state summary + active layer + contract + task.
                  Designed to prevent context overflow in AI sessions.
                  Does NOT include raw content of all 5 layers.
.PARAMETER RootPath
    Root path of the MVGN project (default: current directory).
.PARAMETER Format
    Output format: json, text, brief, for-ai (default: json).
#>

param (
    [string]$RootPath = (Get-Location).Path,
    [ValidateSet("json", "text", "brief", "for-ai")]
    [string]$Format = "json"
)

# --- Resolve paths ---
$MVGN_DIR = Join-Path $RootPath ".mvgn"
$DOCS_DIR = Join-Path $RootPath "docs"
$STATE_PATH = Join-Path $DOCS_DIR "06_state_report.md"

# --- Helpers ---
function Read-Layer($name, $path) {
    if (Test-Path $path) {
        return Get-Content $path -Raw
    }
    return $null
}

function Extract-State($content) {
    $state = "INIT"
    $mode = "FAST"
    $task = ""
    $progress = "0/0"
    $blockers = ""
    $lastAction = ""
    $nextAction = ""

    if ($content -match '\*\*Estado\*\*\s*\|\s*(\S+)') { $state = $Matches[1] }
    if ($content -match '\*\*Modo\*\*\s*\|\s*(\S+)') { $mode = $Matches[1] }
    if ($content -match '\*\*Tarea activa\*\*\s*\|\s*(\S+)') { $task = $Matches[1] }
    if ($content -match '\*\*Progreso\*\*\s*\|\s*([\d\s/]+)') { $progress = $Matches[1].Trim() }
    if ($content -match '\*\*Bloqueos activos\*\*\s*\|\s*(\S+)') { $blockers = $Matches[1] }
    if ($content -match '\*\*Ultima accion\*\*\s*\|\s*(.+)') { $lastAction = $Matches[1] }
    if ($content -match '\*\*Siguiente accion\*\*\s*\|\s*(.+)') { $nextAction = $Matches[1] }

    return @{
        state       = $state
        mode        = $mode
        task        = $task
        progress    = $progress
        blockers    = if ($blockers -and $blockers -ne "-") { $blockers } else { "" }
        lastAction  = $lastAction
        nextAction  = $nextAction
    }
}

function Get-PolicySummary($content) {
    if (-not $content) { return @{} }

    $states = @()
    if ($content -match '(?<=\| `)[A-Z_]+(?=` \|)') {
        $states = ([regex]::Matches($content, '(?<=\| `)[A-Z_]+(?=` \|)')).Value
    }

    $gates = @()
    if ($content -match '(?<=G\d{2} - )\w+') {
        $gates = ([regex]::Matches($content, '(?<=G\d{2} - )\w+')).Value
    }

    return @{
        states_count = $states.Count
        states       = $states
        gates        = $gates
        gates_count  = $gates.Count
    }
}

function Get-EngineSummary($content) {
    if (-not $content) { return @{} }

    $modes = @()
    if ($content -match '(?<=### )\w+(?= MODE)') {
        $modes = ([regex]::Matches($content, '(?<=### )\w+(?= MODE)')).Value
    }

    return @{
        modes       = $modes
        modes_count = $modes.Count
    }
}

function Get-ActiveLayer($state, $blockers, $integrity) {
    if ($integrity -eq "CORRUPTED" -or $state -eq "BLOCKED") {
        return "recovery"
    }
    if ($state -eq "IN_PROGRESS" -or $state -eq "READY_TO_BUILD") {
        return "engine"
    }
    return "rules"
}

function Get-AuthorityMap {
    $authPath = Join-Path $MVGN_DIR "authority-map.md"
    if (Test-Path $authPath) {
        return "loaded"
    }
    return "missing"
}

# --- Build context ---
function Build-Context {
    $rulesContent = Read-Layer "system-rules" (Join-Path $MVGN_DIR "system-rules.md")
    $engineContent = Read-Layer "execution-engine" (Join-Path $MVGN_DIR "execution-engine.md")
    $recoveryContent = Read-Layer "recovery-protocol" (Join-Path $MVGN_DIR "recovery-protocol.md")
    $kernelContent = Read-Layer "kernel-spec" (Join-Path $MVGN_DIR "kernel-spec.md")
    $contractContent = Read-Layer "session-contract" (Join-Path $MVGN_DIR "session-contract.md")
    $authContent = Read-Layer "authority-map" (Join-Path $MVGN_DIR "authority-map.md")

    $stateInfo = if (Test-Path $STATE_PATH) {
        Extract-State (Get-Content $STATE_PATH -Raw)
    }
    else {
        Extract-State ""
    }

    $contractLoaded = $contractContent -ne $null
    $authLoaded = $authContent -ne $null
    $integrity = if ($contractLoaded -and $authLoaded -and $rulesContent) { "OK" } else { "DEGRADED" }
    $activeLayer = Get-ActiveLayer $stateInfo.state $stateInfo.blockers $integrity

    $context = @{
        timestamp   = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
        system      = "MVGN Starter Kit v2.1"
        root        = $RootPath
        state       = $stateInfo.state
        mode        = $stateInfo.mode
        task        = @{
            active     = $stateInfo.task
            progress   = $stateInfo.progress
        }
        blockers    = $stateInfo.blockers
        contract    = if ($contractLoaded) { "loaded" } else { "missing" }
        authority   = if ($authLoaded) { "loaded" } else { "missing" }
        active_layer = $activeLayer
        integrity  = $integrity
        last_action = $stateInfo.lastAction
        next_action = $stateInfo.nextAction
        layers      = @{
            rules    = if ($rulesContent) { "loaded" } else { "missing" }
            engine   = if ($engineContent) { "loaded" } else { "missing" }
            recovery = if ($recoveryContent) { "loaded" } else { "missing" }
            kernel   = if ($kernelContent) { "loaded" } else { "missing" }
            contract = if ($contractContent) { "loaded" } else { "missing" }
            authority = if ($authContent) { "loaded" } else { "missing" }
        }
        policy      = Get-PolicySummary $rulesContent
        runtime     = Get-EngineSummary $engineContent
        integrity_check = @{
            state_report_exists = Test-Path $STATE_PATH
            layers_complete     = ($rulesContent -and $engineContent -and $recoveryContent -and $kernelContent)
            contract_loaded     = $contractLoaded
            authority_loaded    = $authLoaded
        }
    }

    return @{
        full    = $context
        summary = @{
            timestamp    = $context.timestamp
            system       = $context.system
            state        = $context.state
            mode         = $context.mode
            active_layer = $context.active_layer
            integrity    = $context.integrity
            contract     = $context.contract
            authority    = $context.authority
            task         = $context.task
            blockers     = $context.blockers
            last_action  = $context.last_action
            next_action  = $context.next_action
            layers       = @{
                loaded = ($context.layers.Keys | Where-Object { $context.layers[$_] -eq "loaded" } | ForEach-Object { $_ })
                missing = ($context.layers.Keys | Where-Object { $context.layers[$_] -eq "missing" } | ForEach-Object { $_ })
            }
        }
    }
}

# --- Output ---
$result = Build-Context
$ctx = $result.full
$summary = $result.summary

switch ($Format) {
    "json" {
        $ctx | ConvertTo-Json -Depth 5
    }
    "brief" {
        $ctx | ConvertTo-Json -Depth 5 -Compress
    }
    "for-ai" {
        # MINIMAL output for AI sessions.
        # Only: state + mode + active_layer + integrity + contract + authority + task + blockers.
        # NO raw layer content. NO full metadata.
        $ctx | ConvertTo-Json -Depth 4
    }
    "text" {
        Write-Host "MVGN System Context"
        Write-Host "--------------------"
        Write-Host "State:        $($ctx.state)"
        Write-Host "Mode:         $($ctx.mode)"
        Write-Host "Active layer: $($ctx.active_layer)"
        Write-Host "Integrity:    $($ctx.integrity)"
        Write-Host "Task:         $($ctx.task.active)"
        Write-Host "Progress:     $($ctx.task.progress)"
        Write-Host "Blockers:     $(if ($ctx.blockers) { $ctx.blockers } else { 'none' })"
        Write-Host "Contract:     $($ctx.contract)"
        Write-Host "Authority:    $($ctx.authority)"
        Write-Host "Last:         $($ctx.last_action)"
        Write-Host "Next:         $($ctx.next_action)"
        Write-Host ""
        Write-Host "Layers loaded: $($summary.layers.loaded -join ', ')"
        if ($summary.layers.missing.Count -gt 0) {
            Write-Host "Layers missing: $($summary.layers.missing -join ', ')" -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "Authority map: Contract > Kernel > Recovery > Rules > Engine"
    }
}
