$ErrorActionPreference = 'Stop'

Write-Host 'مركز السيارة - تشغيل بيئة التطوير' -ForegroundColor Cyan
Write-Host ''

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git غير مثبت. ثبّت Git for Windows أولاً.' }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js غير مثبت. ثبّت Node.js 20+ أولاً.' }

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

if (-not (Test-Path '.git')) { throw 'هذا المجلد ليس نسخة Git من المشروع.' }

Write-Host '1) تحديث المشروع من GitHub...' -ForegroundColor DarkCyan
git pull --rebase --autostash origin main

Write-Host '2) تشغيل خادم الموقع...' -ForegroundColor DarkCyan
$server = Start-Process powershell -PassThru -ArgumentList @('-NoExit','-ExecutionPolicy','Bypass','-Command',"Set-Location '$root'; npm run serve")

Start-Sleep -Seconds 2
Start-Process 'http://localhost:3000'

Write-Host '3) تشغيل المراقب التلقائي...' -ForegroundColor DarkCyan
& (Join-Path $root 'scripts/dev-watch.ps1')
