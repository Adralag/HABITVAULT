# PWA Icons Required

To complete the PWA setup, you need to create the following icon files and place them in the `/public` folder:

## Required Icons:
1. **pwa-192x192.png** - 192x192px PNG image of your app logo
2. **pwa-512x512.png** - 512x512px PNG image of your app logo
3. **apple-touch-icon.png** - 180x180px PNG for iOS home screen
4. **favicon.ico** - 32x32px ICO file for browser tab

## Optional:
5. **screenshot1.png** - 750x1334px screenshot of the app for app stores

## Quick Generation:
You can use your existing logo from `src/assets/logo-no-bg.png` and resize it using:
- Online tool: https://realfavicongenerator.net/
- Or command line: `convert logo.png -resize 192x192 pwa-192x192.png`

## Current Logo Location:
- `src/assets/logo-no-bg.png`
- `src/assets/logo.png`

These should be converted to the required sizes and placed in `/public/`.
