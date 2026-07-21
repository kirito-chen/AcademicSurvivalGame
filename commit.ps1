<#
    一键提交脚本
    用法：.\commit.ps1 "你的提交信息"
    如果不传参数，使用默认提交信息
#>

param(
    [string]$Message = "更新代码"
)

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  一键提交 & 推送" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 查看状态
Write-Host "[1/4] 检查文件变更..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 2. 添加到暂存区
Write-Host "[2/4] 添加所有变更到暂存区..." -ForegroundColor Yellow
git add .
Write-Host "已添加所有变更" -ForegroundColor Green
Write-Host ""

# 3. 提交
Write-Host "[3/4] 提交: $Message" -ForegroundColor Yellow
git commit -m $Message
if (-not $?) {
    Write-Host "提交失败或没有变更需要提交" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. 推送到远程
Write-Host "[4/4] 推送到远程仓库..." -ForegroundColor Yellow
git push
if ($?) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  提交 & 推送成功!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "推送失败，请检查远程仓库配置" -ForegroundColor Red
}
