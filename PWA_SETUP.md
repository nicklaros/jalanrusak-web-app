# PWA Setup Instructions

## What was added

This Progressive Web App (PWA) setup allows Android users to install Jalan Rusak as a standalone app on their home screen.

### Files Created

1. **`public/manifest.json`** - Web App Manifest
   - App name, description, and icons configuration
   - Theme colors and display settings
   - Install shortcuts for quick reporting

2. **`public/sw.js`** - Service Worker
   - Caches essential pages for offline access
   - Improves load time after first visit

3. **`src/components/PWARegistrar.tsx`** - PWA Registration Component
   - Registers the service worker
   - Shows install prompt for eligible browsers
   - Provides fallback instructions for manual installation

4. **`public/icon.svg`** - Icon source file

5. **`scripts/generate-icons.html`** - Icon generator tool

## How to complete the setup

### Step 1: Generate PWA Icons

Open `scripts/generate-icons.html` in your browser and click "Download All Icons". Copy all PNG files to the `public/` directory.

Alternatively, use a Node.js script with `sharp`:

```bash
# Install sharp
npm install --save-dev sharp

# Run the icon generator (create this script)
node scripts/generate-icons.js
```

### Step 2: Icon sizes needed

Place these files in `public/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `icon-maskable-192x192.png`
- `icon-maskable-512x512.png`

### Step 3: Test the PWA

1. Start the dev server: `npm run dev`
2. Open Chrome DevTools
3. Go to the "Application" tab
4. Check:
   - Manifest: Verify manifest is loaded
   - Service Workers: Verify service worker is registered
   - "Add to home screen" button should appear (after reload)

## For Android Users

Once deployed, users can install the app:

### Automatic Prompt (Recommended)
- Eligible users will see an install prompt automatically
- They can click "Install" to add the app to their home screen

### Manual Installation (Chrome)
1. Tap the menu (three dots) in the top-right
2. Tap "Add to Home Screen" or "Install App"

### Manual Installation (Firefox)
1. Tap the menu (three dots)
2. Tap "Add to Home Screen"

### Manual Installation (Edge)
1. Tap the menu (three dots)
2. Tap "Add to Phone"

## Features

- ✅ Standalone app experience (no browser UI)
- ✅ Home screen icon
- ✅ Offline support for core pages
- ✅ Fast loading after first visit
- ✅ Install prompt for eligible browsers
- ✅ Shortcuts for quick access to reporting
- ✅ Indonesian language support

## Next Steps (Optional)

1. **Add push notifications** - Notify users about report status updates
2. **Add offline form submission** - Queue reports when offline, sync when online
3. **Add share target** - Allow sharing images directly to the app
4. **Add periodic sync** - Background sync for reports
5. **Create custom icons** - Replace with branded icons

## Troubleshooting

**Install prompt not showing?**
- Ensure the site is served over HTTPS
- User must have some interaction with the site first
- Service worker must be registered
- Check Chrome DevTools Application tab for errors

**Icons not displaying?**
- Verify all PNG files are in `public/` directory
- Check file names match exactly (including capitalization)
- Ensure images are valid PNG format
