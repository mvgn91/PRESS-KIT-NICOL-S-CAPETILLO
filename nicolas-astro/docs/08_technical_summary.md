# 08 — Technical Summary

> **Proyecto:** Press Kit Digital — Nicolás Capetillo
> **Versión:** v1.1.0

---

## Arquitectura

Sitio web estático de una sola página generado con Astro SSG. Sin framework JS del lado del cliente — todo el JavaScript es scripting vanilla inline para interactividad. Despliegue en Vercel con CDN global.

```
[Browser] ← HTTP/2 → [Vercel CDN] → [Static Files (dist/)]
```

## Decisiones técnicas (ADRs)

| ADR | Decisión | Contexto |
|-----|----------|---------|
| ADR-01 | Astro sin framework JS cliente | Sitio informativo, no necesita reactividad compleja |
| ADR-02 | CSS puro sin preprocesador | Design system manejable en un solo archivo |
| ADR-03 | Datos centralizados en JSON estático | Contenido del press kit relativamente estático |
| ADR-04 | Lightbox casero sin librería | Control total de UX, ~200 líneas de JS |
| ADR-05 | Tema claro/oscuro sin librerías | Variables CSS + data-theme + localStorage |

## Estructura del proyecto

```
nicolas-astro/
├── src/
│   ├── components/
│   │   ├── Biography.astro
│   │   ├── DemoReel.astro
│   │   ├── Downloads.astro
│   │   ├── Filmography.astro
│   │   ├── FluidBackground.astro
│   │   ├── Footer.astro
│   │   ├── Gallery.astro
│   │   ├── Hero.astro
│   │   └── Navigation.astro
│   ├── data/
│   │   └── nicolas.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── public/
│   └── assets/
│       ├── fotos/ (35 imágenes)
│       ├── fotos hero section/ (9 imágenes)
│       └── videos/ (2 clips)
├── docs/ (MVGN documentation)
└── dist/ (build output)
```

## Dependencias principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| astro | ^6.4.2 | Static Site Generator |
| @astrojs/check | ^0.9.4 | Type checking |
| typescript | ^5.7.3 | Lenguaje tipado |
| sharp | ^0.33.3 | Optimización de imágenes (build) |
