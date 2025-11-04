# Fix PWA icon filenames
Write-Host "Fixing PWA icon filenames..." -ForegroundColor Cyan

$publicDir = "C:\Users\segun\Desktop\HABITVAULT\HABITVAULT\public"

# Rename pwa-192x192.png.png to pwa-192x192.png
if (Test-Path "$publicDir\pwa-192x192.png.png") {
    Rename-Item -Path "$publicDir\pwa-192x192.png.png" -NewName "pwa-192x192.png" -Force
    Write-Host "✓ Renamed pwa-192x192.png.png -> pwa-192x192.png" -ForegroundColor Green
} else {
    Write-Host "✓ pwa-192x192.png already exists" -ForegroundColor Green
}

# Rename pwa-512x512.png.png to pwa-512x512.png
if (Test-Path "$publicDir\pwa-512x512.png.png") {
    Rename-Item -Path "$publicDir\pwa-512x512.png.png" -NewName "pwa-512x512.png" -Force
    Write-Host "✓ Renamed pwa-512x512.png.png -> pwa-512x512.png" -ForegroundColor Green
} else {
    Write-Host "✓ pwa-512x512.png already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done! Now restart your dev server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
