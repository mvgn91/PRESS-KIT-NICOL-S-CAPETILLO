# TASKS — Ciclo de mejora PRESS-KIT Nicolás Capetillo (Astro)

## PAUSA — retomar en freebuff (2026-10-15)

Trabajo detenido por el operador a mitad del overhaul (F2-T17 [~], sin verificar).
Leer primero: `.mvgn/blackboard/HANDOFF-P3-freebuff.md` (estado, decisión A/B pendiente,
advertencia: todo el ciclo está sin commitear).

> Fuente: `docs/auditoria/AUDITORIA-VISUAL-2026-10-15.md` (16 hallazgos H-01–H-16).
> Decisiones del operador (2026-10-15): hero = solo las 3 fotos nuevas (reemplazo total) ·
> apertura = cuerpo completo color · marco 4:5 con `object-position` afinado por foto ·
> descargables = se mantiene OneDrive · captions clips = numeración neutra 01/02 ·
> ejecución por fases con visto bueno entre fases.
> Contenido intacto: solo cambia la presentación.
> Estados: `[ ]` pendiente · `[~]` en curso · `[x]` hecha · `[!]` bloqueada.
> Tablero terminal: `./board.sh` (ver) · `./board.sh start|done|block|todo <ID>`.

## FASE P0 — Bloqueadores (gate: visto bueno con capturas + pesos)

- [x] **F2-T01** Ingesta fotos hero — copiar las 3 nuevas a `nicolas-astro/public/assets/hero/` con nombres canónicos sin espacios (`hero-apertura-cuerpo.jpg`, `hero-bn-dramatico.jpg`, `hero-bn-claro.jpg`); registrar dimensiones/peso. Criterio: `ls` muestra 3 archivos, `curl` 200 en las 3 rutas, sin `new fotos/` con espacios en la ruta servida.
- [x] **F2-T02** Hero rediseño desktop + alternancia — `Hero.astro`: 6 slides alternados nueva/vieja (cuerpo → _P5A7051 → bn-dramático → _P5A7081 → bn-claro → _P5A7122), apertura cuerpo `eager`+`fetchpriority=high`; desktop dossier sin vidrio (copy transparente, retrato 3/4 con marco 2px, métricas y créditos como filas con reglas); móvil intacto; sin `heroZoom`/shuffle. Criterio: captura desktop sin vidrio, captura móvil sin cambios, LCP = cuerpo completo.
- [x] **F2-T03** Fix 404 galería — mover las 9 fotos de `public/assets/fotos hero section/` a `public/assets/fotos/` (directorio canónico) y verificar las 34 rutas de `nicolas.json → gallery[]` con HTTP 200. Criterio: 34/34 en 200, lightbox completo, sin carpeta con espacios en rutas servidas.
- [x] **F2-T04** Pipeline de imágenes — `astro:assets` (sharp): tiers 480/768/1200/1920, AVIF+WebP con fallback JPEG, `-strip` de EXIF/GPS, calidad 55–70; migrar `<img>` de hero, bio, ficha, fondos de filmografía y galería. Criterio: foto 1600px ≤ 250 KB, sin EXIF/GPS en `dist/`, peso inicial móvil ≤ 1.5 MB.
- [x] **F2-T05** Quitar Lucide CDN — eliminar `<script src lucide>` y `lucide.createIcons()` en `Layout.astro` (cero `data-lucide` en el proyecto, iconos ya son SVG inline). Criterio: 0 requests a terceros, consola sin errores.
- [x] **F2-T06** Metadata para compartir — `og:title/description/image` (1200×630 generada de `hero-bn-claro`), `twitter:card=summary_large_image`, `canonical`, `theme-color` en `Layout.astro`. Criterio: validador muestra tarjeta con foto + título.
- [x] **F2-T07** Verificación P0 — `astro build` verde + screenshots headless (desktop claro/oscuro, móvil) + medición de red: inicial móvil ≤ 1.5 MB, 34/34 fotos 200, LCP ≤ 2.5 s (4G simulado). Criterio: checklist §7 de la auditoría en verde para P0. **Gate del operador.**

## FASE P1 — Calidad profesional (gate: visto bueno)

