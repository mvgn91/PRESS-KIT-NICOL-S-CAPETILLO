<#
.SYNOPSIS
    MVGN System CLI v2.1 - Starter Kit command-line interface.
.DESCRIPTION
    Boots the MVGN system: loads kernel layers, validates state, and prepares context for AI-assisted development.
.PARAMETER command
    Command: start, resume, state, context, validate, help
.PARAMETER project
    Optional project path override (defaults to repo root).
#>

param (
    [Parameter(Position = 0)]
    [string]$command = "start",

    [Parameter(Position = 1)]
    [string]$project = ""
)

# --- Path resolution ---
$MVGN_SCRIPT = Split-Path -Parent $MyInvocation.MyCommand.Path
$GLOBAL_INSTALL = "$env:USERPROFILE\mvgn"
$IS_GLOBAL = ($MVGN_SCRIPT -eq "$GLOBAL_INSTALL\tools")

if ($project) {
    $MVGN_ROOT = Resolve-Path $project
}
elseif ($IS_GLOBAL) {
    $MVGN_ROOT = Get-Location
}
else {
    $MVGN_ROOT = Resolve-Path "$MVGN_SCRIPT\.."
}

$MVGN_DIR = "$MVGN_ROOT\.mvgn"
$DOCS_DIR = "$MVGN_ROOT\docs"
$STATE_PATH = "$DOCS_DIR\06_state_report.md"
$LESSONS_PATH = "$DOCS_DIR\05_lessons_learned.md"
$SESSION_PATH = "$MVGN_DIR\session-state.json"

# --- Session persistence ---
function Save-Session {
    param($context)
    $session = @{
        last_updated  = (Get-Date -Format "yyyy-MM-dd HH:mm")
        last_state    = $context.state
        last_mode     = $context.mode
        last_task     = $context.task
        last_progress = $context.progress
        active_layer  = $context.active_layer
        last_action   = $context.last_action
        next_action   = $context.next_action
        contract      = $context.contract
        authority     = $context.authority
        integrity     = $context.integrity
    }
    $session | ConvertTo-Json -Depth 4 | Out-File $SESSION_PATH
}

function Load-Session {
    if (Test-Path $SESSION_PATH) {
        try {
            return Get-Content $SESSION_PATH -Raw | ConvertFrom-Json
        } catch {
            Write-Host "${C_YELLOW}Session file corrupted, starting fresh.${C_RESET}"
        }
    }
    return $null
}

# --- Colors ---
$C_CYAN = "$([char]27)[36m"
$C_GREEN = "$([char]27)[32m"
$C_YELLOW = "$([char]27)[33m"
$C_RED = "$([char]27)[31m"
$C_BOLD = "$([char]27)[1m"
$C_RESET = "$([char]27)[0m"

# --- Banner ---
function Show-Banner {
    Write-Host ""
    Write-Host "${C_CYAN}+---------------------------------------+${C_RESET}"
    Write-Host "${C_CYAN}|     MVGN SYSTEM CLI v2.1              |${C_RESET}"
    Write-Host "${C_CYAN}|     Starter Kit - Orchestrator Layer  |${C_RESET}"
    Write-Host "${C_CYAN}+---------------------------------------+${C_RESET}"
    Write-Host ""
}

# --- Layer loader ---
function Load-Kernel {
    Write-Host "${C_YELLOW}> Loading MVGN layers...${C_RESET}"

    $layers = @{}
    $files = @{
        rules    = "$MVGN_DIR\system-rules.md"
        engine   = "$MVGN_DIR\execution-engine.md"
        recovery = "$MVGN_DIR\recovery-protocol.md"
        kernel   = "$MVGN_DIR\kernel-spec.md"
        contract = "$MVGN_DIR\session-contract.md"
        authority = "$MVGN_DIR\authority-map.md"
    }

    $missing = @()
    foreach ($key in $files.Keys) {
        if (Test-Path $files[$key]) {
            $layers[$key] = Get-Content $files[$key] -Raw
            Write-Host "  [OK] $key" -ForegroundColor Green
        }
        else {
            $missing += $key
            Write-Host "  [--] $key (not found)" -ForegroundColor Red
        }
    }

    if ($missing.Count -gt 0) {
        Write-Host "${C_RED}WARNING: Missing layers: $($missing -join ', ')${C_RESET}"
        Write-Host "${C_YELLOW}System will operate in degraded mode.${C_RESET}"
    }

    return $layers
}

