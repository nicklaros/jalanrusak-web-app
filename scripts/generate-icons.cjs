#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 *
 * This script generates all required PWA icon sizes from the source SVG.
 *
 * Usage:
 *   node scripts/generate-icons.js
 *
 * Requirements:
 *   npm install --save-dev sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];

// SVG source (same as icon.svg but inline for portability)
const SVG_SOURCE = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0369a1;stop-opacity:1" />
    </linearGradient>
  </defs>

  <circle cx="256" cy="256" r="240" fill="url(#roadGradient)" />

  <g fill="white">
    <path d="M100,350 L100,180 L150,150 L362,150 L412,180 L412,350 Z" opacity="0.3" />
    <path d="M110,350 L110,190 L155,160 L155,160 L155,350 Z" fill="none" stroke="white" stroke-width="4" opacity="0.7" />
    <path d="M402,350 L402,190 L357,160 L357,160 L357,350 Z" fill="none" stroke="white" stroke-width="4" opacity="0.7" />
    <line x1="256" y1="350" x2="256" y2="180" stroke="white" stroke-width="3" stroke-dasharray="20,10" opacity="0.7" />
    <ellipse cx="256" cy="280" rx="40" ry="20" fill="#fbbf24" stroke="#d97706" stroke-width="3" />
    <path d="M256,80 L286,140 L226,140 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
    <text x="256" y="128" font-size="24" font-weight="bold" fill="white" text-anchor="middle">!</text>
  </g>

  <g stroke="#fbbf24" stroke-width="3" fill="none" opacity="0.8">
    <path d="M230,285 L235,295 L225,305 L240,315" />
    <path d="M280,285 L275,295 L285,305 L270,315" />
  </g>
</svg>
`;

const MASKABLE_SVG_SOURCE = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="roadGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0369a1;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" fill="url(#roadGradient2)" />

  <g fill="white">
    <path d="M100,380 L100,180 L150,150 L362,150 L412,180 L412,380 Z" opacity="0.3" />
    <path d="M110,380 L110,190 L155,160 L155,160 L155,380 Z" fill="none" stroke="white" stroke-width="4" opacity="0.7" />
    <path d="M402,380 L402,190 L357,160 L357,160 L357,380 Z" fill="none" stroke="white" stroke-width="4" opacity="0.7" />
    <line x1="256" y1="380" x2="256" y2="180" stroke="white" stroke-width="3" stroke-dasharray="20,10" opacity="0.7" />
    <ellipse cx="256" cy="290" rx="40" ry="20" fill="#fbbf24" stroke="#d97706" stroke-width="3" />
    <path d="M256,80 L286,140 L226,140 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
    <text x="256" y="128" font-size="24" font-weight="bold" fill="white" text-anchor="middle">!</text>
  </g>

  <g stroke="#fbbf24" stroke-width="3" fill="none" opacity="0.8">
    <path d="M230,295 L235,305 L225,315 L240,325" />
    <path d="M280,295 L275,305 L285,315 L270,325" />
  </g>
</svg>
`;

// Get the public directory path
const publicDir = path.join(__dirname, '..', 'public');

async function generateIcon(size, svgSource, isMaskable = false) {
  const filename = isMaskable
    ? `icon-maskable-${size}x${size}.png`
    : `icon-${size}x${size}.png`;
  const outputPath = path.join(publicDir, filename);

  try {
    await sharp(Buffer.from(svgSource))
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to generate ${filename}:`, error.message);
  }
}

async function generateAllIcons() {
  console.log('🚧 Generating Jalan Rusak PWA icons...\n');

  // Generate standard icons
  console.log('Standard icons:');
  for (const size of ICON_SIZES) {
    await generateIcon(size, SVG_SOURCE);
  }

  // Generate maskable icons
  console.log('\nMaskable icons:');
  for (const size of MASKABLE_SIZES) {
    await generateIcon(size, MASKABLE_SVG_SOURCE, true);
  }

  console.log('\n✅ Done! Icons are ready in the public/ directory.');
}

// Run the generator
generateAllIcons().catch(console.error);
