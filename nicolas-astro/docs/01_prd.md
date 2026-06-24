# 01 — Product Requirements Document (PRD)

> Proyecto: Press Kit Digital — Nicols Capetillo
> Versión: 1.0.0
> Estado: **APROBADO**

---

## 1. Objetivo del producto

Crear un sitio web tipo press kit/portfolio para el actor Nicols Capetillo, desplegado como una sola página (SPA) con secciones modulares que permitan a directores de casting, productores y agentes conocer su perfil profesional, ver su trabajo audiovisual y descargar materiales de prensa.

---

## 2. Requerimientos funcionales

| ID | Descripción | Prioridad | Estado |
|----|-------------|-----------|--------|
| RF-01 | Hero section con nombre, título, foto principal y carrusel de fotos de fondo | Alta | Implementado |
| RF-02 | Sección de biografía con foto profesional, texto biográfico, datos rápidos y línea de tiempo | Alta | Implementado |
| RF-03 | Sección de filmografía con 3 proyectos (Netflix, ADR, YouTube) con backdrops interactivos | Alta | Implementado |
| RF-04 | Demo reel con video principal de YouTube embebido + 2 clips verticales | Alta | Implementado |
| RF-05 | Galería de fotos con preview grid (6 fotos) y lightbox fullscreen (35 fotos) con navegación por teclado/touch | Alta | Implementado |
| RF-06 | Ficha técnica con datos físicos, idiomas, habilidades en formato tarjetas | Alta | Implementado |
| RF-07 | Sección de contacto con datos directos (email, teléfono, Instagram) y representación (Mimi Carrillo Agency) | Alta | Implementado |
| RF-08 | Footer con créditos y enlace a MVGN Labs | Media | Implementado |
| RF-09 | Navegación superior fija con scroll spy + navegación inferior móvil con iconos | Alta | Implementado |
| RF-10 | Toggle de tema claro/oscuro con persistencia en localStorage | Media | Implementado |
| RF-11 | Barra de progreso de scroll | Baja | Implementado |
| RF-12 | Botones flotantes de scroll-to-top y acceso rápido a contacto | Baja | Implementado |
| RF-13 | Animaciones de entrada con Intersection Observer (scroll reveal) | Media | Implementado |
| RF-14 | Background animado con partículas fluidas responsivas al mouse/touch | Media | Implementado |

## 3. Requerimientos no funcionales

| ID | Descripción | Prioridad | Estado |
|----|-------------|-----------|--------|
| RNF-01 | Framework: Astro v6.4.2 | Alta | Implementado |
| RNF-02 | Despliegue: Vercel con dominio personalizado | Alta | Implementado |
| RNF-03 | Diseño responsivo: mobile (768px) + desktop | Alta | Implementado |
| RNF-04 | Tiempo de carga inicial < 3s en 4G | Alta | Implementado |
| RNF-05 | Sin dependencias de frameworks JS pesados (zero runtime JS libraries) | Alta | Implementado |
| RNF-06 | Glassmorphism como identidad visual principal | Media | Implementado |
| RNF-07 | Tipografía: Archivo, Inter, Space Grotesk desde Google Fonts | Media | Implementado |
| RNF-08 | Iconos: Lucide Icons vía CDN | Baja | Implementado |
| RNF-09 | Sin rastro de IDs, placeholders o contenido de relleno | Alta | Implementado |
| RNF-10 | SEO: meta tags, Open Graph, lang="es" | Media | Implementado |

## 4. Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | Astro v6.4.2 | SSG estático, cero JS runtime, ideal para sitios de contenido |
| Lenguaje | TypeScript strict | Tipado seguro, config de Astro predefinida |
| Estilos | CSS puro + variables CSS | Sin dependencias, control total del design system |
| Iconos | Lucide Icons CDN | Librería liviana de iconos SVG |
| Fuentes | Google Fonts (Archivo, Inter, Space Grotesk) | Cargadas vía @font-face en layout |
| Despliegue | Vercel | Build automático, CDN global, HTTPS |

## 5. Arquitectura de información

```
/ (Single Page Application)
├── #hero            → Hero + carrusel + CTAs
├── #biografia       → Bio + stats + timeline
├── #filmografia     → 3 film entries cinematográficos
├── #demo-reel       → YouTube embed + clips verticales
├── #galeria         → Grid preview + lightbox
├── #ficha-tecnica   → Ficha técnica + skills
├── #contacto        → Contacto + descargables
└── #footer          → Créditos
```

## 6. Data model

Centralizado en `src/data/nicolas.json` con las secciones:
- `personal` → nombre, bio, fotos
- `physical` → altura, peso, color ojos/pelo
- `languages` → 4 idiomas con nivel
- `skills` → artísticas y físicas
- `timeline` → 9 hitos cronológicos
- `filmography` → 3 proyectos
- `demoReel` → URLs de video
- `gallery` → 35 fotos con alt text
- `downloads` → ficha técnica + ZIP
- `contact` → email, teléfono, redes, manager

---

## Aprobación

- **Aprobado por:** [Humano]
- **Fecha:** [Por confirmar]
- **Firma:** [✓]

---
**Historial de cambios:**
- 2026-06-24: Documento creado con base en el proyecto existente