# --- State detection ---
function Get-State {
    if (!(Test-Path $STATE_PATH)) {
        return @{ state = "INIT"; mode = "FAST"; task = ""; progress = "0/0"; blockers = "" }
    }

    $content = Get-Content $STATE_PATH -Raw

    $state = "INIT"
    $mode = "FAST"
    $task = ""
    $progress = "0/0"
    $blockers = ""

    if ($content -match '(?<=\*\*Estado\*\*\s*\|?\s*)\b[A-Z_]+\b') {
        $state = $Matches[0]
    }
    if ($content -match '(?<=\*\*Modo\*\*\s*\|?\s*)\b\w+\b') {
        $mode = $Matches[0]
    }
    if ($content -match '(?<=\*\*Tarea activa\*\*\s*\|?\s*)\S+') {
        $task = $Matches[0]
    }
    if ($content -match '(?<=\*\*Progreso\*\*\s*\|?\s*)\d+\s*/\s*\d+') {
        $progress = $Matches[0]
    }
    if ($content -match '(?<=\*\*Bloqueos activos\*\*\s*\|?\s*)\S+') {
        $blockers = $Matches[0]
    }

    return @{
        state    = $state
        mode     = $mode
        task     = $task
        progress = $progress
        blockers = $blockers
    }
}

