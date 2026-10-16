// =====================================================================
// Genera el ZIP de fotos en alta resolución del press kit.
//  - Fuente: src/data/nicolas.json (álbum/galería) + fotos del hero,
//    deduplicadas por contenido (las copias no se repiten).
//  - Nomenclatura neutral: Nicolas-Capetillo-01.jpg … NN.jpg
//  - Reencoda con sharp: auto-orientación, 2500px de lado mayor,
//    JPEG q88 progresivo y SIN EXIF/GPS (privacidad del intérprete).
//  - Salida: public/descargas/nicolas-capetillo-fotos.zip
// Uso: npm run zip  (y automáticamente antes de `npm run build`)
// =====================================================================
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ZipArchive } from 'archiver';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/nicolas.json'), 'utf8'));

const OUT_DIR = path.join(root, 'public/descargas');
const OUT_FILE = path.join(OUT_DIR, 'nicolas-capetillo-fotos.zip');
const FOLDER = 'Nicolas-Capetillo';
const MAX_EDGE = 2500;
const QUALITY = 88;

// Álbum del sitio + las 3 fotos que solo viven en el hero.
const sources = [
  ...data.gallery.map((g) => g.src),
  '/assets/hero/hero-apertura-cuerpo.jpg',
  '/assets/hero/hero-bn-dramatico.jpg',
  '/assets/hero/hero-bn-claro.jpg',
];

const files = sources.map((src) =>
  path.join(root, 'src/assets/img', src.replace(/^\/assets\//, ''))
);
for (const f of files) {
  if (!fs.existsSync(f)) {
    console.error(`[zip] Falta la foto: ${f}`);
    process.exit(1);
  }
}

// Dedupe por contenido: las copias con otro nombre (p. ej. las del
// hero) no se repiten en el pack.
const seen = new Set();
const unique = [];
for (const f of files) {
  const hash = crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');
  if (seen.has(hash)) {
    console.log(`[zip] Duplicada, se omite: ${path.basename(f)}`);
    continue;
  }
  seen.add(hash);
  unique.push(f);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const output = fs.createWriteStream(OUT_FILE);
const zip = new ZipArchive({ zlib: { level: 9 } });
zip.on('warning', (err) => console.warn('[zip] warning:', err));
zip.on('error', (err) => { throw err; });
zip.pipe(output);

for (const [i, f] of unique.entries()) {
  const name = `${FOLDER}/Nicolas-Capetillo-${String(i + 1).padStart(2, '0')}.jpg`;
  const buf = await sharp(f)
    .rotate() // auto-orienta según EXIF y lo descarta al reencodar
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();
  zip.append(buf, { name });
  console.log(`[zip] ${name}  ${(buf.length / 1048576).toFixed(2)} MB`);
}

const closed = new Promise((resolve, reject) => {
  output.on('close', resolve);
  output.on('error', reject);
});
await zip.finalize();
await closed;

const mb = (fs.statSync(OUT_FILE).size / 1048576).toFixed(1);
console.log(`[zip] Listo: ${path.relative(root, OUT_FILE)} — ${unique.length} fotos, ${mb} MB`);
