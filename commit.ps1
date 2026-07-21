<#
    One-Click Commit & Push Script
    Usage: .\commit.ps1 "commit message"
    Default message: "update code"
#>

param(
    [string]$Message = "update code"
)

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  One-Click Commit + Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check status
Write-Host "[1/4] Checking file changes..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 2. Stage all changes
Write-Host "[2/4] Staging all changes..." -ForegroundColor Yellow
git add .
Write-Host "All changes staged" -ForegroundColor Green
Write-Host ""

# 3. Commit
Write-Host "[3/4] Commit: $Message" -ForegroundColor Yellow
git commit -m $Message
if (-not $?) {
    Write-Host "Commit failed or nothing to commit" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Push to remote
Write-Host "[4/4] Pushing to remote..." -ForegroundColor Yellow
git push
if ($?) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Commit + Push Success!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed, please check remote config" -ForegroundColor Red
}