# --- Validation ---
function Test-ProjectStructure {
    $required = @(
        "$MVGN_DIR\system-rules.md"
        "$MVGN_DIR\kernel-spec.md"
        "$DOCS_DIR\00_idea.md"
        "$DOCS_DIR\01_prd.md"
        "$DOCS_DIR\02_architecture.md"
        "$DOCS_DIR\03_tasks.md"
    )

    $results = @()
    foreach ($file in $required) {
        $exists = Test-Path $file
        $rel = $file.Replace("$MVGN_ROOT\", "")
        $results += [PSCustomObject]@{
            File    = $rel
            Exists  = $exists
            Status  = if ($exists) { "[OK]" } else { "[--]" }
        }
    }
    return $results
}

# --- Active layer detection ---
function Get-ActiveLayer($state) {
    if ($state -eq "BLOCKED") { return "recovery" }
    if ($state -eq "IN_PROGRESS" -or $state -eq "READY_TO_BUILD") { return "engine" }
    return "rules"
}

function Get-Integrity($layers) {
    $ok = $layers.ContainsKey("rules") -and $layers["rules"]
    $ok = $ok -and $layers.ContainsKey("engine") -and $layers["engine"]
    $ok = $ok -and $layers.ContainsKey("kernel") -and $layers["kernel"]
    $ok = $ok -and $layers.ContainsKey("contract") -and $layers["contract"]
    if ($ok) { return "OK" }
    return "DEGRADED"
}

# --- Context generator ---
function Get-Context {
    $state = Get-State
    $layers = Load-Kernel

    $contractLoaded = $layers.ContainsKey("contract") -and $layers["contract"]
    $authLoaded = $layers.ContainsKey("authority") -and $layers["authority"]

    $context = @{
        timestamp    = (Get-Date -Format "yyyy-MM-dd HH:mm")
        system       = "MVGN Starter Kit v2.1"
        state        = $state.state
        mode         = $state.mode
        task         = $state.task
        progress     = $state.progress
        blockers     = $state.blockers
        contract     = if ($contractLoaded) { "loaded" } else { "missing" }
        authority    = if ($authLoaded) { "loaded" } else { "missing" }
        active_layer = (Get-ActiveLayer $state.state)
        integrity    = (Get-Integrity $layers)
        last_action  = ""
        layers       = @{
            rules    = if ($layers.ContainsKey("rules")) { "loaded" } else { "missing" }
            engine   = if ($layers.ContainsKey("engine")) { "loaded" } else { "missing" }
            recovery = if ($layers.ContainsKey("recovery")) { "loaded" } else { "missing" }
            kernel   = if ($layers.ContainsKey("kernel")) { "loaded" } else { "missing" }
            contract = if ($contractLoaded) { "loaded" } else { "missing" }
            authority = if ($authLoaded) { "loaded" } else { "missing" }
        }
        next_action  = (Get-NextAction $state.state)
    }

    return $context
}

# --- Next action hint ---
function Get-NextAction($state) {
    switch ($state) {
        "INIT"                   { return "Define your idea in docs/00_idea.md, then create PRD" }
        "PRD_REQUIRED"           { return "Complete docs/01_prd.md with functional and non-functional requirements" }
        "PRD_APPROVED"           { return "Design architecture in docs/02_architecture.md" }
        "ARCHITECTURE_REQUIRED"  { return "Complete docs/02_architecture.md with components, ADRs, and stack" }
        "ARCHITECTURE_APPROVED"  { return "Break down work into tasks in docs/03_tasks.md" }
        "READY_TO_BUILD"         { return "Ready to build. Authorize T-001 to begin execution." }
        "IN_PROGRESS"            { return "Continue executing current task or start next pending task" }
        "COMPLETED"              { return "All tasks complete. Review and plan next iteration." }
        "BLOCKED"                { return "System is blocked. Run recovery protocol or resolve blocker B-XX." }
        default                  { return "Evaluate system state and determine next action" }
    }
}

# --- Runtime bootstrap ---
function Ensure-MvgnRuntime {
    $installPath = $GLOBAL_INSTALL
    $repoUrl = "https://github.com/mvgn91/mvgnlabs-starter-kit.git"
    $currentDir = $MVGN_ROOT

    Write-Host "${C_CYAN}[MVGN] Checking runtime...${C_RESET}"

    # 1. Ensure global install exists
    if (-not (Test-Path "$installPath\tools\mvgn.ps1")) {
        Write-Host "${C_YELLOW}[MVGN] Runtime not found. Installing from GitHub...${C_RESET}"

        if (Test-Path $installPath) {
            Remove-Item -Recurse -Force $installPath
        }

        $cloneResult = git clone $repoUrl $installPath 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "${C_RED}[MVGN] INSTALL FAILED: git clone error${C_RESET}"
            Write-Host "${C_YELLOW}$cloneResult${C_RESET}"
            exit 1
        }

        # Fallback: retry if clone succeeded but tools missing
        if (-not (Test-Path "$installPath\tools\mvgn.ps1")) {
            Write-Host "${C_RED}[MVGN] INSTALL FAILED: tools missing after clone. Reconstructing...${C_RESET}"

            if (Test-Path "$installPath\_tmp") {
                Remove-Item -Recurse -Force "$installPath\_tmp"
            }
            git clone $repoUrl "$installPath\_tmp" 2>&1 | Out-Null

            if (Test-Path "$installPath\_tmp\tools") {
                Copy-Item "$installPath\_tmp\tools" "$installPath\tools" -Recurse -Force
            }
            if (Test-Path "$installPath\_tmp\.mvgn") {
                New-Item -ItemType Directory -Force -Path "$installPath\.mvgn" | Out-Null
                Copy-Item "$installPath\_tmp\.mvgn\*" "$installPath\.mvgn" -Recurse -Force
            }
            Remove-Item -Recurse -Force "$installPath\_tmp"

            if (-not (Test-Path "$installPath\tools\mvgn.ps1")) {
                Write-Host "${C_RED}[MVGN] FATAL: Runtime installation failed after fallback.${C_RESET}"
                exit 1
            }
        }

        Write-Host "${C_GREEN}[MVGN] Runtime installed successfully.${C_RESET}"
    }

    # 2. Detect project context
    $mvgnPath = "$currentDir\.mvgn"
    $sessionState = "$mvgnPath\session-state.json"

    if (-not (Test-Path $mvgnPath)) {
        Write-Host "${C_YELLOW}[MVGN] No project detected. Initializing new MVGN project...${C_RESET}"
        New-Item -ItemType Directory -Force -Path $mvgnPath | Out-Null

        # Copy layers from global install
        if (Test-Path "$installPath\.mvgn") {
            Copy-Item "$installPath\.mvgn\*" $mvgnPath -Recurse -Force
        }
        else {
            Write-Host "${C_YELLOW}[MVGN] Warning: install .mvgn layers not found. Creating empty stub.${C_RESET}"
        }

        # Ensure docs directory exists
        if (-not (Test-Path "$currentDir\docs")) {
            New-Item -ItemType Directory -Force -Path "$currentDir\docs" | Out-Null
            Write-Host "${C_CYAN}[MVGN] Created docs/ directory.${C_RESET}"
        }

        Write-Host "${C_GREEN}[MVGN] Project initialized (INIT state).${C_RESET}"
        return "INIT"
    }

    # 3. Check session persistence
    if (Test-Path $sessionState) {
        Write-Host "${C_CYAN}[MVGN] Existing session detected. Resuming...${C_RESET}"
        return "RESUME"
    }

    Write-Host "${C_YELLOW}[MVGN] Project structure found but no session state. Starting fresh INIT.${C_RESET}"
    return "INIT"
}

