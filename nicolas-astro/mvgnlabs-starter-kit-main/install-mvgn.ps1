<#
.SYNOPSIS
    Install MVGN CLI globally. Run from repo root after cloning.
.DESCRIPTION
    Installs 'mvgn' as a global PowerShell function so you can run `mvgn start` from any project folder.
    Also copies tools/ to a permanent location under $env:USERPROFILE\mvgn.
.PARAMETER InstallPath
    Where to install MVGN globally (default: $env:USERPROFILE\mvgn).
.EXAMPLE
    .\install-mvgn.ps1
    .\install-mvgn.ps1 -InstallPath "D:\tools\mvgn"
#>

param (
    [string]$InstallPath = "$env:USERPROFILE\mvgn"
)

Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     MVGN CLI Installer v2.1             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Resolve source
$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path "$Source\tools\mvgn.ps1")) {
    Write-Host "ERROR: Run this script from the MVGN repo root." -ForegroundColor Red
    Write-Host "Expected: $Source\tools\mvgn.ps1"
    exit 1
}

Write-Host "Installing MVGN CLI to: $InstallPath" -ForegroundColor Yellow

# Create install directory
New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null

# Copy tools
Copy-Item -Recurse -Force "$Source\tools" "$InstallPath\tools"
Write-Host "  ✓ tools/ copied" -ForegroundColor Green

# Copy .mvgn (reference layers)
if (Test-Path "$Source\.mvgn") {
    Copy-Item -Recurse -Force "$Source\.mvgn" "$InstallPath\.mvgn"
    Write-Host "  ✓ .mvgn/ copied" -ForegroundColor Green
}

# Add to PowerShell profile
$profilePath = $PROFILE.CurrentUserAllHosts
$profileDir = Split-Path -Parent $profilePath

if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
}

$functionLine = "function mvgn { powershell -ExecutionPolicy Bypass -File `"$InstallPath\tools\mvgn.ps1`" @args }"

$alreadyInstalled = $false
if (Test-Path $profilePath) {
    $profileContent = Get-Content $profilePath -Raw
    if ($profileContent -match [regex]::Escape($functionLine)) {
        $alreadyInstalled = $true
    }
}

if (-not $alreadyInstalled) {
    Add-Content $profilePath "`n# MVGN CLI" | Out-Null
    Add-Content $profilePath $functionLine | Out-Null
    Write-Host "  ✓ Added to PowerShell profile: $profilePath" -ForegroundColor Green
}
else {
    Write-Host "  ∙ Already in PowerShell profile (skipped)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "${C_GREEN}Installation complete.${C_RESET}" -ForegroundColor Green
Write-Host ""
Write-Host "Usage:"
Write-Host "  cd your-mvgn-project"
Write-Host "  mvgn start"
Write-Host "  mvgn state"
Write-Host "  mvgn context"
Write-Host ""
Write-Host "Note: Restart your PowerShell session or run:"
Write-Host "  . $profilePath"
Write-Host ""
Write-Host "Then 'mvgn start' will work from any MVGN project folder."
