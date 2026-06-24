# 03 — Tasks

> Proyecto: Press Kit Digital — Nicols Capetillo
> Estado general: **COMPLETED** (13/13 tareas completadas)

---

## T-001: Scaffold del proyecto Astro

- [x] Inicializar proyecto con `npm create astro@latest -- --template minimal`
- [x] Configurar `astro.config.mjs` con `site` y `format: 'file'`
- [x] Configurar `tsconfig.json` estricto
- **Archivos:** `package.json`, `astro.config.mjs`, `tsconfig.json`
- **Criterios:** Proyecto compila sin errores con `astro build`

## T-002: Diseño del sistema (global.css + Layout)

- [x] Definir CSS Custom Properties para colores, tipografía, glassmorphism, layout
- [x] Implementar tema claro/oscuro con `data-theme` + `localStorage`
- [x] Crear Layout.astro con fonts, Lucide Icons, FluidBackground
- [x] Implementar clases utilitarias: `.glass`, `.container`, `.section`, `.reveal`
- [x] Animaciones scroll reveal con IntersectionObserver
- **Archivos:** `src/styles/global.css`, `src/layouts/Layout.astro`
- **Criterios:** Tema toggle funcional, sin flash en carga, glass effect visible

## T-003: Data layer — nicolas.json

- [x] Crear estructura JSON con datos personales, físicos, idiomas, skills
- [x] Incluir timeline (9 entries), filmography (3), gallery (35), contact
- [x] Definir rutas de fotos y videos
- **Archivos:** `src/data/nicolas.json`
- **Criterios:** JSON completo sin placeholders, importable por cualquier componente

## T-004: Componente FluidBackground

- [x] Canvas animado con 4 field blobs que reaccionan al mouse/touch
- [x] Cambio de paleta según tema claro/oscuro vía MutationObserver
- [x] Grain overlay + vignette
- [x] Respetar `prefers-reduced-motion`
- **Archivos:** `src/components/FluidBackground.astro`
- **Criterios:** Fondo animado sin impacto perceptible en rendimiento

## T-005: Componente Navigation

- [x] Top navbar fijo con glassmorphism y logo "NC"
- [x] Links de navegación a todas las secciones
- [x] Scroll spy para resaltar sección activa
- [x] Barra de progreso de scroll
- [x] Bottom mobile nav con 7 iconos (oculto en desktop)
- [x] Theme toggle button
- **Archivos:** `src/components/Navigation.astro`
- **Criterios:** Navegación funcional en mobile y desktop, scroll spy preciso

## T-006: Componente Hero

- [x] Layout full-viewport con orbs animados de fondo
- [x] Glass card con nombre, título, descripción
- [x] Carrusel de fotos con crossfade cada 5s (9 fotos)
- [x] Metrics card (Netflix, 4 idiomas, GDL base)
- [x] Credits bar y CTAs (Ver Demo Reel, Descargables)
- [x] Responsive: single column en tablet/mobile
- **Archivos:** `src/components/Hero.astro`
- **Criterios:** Carrusel funcional, CTAs navegan a secciones correctas

## T-007: Componentes Biography + Filmography + DemoReel

- [x] Biography: portrait sticky, bio con drop cap, stats, timeline grid de 9 cards
- [x] Filmography: 3 entries cinematográficos con backdrop hover, año, rol, links
- [x] DemoReel: YouTube embed 16:9 + 2 clips verticales MP4
- **Archivos:** `src/components/Biography.astro`, `src/components/Filmography.astro`, `src/components/DemoReel.astro`
- **Criterios:** Timeline con hover reveal, film backdrops con efecto color/zoom, videos reproducibles

## T-008: Componentes Gallery + Downloads + Footer

