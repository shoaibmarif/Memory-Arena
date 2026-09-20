import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let currentOffset = headerSize + dirEntrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // Offset of image data
    currentOffset += img.buffer.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);
}

async function run() {
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate PNGs at all key resolutions
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const p180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const p192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const p512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), p16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), p32);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), p48);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), p48);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), p180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), p192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), p512);

  // 2. Generate multi-size favicon.ico
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // 3. Generate 1200x630 OpenGraph / Twitter Social Card Image
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e1b4b" />
        <stop offset="100%" stop-color="#311042" />
      </linearGradient>
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366f1" />
        <stop offset="50%" stop-color="#a855f7" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)" />
    
    <!-- Decorative glow circles -->
    <circle cx="200" cy="150" r="180" fill="#6366f1" opacity="0.15" filter="blur(60px)" />
    <circle cx="1000" cy="480" r="220" fill="#ec4899" opacity="0.15" filter="blur(60px)" />

    <!-- Main Card Icon (centered left) -->
    <g transform="translate(140, 195)">
      <rect width="240" height="240" rx="48" fill="url(#brandGrad)" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.5))" />
      <g transform="translate(48, 48) scale(1.44)">
        <path d="M50 24c-14.36 0-26 11.64-26 26 0 7.82 3.46 14.83 8.94 19.57.94.81 1.5 1.98 1.5 3.22V75c0 2.21 1.79 4 4 4h23.12c2.21 0 4-1.79 4-4v-2.21c0-1.24.56-2.41 1.5-3.22C72.54 64.83 76 57.82 76 50c0-14.36-11.64-26-26-26z" fill="#ffffff" opacity="0.95" />
        <path d="M43 45a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="#4f46e5" />
        <path d="M40 56c2.5 3.5 17.5 3.5 20 0" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" />
      </g>
    </g>

    <!-- Typography -->
    <text x="440" y="270" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#ffffff" letter-spacing="-1.5">
      MEMORY ARENA
    </text>
    <text x="440" y="340" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="32" fill="#a855f7" letter-spacing="1">
      FREE ONLINE BRAIN PUZZLE GAME
    </text>
    <text x="440" y="410" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="24" fill="#94a3b8">
      Match pairs, beat best times &amp; master daily challenges. 100% offline.
    </text>

    <!-- Badges / Features pills -->
    <g transform="translate(440, 445)">
      <rect width="170" height="42" rx="14" fill="#6366f1" opacity="0.2" stroke="#6366f1" stroke-width="1.5" />
      <text x="85" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#a5b4fc">
        ⚡ Fast &amp; Offline
      </text>

      <rect x="185" width="180" height="42" rx="14" fill="#ec4899" opacity="0.2" stroke="#ec4899" stroke-width="1.5" />
      <text x="275" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#f472b6">
        🏆 12 Achievements
      </text>

      <rect x="380" width="170" height="42" rx="14" fill="#10b981" opacity="0.2" stroke="#10b981" stroke-width="1.5" />
      <text x="465" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="16" fill="#6ee7b7">
        📅 Daily Mode
      </text>
    </g>
  </svg>
  `;

  const ogBuffer = await sharp(Buffer.from(ogSvg)).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogBuffer);

  console.log('✅ Successfully generated all favicons, ICO, and OG image!');
}

run().catch(console.error);
