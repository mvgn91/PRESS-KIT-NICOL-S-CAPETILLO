import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

// Todas las fotos viven en src/assets/img/**. Las rutas lógicas del JSON
// ('/assets/fotos/1.jpg') se resuelven aquí a URLs optimizadas (WebP,
// ancho pedido, EXIF/GPS eliminado por sharp).
const mods = import.meta.glob<{ default: ImageMetadata }>(
  ['../assets/img/**/*.{jpg,jpeg,png}', '!../assets/img/fotos/newfront.jpg'],
  { eager: true }
);

function find(logical: string): ImageMetadata {
  const tail = logical.replace(/^\/assets\//, '');
  const key = Object.keys(mods).find((k) => k.endsWith(tail));
  if (!key) throw new Error(`[img] no existe asset para ${logical}`);
  return mods[key].default;
}

export async function opt(
  logical: string,
  width: number,
  quality = 72
): Promise<string> {
  const { src } = await getImage({
    src: find(logical),
    width,
    format: 'webp',
    quality,
  });
  return src;
}