# --- Commands ---

function Start-MVGN {
    Show-Banner

    $bootstrapState = Ensure-MvgnRuntime
    if ($bootstrapState -eq "INIT") {
        Write-Host "${C_CYAN}[MVGN] State: INIT -> creating baseline context...${C_RESET}"
    }
    if ($bootstrapState -eq "RESUME") {
        Write-Host "${C_CYAN}[MVGN] State: RESUME -> loading previous session...${C_RESET}"
    }
    Write-Host ""

    # Validate project structure
    Write-Host "${C_CYAN}Validating project structure...${C_RESET}"
    $validation = Test-ProjectStructure
    $allOk = $true
    foreach ($v in $validation) {
        $color = if ($v.Exists) { "Green" } else { "Red"; $allOk = $false }
        Write-Host "  $($v.Status) $($v.File)" -ForegroundColor $color
    }

    if (-not $allOk) {
        Write-Host "${C_YELLOW}Some files are missing. System may operate in degraded mode.${C_RESET}"
    }
    Write-Host ""

    # Load layers
    $layers = Load-Kernel
    Write-Host ""

    # Detect state
    $stateInfo = Get-State
    Write-Host "${C_CYAN}System state:${C_RESET} ${C_BOLD}$($stateInfo.state)${C_RESET}"
    Write-Host "${C_CYAN}Mode:${C_RESET} $($stateInfo.mode)"
    Write-Host "${C_CYAN}Progress:${C_RESET} $($stateInfo.progress)"
    if ($stateInfo.blockers -and $stateInfo.blockers -ne "" -and $stateInfo.blockers -ne "-") {
        Write-Host "${C_RED}Blockers: $($stateInfo.blockers)${C_RESET}"
    }
    Write-Host ""

    # Active layers summary
    $contractLoaded = $layers.ContainsKey("contract") -and $layers["contract"]
    $authLoaded = $layers.ContainsKey("authority") -and $layers["authority"]
    $activeLayer = Get-ActiveLayer $stateInfo.state
    $integrity = Get-Integrity $layers
    Write-Host "${C_CYAN}Active layers:${C_RESET}"
    Write-Host "  * system-rules       -> $(if ($layers.ContainsKey('rules')) { 'loaded' } else { 'missing' })" -ForegroundColor $(if ($layers.ContainsKey('rules')) { 'Green' } else { 'Red' })
    Write-Host "  * execution-engine   -> $(if ($layers.ContainsKey('engine')) { 'loaded' } else { 'missing' })" -ForegroundColor $(if ($layers.ContainsKey('engine')) { 'Green' } else { 'Red' })
    Write-Host "  * recovery-protocol  -> $(if ($layers.ContainsKey('recovery')) { 'loaded' } else { 'missing' })" -ForegroundColor $(if ($layers.ContainsKey('recovery')) { 'Green' } else { 'Red' })
    Write-Host "  * kernel-spec        -> $(if ($layers.ContainsKey('kernel')) { 'loaded' } else { 'missing' })" -ForegroundColor $(if ($layers.ContainsKey('kernel')) { 'Green' } else { 'Red' })
    Write-Host "  * session-contract   -> $(if ($contractLoaded) { 'loaded [OK]' } else { 'missing' })" -ForegroundColor $(if ($contractLoaded) { 'Green' } else { 'Red' })
    Write-Host "  * authority-map      -> $(if ($authLoaded) { 'loaded [OK]' } else { 'missing' })" -ForegroundColor $(if ($authLoaded) { 'Green' } else { 'Red' })
    Write-Host ""
    Write-Host "${C_CYAN}Active layer:${C_RESET} $activeLayer"
    Write-Host "${C_CYAN}Integrity:${C_RESET} $integrity"
    Write-Host ""
    if ($contractLoaded) {
        Write-Host "${C_GREEN}Session contract active. AI behavior is now bound by session-contract.md.${C_RESET}"
        Write-Host ""
    }
    if ($authLoaded) {
        Write-Host "${C_CYAN}Authority map:${C_RESET} Contract > Kernel > Recovery > Rules > Engine"
        Write-Host ""
    }

    # Next action
    $next = Get-NextAction $stateInfo.state
    Write-Host "${C_CYAN}Next action:${C_RESET} $next"
    Write-Host ""

    Write-Host "${C_GREEN}READY.${C_RESET}"
    Write-Host ""
    Write-Host "${C_YELLOW}Tip: run '.\tools\mvgn.ps1 context' to export machine-readable context for AI sessions.${C_RESET}"

    # Export context for AI (includes contract status)
    $context = Get-Context
    $context | ConvertTo-Json -Depth 4 | Out-File "$MVGN_ROOT\.mvgn-context.json"

    # Save session state
    Save-Session $context

    Write-Host "${C_YELLOW}Context exported to .mvgn-context.json${C_RESET}"
    Write-Host "${C_YELLOW}Session state saved to .mvgn/session-state.json${C_RESET}"
    if ($contractLoaded) {
        Write-Host "${C_YELLOW}Session contract injected into context. AI sessions must load .mvgn-context.json before operating.${C_RESET}"
    }
    Write-Host ""
}

