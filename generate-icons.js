// Generates icon16.png, icon48.png, icon128.png — no external deps.
// Run: node generate-icons.js
const fs   = require("fs");
const path = require("path");
const zlib = require("zlib");

// ── PNG helpers ──────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n, 0); return b; }

function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  return Buffer.concat([u32(d.length), t, d, u32(crc32(Buffer.concat([t, d])))]);
}

function encodePNG(size, rgba) {
  const sig  = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8]=8; ihdr[9]=6; // 8-bit RGBA

  // Add filter byte 0 (None) before each row
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const s = (y * size + x) * 4;
      const d = y * (size * 4 + 1) + 1 + x * 4;
      raw[d]=rgba[s]; raw[d+1]=rgba[s+1]; raw[d+2]=rgba[s+2]; raw[d+3]=rgba[s+3];
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

// ── Drawing helpers ──────────────────────────────────────────────
function drawIcon(size) {
  const px = new Uint8Array(size * size * 4); // RGBA, starts transparent

  function put(x, y, r, g, b, a) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const i = (y * size + x) * 4;
    // Alpha-blend over existing
    const srcA = a / 255, dstA = px[i+3] / 255;
    const outA  = srcA + dstA * (1 - srcA);
    if (outA === 0) return;
    px[i]   = Math.round((r * srcA + px[i]   * dstA * (1 - srcA)) / outA);
    px[i+1] = Math.round((g * srcA + px[i+1] * dstA * (1 - srcA)) / outA);
    px[i+2] = Math.round((b * srcA + px[i+2] * dstA * (1 - srcA)) / outA);
    px[i+3] = Math.round(outA * 255);
  }

  // Soft rounded-rect fill with per-pixel corner anti-aliasing
  function fillRRect(x0, y0, w, h, radius, r, g, b, a) {
    const x1 = x0 + w - 1, y1 = y0 + h - 1;
    const cx = [x0+radius-1, x1-radius+1]; // corner centres x
    const cy = [y0+radius-1, y1-radius+1]; // corner centres y

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        // Determine which (if any) corner quadrant we're in
        let inCorner = false, dist2 = 0, limit2 = radius * radius;
        if      (x <= cx[0] && y <= cy[0]) { inCorner=true; const dx=x-cx[0], dy=y-cy[0]; dist2=dx*dx+dy*dy; }
        else if (x >= cx[1] && y <= cy[0]) { inCorner=true; const dx=x-cx[1], dy=y-cy[0]; dist2=dx*dx+dy*dy; }
        else if (x <= cx[0] && y >= cy[1]) { inCorner=true; const dx=x-cx[0], dy=y-cy[1]; dist2=dx*dx+dy*dy; }
        else if (x >= cx[1] && y >= cy[1]) { inCorner=true; const dx=x-cx[1], dy=y-cy[1]; dist2=dx*dx+dy*dy; }

        if (inCorner) {
          if (dist2 > limit2) continue; // outside corner
          // Simple anti-alias: blend edge pixel
          const edgeFade = Math.max(0, Math.min(1, (limit2 - dist2) / (2 * radius + 1)));
          put(x, y, r, g, b, Math.round(a * edgeFade));
        } else {
          put(x, y, r, g, b, a);
        }
      }
    }
  }

  // ── Background: #09090b ──
  const bgR = Math.round(size * 0.22);
  fillRRect(0, 0, size, size, bgR, 9, 9, 11, 255);

  // ── Waveform bars (indigo #6366f1) ──
  const barRelH = [0.28, 0.52, 0.76, 1.0, 0.82, 0.56, 0.32];
  const n       = barRelH.length;
  const padX    = size * 0.15;
  const avail   = size - padX * 2;
  const gapW    = avail * 0.055;
  const barW    = Math.max(1, Math.round((avail - gapW * (n - 1)) / n));
  const maxH    = size * 0.50;
  const midY    = size * 0.52;
  const barR    = Math.max(1, Math.min(Math.round(barW / 2), Math.round(size * 0.055)));

  barRelH.forEach((rel, i) => {
    const h = Math.max(2, Math.round(maxH * rel));
    const x = Math.round(padX + i * (barW + gapW));
    const y = Math.round(midY - h / 2);
    const a = Math.round((0.5 + 0.5 * rel) * 255);
    fillRRect(x, y, barW, h, barR, 99, 102, 241, a);
  });

  return Buffer.from(px.buffer);
}

// ── Generate ─────────────────────────────────────────────────────
const iconsDir = path.join(__dirname, "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

[16, 48, 128].forEach(size => {
  const rgba = drawIcon(size);
  const png  = encodePNG(size, rgba);
  const out  = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(out, png);
  console.log(`✓ icons/icon${size}.png (${png.length} bytes)`);
});

console.log("\nDone — reload the extension in chrome://extensions");
