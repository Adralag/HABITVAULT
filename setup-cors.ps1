# Firebase Storage CORS Setup Script
# Run this script after installing Google Cloud SDK

Write-Host "Firebase Storage CORS Configuration Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if gsutil is installed
Write-Host "Checking for Google Cloud SDK (gsutil)..." -ForegroundColor Yellow
$gsutilCheck = Get-Command gsutil -ErrorAction SilentlyContinue

if (-not $gsutilCheck) {
    Write-Host "ERROR: gsutil not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Google Cloud SDK:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Restart PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    pause
    exit
}

Write-Host "✓ gsutil found!" -ForegroundColor Green
Write-Host ""

# Initialize gcloud if needed
Write-Host "Initializing gcloud (you may need to login)..." -ForegroundColor Yellow
gcloud init --skip-diagnostics

Write-Host ""
Write-Host "Applying CORS configuration to Firebase Storage..." -ForegroundColor Yellow
gsutil cors set cors.json gs://habitvault-f430f.appspot.com

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ CORS configuration applied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying CORS configuration..." -ForegroundColor Yellow
    gsutil cors get gs://habitvault-f430f.appspot.com
    Write-Host ""
    Write-Host "✓ Setup complete! You can now upload profile pictures." -ForegroundColor Green
    Write-Host "Remember to restart your dev server (npm run dev)" -ForegroundColor Cyan
} else {
    Write-Host "✗ Failed to apply CORS configuration" -ForegroundColor Red
    Write-Host "Please check your permissions and try again" -ForegroundColor Yellow
}

Write-Host ""
pause