- [x] Gallery: grid preview 6 fotos + lightbox fullscreen con 35 fotos
- [x] Lightbox: navegación por teclado (← →), swipe táctil, contador, caption, download ZIP link
- [x] Downloads: ficha técnica con datos físicos/idiomas/skills en tarjetas
- [x] Footer: 3 columnas con logo, copyright, MVGN Labs credit
- **Archivos:** `src/components/Gallery.astro`, `src/components/Downloads.astro`, `src/components/Footer.astro`
- **Criterios:** Lightbox funcional con todas las fotos, ficha técnica con datos correctos

## T-009: Página principal (index.astro)

- [x] Integrar todos los componentes en una sola página
- [x] Botones flotantes: scroll-to-top y mail CTA
- [x] Script de IntersectionObserver para scroll reveal global
- **Archivos:** `src/pages/index.astro`
- **Criterios:** Página única renderiza todas las secciones sin errores

## T-010: Build, deploy y assets

- [x] Verificar build exitoso con `astro build`
- [x] Desplegar en Vercel
- [x] Subir assets multimedia (35 fotos, 2 videos, favicon)
- **Archivos:** `dist/`, `public/assets/`
- **Criterios:** Sitio accesible públicamente, todos los assets cargan, build sin errores

---

## T-011: Mejoras de responsividad mobile

- [x] Deshabilitar canvas de FluidBackground en < 768px para rendimiento en mobile (CSS + early return JS)
- [x] Reemplazar `bottom: calc(68px + ...)` hardcodeado en botones flotantes por JS dinámico (responsive a bottom nav height)
- [x] Ajustar padding de lightbox header/footer en < 480px
- [x] Agregar breakpoint 480px en global.css para reducir padding de secciones
- [x] Aumentar `max-width` de clips verticales en DemoReel a 280px en < 480px
- [x] Agregar `overflow-x: hidden` a secciones via `.section` en global.css
- [x] Agregar `(hover: none) and (pointer: coarse)` en Footer para touch devices
- **Archivos:** `src/components/FluidBackground.astro`, `src/pages/index.astro`, `src/components/Gallery.astro`, `src/styles/global.css`, `src/components/DemoReel.astro`, `src/components/Footer.astro`
- **Criterios:** Build exitoso. Sitio navegable y visualmente correcto en 375px, 480px, 768px, 1024px. Sin overflow horizontal. Botones flotantes posicionados dinámicamente sobre bottom nav. Lightbox usable en pantallas pequeñas.

---

## Resumen

| Estado | Conteo |
|--------|--------|
## T-012: Footer mobile + menú hamburguesa

- [x] Footer mobile: layout vertical con mejor espaciado, padding inferior para bottom nav, centrado, copyright con borde separador
- [x] Menú hamburguesa: botón animado en nav (visible < 768px), panel lateral con overlay, toggle JS, cierre al hacer clic en link o overlay
- **Archivos:** `src/components/Footer.astro`, `src/components/Navigation.astro`
- **Criterios:** Build exitoso. Footer legible en mobile sin elementos pegados. Menú hamburguesa funcional con animación smooth.

## T-013: Galería carrusel móvil + botones flotantes

- [x] Convertir gallery grid a carrusel horizontal con scroll snap en móvil (< 640px)
- [x] Agregar botones de navegación (prev/next) y dots indicadores para el carrusel móvil
- [x] Ocultar navegación del carrusel en desktop
- [x] Reemplazar posicionamiento inline de botones flotantes por CSS calc() con custom property `--bottom-nav-h`
- [x] Apilar botón scroll-to-top abajo y mail CTA arriba con gap de 8px
- **Archivos:** `src/components/Gallery.astro`, `src/pages/index.astro`
- **Criterios:** Build exitoso. Galería en carrusel navegable en móvil con botones y dots. Botones flotantes apilados correctamente sin superposición.

---

## Resumen

| Estado | Conteo |
|--------|--------|
| Completadas | 13 |
| Pendientes | 0 |
| En progreso | 0 |
| Bloqueadas | 0 |
| **Total** | **13** |

---

**Historial de cambios:**
- 2026-06-24: Documento creado con tareas del proyecto existente
- 2026-06-24: Añadida T-013 — Galería carrusel móvil + botones flotantes
