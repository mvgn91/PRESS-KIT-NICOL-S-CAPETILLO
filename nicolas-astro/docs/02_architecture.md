# 02 — Architecture Document

> Proyecto: Press Kit Digital — Nicols Capetillo
> Versión: 1.0.0
> Estado: **APROBADO**

---

## 1. Arquitectura general

Sitio web estático de una sola página (SPA aparente) generado con Astro como Static Site Generator. Sin framework JS del lado del cliente — todo el JavaScript es scripting ligero inline para interactividad (tema, lightbox, navegación, animaciones).

```
[Browser] ← HTTP/2 → [Vercel CDN] → [Static Files (dist/)]
```

## 2. Diagrama de componentes

```
Layout.astro
├── FluidBackground.astro    (canvas animado, fondo fijo)
├── <slot />                 (contenido de página)
│   └── index.astro
│       ├── Navigation.astro (top nav fijo + bottom nav móvil)
│       ├── Hero.astro       (intro + carrusel + CTAs)
│       ├── Biography.astro  (portrait + bio + timeline)
│       ├── Filmography.astro(film entries cinematográficos)
│       ├── DemoReel.astro   (YouTube + clips)
│       ├── Gallery.astro    (grid + lightbox)
│       ├── Downloads.astro  (ficha técnica + contacto)
│       └── Footer.astro     (créditos)
└── <head>                   (global.css, Google Fonts, Lucide Icons)
```

## 3. Flujo de datos

```
src/data/nicolas.json
  │
  ├── Hero.astro         → personal.name, personal.description, carrusel fotos
  ├── Biography.astro    → personal.fullName, personal.bio, timeline[], physical
  ├── Filmography.astro  → filmography[]
  ├── DemoReel.astro     → demoReel
  ├── Gallery.astro      → gallery[]
  ├── Downloads.astro    → physical[], languages[], skills[], downloads, contact
  └── Footer.astro       → personal.name
```

## 4. Design System

### 4.1 Tokens (CSS Custom Properties en global.css)

| Categoría | Variables principales |
|-----------|----------------------|
| Colores | `--gray-50` a `--gray-950`, `--color-bg`, `--color-text`, `--color-accent` |
| Glassmorphism | `--glass-bg`, `--glass-border`, `--glass-shadow` |
| Tipografía | `--font-heading` (Archivo), `--font-sans` (Inter), `--font-mono` (Space Grotesk) |
| Layout | `--section-py`, `--container-max`, `--grid-gap` |
| Easing | `--ease-smooth`, `--ease-bounce` |

### 4.2 Modos visuales

- **Modo claro** (default): fondos claros, glass con blur suave
- **Modo oscuro** (`[data-theme="dark"]`): fondos oscuros, glass intenso
- Persistencia en `localStorage`, prevención de flash con script inline en `<head>`

### 4.3 Sistema de animaciones

- Scroll reveal con `IntersectionObserver` y clases `.reveal`, `.reveal-left`, `.reveal-right`
- Delays progresivos: `.delay-1` a `.delay-6`
- `prefers-reduced-motion` respetado

## 5. Decisiones arquitectónicas (ADRs)

### ADR-01: Astro sin framework JS cliente

**Contexto:** El sitio es principalmente informativo. No necesita reactividad compleja.

**Decisión:** Usar Astro puro con scripting vanilla inline. Sin React, Vue, Svelte.

**Consecuencia:** Zero JS runtime, bundle mínimo, carga instantánea.

### ADR-02: CSS puro sin preprocesador

**Contexto:** El design system es manejable en un solo archivo.

**Decisión:** Usar CSS Custom Properties en `global.css` sin Tailwind, SCSS o PostCSS.

**Consecuencia:** Sin dependencias de build CSS, control total, sin utility classes.

### ADR-03: Datos centralizados en JSON estático

**Contexto:** El contenido del press kit es relativamente estático.

**Decisión:** Todo el contenido en `src/data/nicolas.json` importado por los componentes.

**Consecuencia:** Un solo punto de verdad para contenido, fácil de actualizar.

### ADR-04: Galería con lightbox casero (sin librería)

**Contexto:** La galería necesita lightbox con navegación por teclado/touch.

**Decisión:** Implementar lightbox propio con JavaScript vanilla en `Gallery.astro`.

**Consecuencia:** Sin dependencias externas, control total de UX, ~200 líneas de JS.

### ADR-05: Tema claro/oscuro sin librerías

**Contexto:** Theme toggle necesario para accesibilidad y preferencia visual.

**Decisión:** Variables CSS + `data-theme` attribute + `localStorage` + inline script de prevención de flash.

**Consecuencia:** Sin dependencias, cero flicker en carga.

---

## 6. Stack tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| Framework | Astro | 6.4.2 | SSG, build estático |
| Lenguaje | TypeScript | strict | Tipado en config |
| Estilos | CSS (Custom Properties) | — | Design system completo |
| Iconos | Lucide Icons | CDN | Iconografía SVG |
| Fuentes | Google Fonts | — | Archivo, Inter, Space Grotesk |
| Despliegue | Vercel | — | Hosting + CDN |
| Dominio | Vercel subdomain | — | press-kit-nicol-s-capetillo.vercel.app |

## 7. Middleware y edge

No aplica. Sitio 100% estático sin middleware, SSR, edge functions, API routes, ni autenticación.

---

## Aprobación

- **Aprobado por:** [Humano]
- **Fecha:** [Por confirmar]
- **Firma:** [✓]

---
**Historial de cambios:**
- 2026-06-24: Documento creado con base en el proyecto existente
