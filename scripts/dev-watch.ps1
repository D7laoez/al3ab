param(
  [int]$IntervalSeconds = 3,
  [string]$Branch = 'main'
)

$ErrorActionPreference = 'Continue'

Write-Host '==============================================' -ForegroundColor Cyan
Write-Host ' مركز السيارة - Live Development Updater' -ForegroundColor Cyan
Write-Host ' GitHub -> PC automatic sync' -ForegroundColor Cyan
Write-Host '==============================================' -ForegroundColor Cyan
Write-Host "Branch: $Branch | Every $IntervalSeconds seconds" -ForegroundColor DarkGray
Write-Host ''

while ($true) {
  $status = git status --porcelain 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Host 'Git repository unavailable. Retrying...' -ForegroundColor Yellow
    Start-Sleep -Seconds $IntervalSeconds
    continue
  }

  if ($status) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Local changes detected; skipping pull to protect your work." -ForegroundColor Yellow
  } else {
    git fetch origin $Branch --quiet 2>$null
    if ($LASTEXITCODE -eq 0) {
      $local = git rev-parse HEAD 2>$null
      $remote = git rev-parse "origin/$Branch" 2>$null
      if ($local -ne $remote) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] New GitHub changes detected. Pulling..." -ForegroundColor Green
        git pull --rebase --autostash origin $Branch
        if ($LASTEXITCODE -eq 0) {
          Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Updated successfully." -ForegroundColor Green
        } else {
          Write-Host 'Pull failed; check the terminal for details.' -ForegroundColor Red
        }
      }
    }
  }
  Start-Sleep -Seconds $IntervalSeconds
}