- [x] **F2-T08** Hero móvil con retrato — banda de retrato 4:5 visible bajo 1024px (fin de `display:none` en `Hero.astro:515`). Criterio: captura 390px muestra rostro en primera pantalla.
- [x] **F2-T09** Galería accesible — cards `<div>` → `<button>`, lightbox `role=dialog` + `aria-modal` + foco al cerrar/retorno + trampa de foco + `aria-live` en contador (patrón interno: `Filmography.astro`). Criterio: 6/6 fotos abribles con Tab+Enter, foco gestionado.
- [x] **F2-T10** Dedupe doble fetch — rutas canónicas únicas tras T03/T04; verificar 0 URLs descargadas 2–3×. Criterio: `unique URLs == requests`.
- [x] **F2-T11** Filmografía táctil — año `2024 - Presente` en una línea (sin colisión del watermark) + fondo visible en `@media (hover:none)` (0.2–0.3) + tamaños declarados en `.film-bg img`. Criterio: captura móvil legible sin hover.
- [x] **F2-T12** Demo Reel 9:16 real — marcos con `aspect-ratio: 9/16`, ancho acotado, captions `01`/`02` neutros (sin inventar contenido). Criterio: clips a escala legible, captions distintos.
- [x] **F2-T13** Contraste AA — `--text-muted` `#888` → `#6b6b6b`, números de sección decorativos con `aria-hidden`, etiquetas ≥ 4.5:1. Criterio: 100% textos informativos en AA.
- [x] **F2-T14** Contacto denso — layout 2 columnas (contactos | acciones), WhatsApp visible (dato ya en `nicolas.json`), descargable OneDrive reubicado como acción. Criterio: sección ≤ 700px desktop, 4 canales visibles.
- [x] **F2-T15** SEO base — `robots.txt` + `sitemap.xml` + JSON-LD `Person` (sameAs IMDb/Instagram). Criterio: `/robots.txt` y `/sitemap.xml` en 200, rich-result válido.
- [x] **F2-T16** Verificación P1 — build + screenshots + checklist §7 (teclado, contraste, SEO). **Gate del operador.**

## FASE P2 — Refinamiento visual (gate: comparativa final)

- [~] **F2-T17** Superficie dossier — retirar vidrio del cuerpo (nav/lightbox/flotantes conservan), reglas 1px como estructura, tokens §5.2 (`--paper #f6f6f4`, `--line`, `--muted`, acento `--signal #b23a2e` solo en estados/foco/rating — veto del operador revierte solo el acento). Criterio: sin `glass` fuera de nav/lightbox/flotantes.
- [ ] **F2-T18** Tipografía a 2 familias — retirar Space Grotesk, microetiquetas a Inter 600 (≥0.75rem, tracking 0.08em), escala con salto real. Criterio: 0 referencias a Space Grotesk, jerarquía visible en captura.
- [ ] **F2-T19** Cronología como línea temporal — años al margen, entradas alineadas a la línea (es secuencia real, no grid de tarjetas). Criterio: captura muestra eje temporal, una sola etiqueta "Trayectoria".
- [ ] **F2-T20** Motion único — retirar reveals generales (`index.astro` observer), `heroZoom`, `slowZoom`, orbes en bucle; conservar transiciones de respuesta (hovers, lightbox, tema). Criterio: 1 momento orquestado (entrada hero), `prefers-reduced-motion` intacto.
- [ ] **F2-T21** Densidad + redundancias — ninguna sección > 1600px desktop; unificar subtitle/credits del hero; quitar "Trayectoria" duplicada. Criterio: alturas medidas ≤ 1600px, sin texto duplicado visible.
- [ ] **F2-T22** Verificación P2 + comparativa — build + set completo de capturas antes/después + checklist §7 final. **Gate del operador y cierre del ciclo.**

## Resumen

| Fase | Total | Hechas | En curso | Bloqueadas |
|------|------:|-------:|---------:|-----------:|
| P0   | 7     | 0      | 0        | 0          |
| P1   | 9     | 0      | 0        | 0          |
| P2   | 6     | 0      | 0        | 0          |
| **Total** | **22** | **0** | **0** | **0** |