function Resume-MVGN {
    Show-Banner

    $bootstrapState = Ensure-MvgnRuntime
    if ($bootstrapState -eq "INIT") {
        Write-Host "${C_CYAN}[MVGN] No prior session found. Initializing fresh...${C_RESET}"
    }
    if ($bootstrapState -eq "RESUME") {
        Write-Host "${C_YELLOW}Resuming previous session...${C_RESET}"
    }
    Write-Host ""

    $session = Load-Session
    if ($session) {
        Write-Host "  Previous state: $($session.last_state)" -ForegroundColor Cyan
        Write-Host "  Last mode: $($session.last_mode)" -ForegroundColor Cyan
        Write-Host "  Last task: $($session.last_task)" -ForegroundColor Cyan
        Write-Host "  Progress: $($session.last_progress)" -ForegroundColor Cyan
        Write-Host "  Active layer: $($session.active_layer)" -ForegroundColor Cyan
        Write-Host ""

        # Detect current state and compare
        $current = Get-State
        if ($current.state -ne $session.last_state) {
            Write-Host "${C_YELLOW}State changed since last session: $($session.last_state) -> $($current.state)${C_RESET}"
        }
    }
    else {
        Write-Host "${C_YELLOW}No previous session found. Starting fresh.${C_RESET}"
    }

    Start-MVGN
}

