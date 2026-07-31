import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Helper to write CRC32 checksum for PNG chunks
function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression method
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace method
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw RGBA image data generation
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  const cx = width / 2;
  const cy = height / 2;
  const radius = width / 2;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = 15, g = 23, b = 42, a = 255; // Default background: slate-900 (#0f172a)

      if (isMaskable) {
        // Solid dark blue fill for maskable background safe zone
        r = 15; g = 23; b = 42; a = 255;
      } else {
        // Rounded circle background for normal icons
        if (dist > radius - 2) {
          a = 0; // transparent corners
        }
      }

      if (a > 0) {
        // Render stylized VyLab icon inside safe radius
        const normDist = dist / radius;

        // Outer glowing ring (Atomic Orbit)
        if (Math.abs(normDist - 0.72) < 0.06) {
          r = 56; g = 189; b = 248; // cyan-400 (#38bdf8)
          a = 255;
        }

        // Crossed orbital ring
        const rotX = dx * 0.707 + dy * 0.707;
        const rotY = -dx * 0.707 + dy * 0.707;
        const rotDist = Math.sqrt((rotX * 0.4) * (rotX * 0.4) + rotY * rotY) / radius;
        if (Math.abs(rotDist - 0.55) < 0.04) {
          r = 129; g = 140; b = 248; // indigo-400 (#818cf8)
          a = 255;
        }

        // Flask Flask outline / liquid core (Chemistry + Physics union)
        // Triangle/Trapezoid beaker shape centered
        const beakerY = (y - cy) / radius;
        const beakerX = Math.abs(x - cx) / radius;

        if (beakerY >= -0.2 && beakerY <= 0.35) {
          const expectedWidth = 0.1 + (beakerY + 0.2) * 0.5;
          if (beakerX <= expectedWidth) {
            if (beakerY >= 0.05) {
              // Glowing liquid in beaker (Pink/Purple gradient)
              r = 236; g = 72; b = 153; // pink-500 (#ec4899)
            } else {
              // Upper flask neck/body glass shimmer
              r = 99; g = 102; b = 241; // indigo-500 (#6366f1)
            }
            a = 255;
          }
        }

        // Bright central spark / electron dot
        if (Math.hypot(x - (cx + radius * 0.4), y - (cy - radius * 0.3)) < radius * 0.08) {
          r = 250; g = 204; b = 21; // yellow-400 (#facc15)
          a = 255;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // Compress IDAT using built-in Node zlib
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Generate files
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA Icons...');

const icon192 = generatePng(192, 192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);

const icon512 = generatePng(512, 512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);

const iconMaskable = generatePng(512, 512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);

const appleIcon = generatePng(180, 180, true);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// Create high-res vector SVG favicon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="url(#bg-grad)"/>
  <circle cx="256" cy="256" r="180" stroke="#38bdf8" stroke-width="16" stroke-dasharray="8 8" opacity="0.6"/>
  <ellipse cx="256" cy="256" rx="200" ry="70" stroke="#818cf8" stroke-width="12" transform="rotate(-30 256 256)"/>
  <ellipse cx="256" cy="256" rx="200" ry="70" stroke="#ec4899" stroke-width="12" transform="rotate(30 256 256)"/>
  
  <!-- Flask Beaker -->
  <path d="M224 160H288V220L350 320C365 344 348 376 320 376H192C164 376 147 344 162 320L224 220V160Z" fill="url(#flask-grad)" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
  <path d="M178 300C220 280 292 310 334 290L348 316C360 336 345 360 320 360H192C167 360 152 336 164 316L178 300Z" fill="#ec4899" opacity="0.85"/>
  <circle cx="230" cy="320" r="10" fill="#ffffff" opacity="0.8"/>
  <circle cx="275" cy="280" r="14" fill="#ffffff" opacity="0.7"/>
  <circle cx="370" cy="170" r="16" fill="#facc15"/>
  
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="flask-grad" x1="256" y1="160" x2="256" y2="376" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#818cf8" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

console.log('PWA Icons generated successfully!');
