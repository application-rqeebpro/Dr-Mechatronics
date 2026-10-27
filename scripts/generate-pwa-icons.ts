import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');

// Crisp SVG with Mechatronics gear + chip + graduation cap + pulse circuit
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="100" y1="100" x2="412" y2="412" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="104" fill="url(#bgGrad)"/>
  <rect x="8" y="8" width="496" height="496" rx="96" stroke="#38bdf8" stroke-width="4" stroke-opacity="0.25"/>

  <!-- Circuit traces background -->
  <path d="M60 160 H140 L180 200 V300" stroke="#0ea5e9" stroke-width="4" stroke-opacity="0.3" stroke-linecap="round"/>
  <circle cx="60" cy="160" r="8" fill="#38bdf8" fill-opacity="0.6"/>
  <path d="M452 352 H372 L332 312 V212" stroke="#0ea5e9" stroke-width="4" stroke-opacity="0.3" stroke-linecap="round"/>
  <circle cx="452" cy="352" r="8" fill="#38bdf8" fill-opacity="0.6"/>

  <!-- Mechatronics Gear Ring -->
  <g transform="translate(256, 256)" filter="url(#glow)">
    <circle r="140" stroke="url(#cyanGrad)" stroke-width="14" fill="#0f172a" fill-opacity="0.85"/>
    
    <!-- Gear teeth -->
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const angle = (i * 360) / 12;
        return `<rect x="-14" y="-162" width="28" height="24" rx="6" fill="#38bdf8" transform="rotate(${angle})"/>`;
      })
      .join('\n    ')}

    <!-- Inner Core & CPU lines -->
    <rect x="-70" y="-70" width="140" height="140" rx="24" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="6"/>
    
    <!-- Graduation Cap / Scholar Icon combined with Robot Eyes -->
    <path d="M0 -42 L64 -10 L0 22 L-64 -10 Z" fill="#38bdf8"/>
    <path d="M48 6 V36 C48 46 24 54 0 54 C-24 54 -48 46 -48 36 V6" stroke="#38bdf8" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M64 -10 V40" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
    <circle cx="64" cy="44" r="5" fill="#f59e0b"/>

    <!-- Glowing Mechatronics Pulse -->
    <path d="M-40 0 H-16 L-6 -22 L6 22 L16 0 H40" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Maskable version with safe-zone padding (80% scale centered)
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="100" y1="100" x2="412" y2="412" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>

  <!-- Full bleed background for maskable icon -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>

  <!-- Content scaled inside the safe 80% circle (radius ~204 centered at 256,256) -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <circle cx="256" cy="256" r="140" stroke="url(#cyanGrad)" stroke-width="14" fill="#0f172a" fill-opacity="0.85"/>
    <rect x="186" y="186" width="140" height="140" rx="24" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="6"/>
    <path d="M256 214 L320 246 L256 278 L192 246 Z" fill="#38bdf8"/>
    <path d="M304 262 V292 C304 302 280 310 256 310 C232 310 208 302 208 292 V262" stroke="#38bdf8" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M320 246 V296" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
    <circle cx="320" cy="300" r="5" fill="#f59e0b"/>
    <path d="M216 256 H240 L250 234 L262 278 L272 256 H296" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

async function generate() {
  const svgBuf = Buffer.from(svgIcon);
  const maskableBuf = Buffer.from(svgMaskable);

  // 192x192
  await sharp(svgBuf).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512
  await sharp(svgBuf).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 512x512 maskable
  await sharp(maskableBuf).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // Apple touch icon (180x180)
  await sharp(svgBuf).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicon (64x64)
  await sharp(svgBuf).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png');

  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
  console.log('Generated icon.svg');
}

generate().catch(console.error);