function Show-State {
    Show-Banner
    Write-Host "${C_CYAN}Current system status:${C_RESET}"
    Write-Host ""

    $stateInfo = Get-State
    Write-Host "  State:      $($stateInfo.state)"
    Write-Host "  Mode:       $($stateInfo.mode)"
    Write-Host "  Task:       $($stateInfo.task)"
    Write-Host "  Progress:   $($stateInfo.progress)"
    Write-Host "  Blockers:   $(if ($stateInfo.blockers -and $stateInfo.blockers -ne '-') { $stateInfo.blockers } else { 'none' })"
    Write-Host ""

    Write-Host "${C_CYAN}Project structure:${C_RESET}"
    $validation = Test-ProjectStructure
    foreach ($v in $validation) {
        $color = if ($v.Exists) { "Green" } else { "Red" }
        Write-Host "  $($v.Status) $($v.File)" -ForegroundColor $color
    }
}

function Export-Context {
    $context = Get-Context
    $json = $context | ConvertTo-Json -Depth 4

    if ($args -contains "--format" -and $args -contains "json") {
        Write-Host $json
    }
    else {
        $json | Out-File "$MVGN_ROOT\.mvgn-context.json"
        Save-Session $context
        Write-Host "${C_GREEN}Context exported to .mvgn-context.json${C_RESET}"
        Write-Host "${C_GREEN}Session state saved to .mvgn/session-state.json${C_RESET}"

        # Also show summary
        Write-Host ""
        Write-Host "${C_CYAN}Context summary:${C_RESET}"
        Write-Host "  System:       $($context.system)"
        Write-Host "  State:        $($context.state)"
        Write-Host "  Mode:         $($context.mode)"
        Write-Host "  Active layer: $($context.active_layer)"
        Write-Host "  Integrity:    $($context.integrity)"
        Write-Host "  Task:         $($context.task)"
        Write-Host "  Progress:     $($context.progress)"
        Write-Host "  Blockers:     $(if ($context.blockers -and $context.blockers -ne '-') { $context.blockers } else { 'none' })"
        Write-Host "  Contract:     $($context.contract)"
        Write-Host "  Authority:    $($context.authority)"
        Write-Host "  Next:         $($context.next_action)"
        if ($context.contract -eq "loaded") {
            Write-Host ""
            Write-Host "${C_GREEN}Session contract is ACTIVE. AI behavior bound by session-contract.md.${C_RESET}"
        }
        if ($context.authority -eq "loaded") {
            Write-Host "${C_GREEN}Authority map loaded. Priority: Contract > Kernel > Recovery > Rules > Engine${C_RESET}"
        }
    }
}

function Invoke-Validate {
    Show-Banner
    Write-Host "${C_CYAN}Running system validation...${C_RESET}"
    Write-Host ""

    $state = Get-State
    $failures = @()

    # K-01: State report exists and has valid header
    if (!(Test-Path $STATE_PATH)) {
        $failures += "K-01: State report not found at $STATE_PATH"
        Write-Host "  [--] K-01: State report missing" -ForegroundColor Red
    }
    else {
        Write-Host "  [OK] K-01: State report accessible" -ForegroundColor Green
    }

    # K-02: Single state declared
    $declared = Get-State
    if ($declared.state -and $declared.state -ne "") {
        Write-Host "  [OK] K-02: State = $($declared.state)" -ForegroundColor Green
    }
    else {
        $failures += "K-02: No valid state declared"
        Write-Host "  [--] K-02: No valid state" -ForegroundColor Red
    }

    # K-03: State consistency with docs
    $stateOk = $true
    if ($declared.state -eq "PRD_APPROVED" -or $declared.state -eq "ARCHITECTURE_REQUIRED" -or $declared.state -eq "ARCHITECTURE_APPROVED" -or $declared.state -eq "READY_TO_BUILD" -or $declared.state -eq "IN_PROGRESS") {
        if (!(Test-Path "$DOCS_DIR\01_prd.md")) {
            $failures += "K-03: State is $($declared.state) but 01_prd.md is missing"
            $stateOk = $false
        }
    }
    if ($stateOk) {
        Write-Host "  [OK] K-03: State consistent with docs" -ForegroundColor Green
    }
    else {
        Write-Host "  [--] K-03: State inconsistent with docs" -ForegroundColor Red
    }

    # K-04: No phantom blockers
    if ($declared.state -eq "BLOCKED") {
        Write-Host "  [!!] K-04: System is BLOCKED" -ForegroundColor Yellow
    }
    else {
        Write-Host "  [OK] K-04: No active blockers" -ForegroundColor Green
    }

    # K-05: All layers available
    $layersOk = $true
    foreach ($file in @("system-rules.md", "execution-engine.md", "recovery-protocol.md", "kernel-spec.md")) {
        if (!(Test-Path "$MVGN_DIR\$file")) {
            $failures += "K-05: Missing layer $file"
            $layersOk = $false
        }
    }
    if ($layersOk) {
        Write-Host "  [OK] K-05: All layers present" -ForegroundColor Green
    }
    else {
        Write-Host "  [--] K-05: Some layers missing" -ForegroundColor Red
    }

    # K-06: Session contract present
    if (Test-Path "$MVGN_DIR\session-contract.md") {
        Write-Host "  [OK] K-06: Session contract present" -ForegroundColor Green
    }
    else {
        $failures += "K-06: Missing session-contract.md"
        Write-Host "  [--] K-06: Session contract missing" -ForegroundColor Red
    }

    # K-07: Authority map present
    if (Test-Path "$MVGN_DIR\authority-map.md") {
        Write-Host "  [OK] K-07: Authority map present" -ForegroundColor Green
    }
    else {
        $failures += "K-07: Missing authority-map.md"
        Write-Host "  [--] K-07: Authority map missing" -ForegroundColor Red
    }

    Write-Host ""

    if ($failures.Count -eq 0) {
        Write-Host "${C_GREEN}All checks passed. System integrity: OK${C_RESET}"
        return $true
    }
    else {
        Write-Host "${C_RED}Failures detected ($($failures.Count)):${C_RESET}"
        foreach ($f in $failures) {
            Write-Host "  * $f" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "${C_YELLOW}System integrity: DEGRADED. Run recovery protocol for full restore.${C_RESET}"
        return $false
    }
}

# --- Dispatch ---

switch ($command.ToLower()) {
    "start" {
        Start-MVGN
    }
    "resume" {
        Resume-MVGN
    }
    "state" {
        Show-State
    }
    "context" {
        Export-Context
    }
    "validate" {
        Invoke-Validate
    }
    "help" {
        Show-Banner
        Write-Host "${C_CYAN}Usage:${C_RESET}"
        Write-Host "  .\tools\mvgn.ps1 <command>"
        Write-Host ""
        Write-Host "${C_CYAN}Commands:${C_RESET}"
        Write-Host "  start      Bootstrap the MVGN system (default)"
        Write-Host "  resume     Resume previous session"
        Write-Host "  state      Show current system state"
        Write-Host "  context    Export machine-readable context (.mvgn-context.json)"
        Write-Host "  validate   Run integrity checks (K-01 through K-07)"
        Write-Host "  help       Show this help"
        Write-Host ""
        Write-Host "${C_CYAN}Examples:${C_RESET}"
        Write-Host "  .\tools\mvgn.ps1"
        Write-Host "  .\tools\mvgn.ps1 state"
        Write-Host "  .\tools\mvgn.ps1 context"
    }
    default {
        Write-Host "${C_RED}Unknown command: $command${C_RESET}"
        Write-Host "Available: start, resume, state, context, validate, help"
        Write-Host ""
        Start-MVGN
    }
}
