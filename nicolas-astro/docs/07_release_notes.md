# 07 — Release Notes

> **Proyecto:** Press Kit Digital — Nicolás Capetillo
> **Versión:** v1.1.0
> **Release:** 2026-06-24

---

## Resumen

Sitio web tipo press kit/portfolio para el actor Nicolás Capetillo. Una sola página con secciones modulares que permiten a directores de casting, productores y agentes conocer su perfil profesional, ver su trabajo audiovisual y descargar materiales de prensa.

## Novedades en esta versión

### Features
- Sitio completo migrado a Astro (SSG estático, zero JS runtime)
- Hero con carrusel de fotos y glass card interactiva
- Biografía con línea de tiempo profesional (9 hitos)
- Filmografía con 3 proyectos (Netflix, ADR, YouTube)
- Demo reel con thumbnail + link directo a YouTube
- Galería con grid preview (6 fotos) + lightbox fullscreen (35 fotos) con navegación por teclado/touch
- Galería en carrusel horizontal con scroll snap en móvil (< 640px)
- Botones de navegación (prev/next) y dots indicadores para carrusel móvil
- Ficha técnica con datos físicos, idiomas y habilidades
- Tema claro/oscuro con persistencia en localStorage
- Background animado con fluid blobs responsivos
- Navegación responsive: top navbar en desktop, bottom nav + menú hamburguesa en móvil

### Mejoras técnicas
- Botones flotantes (scroll-to-top + mail) apilados correctamente sin superposición
- Posicionamiento mediante CSS calc() con custom property `--bottom-nav-h`
- Diseño responsivo en 375px, 480px, 768px, 1024px+
- Glassmorphism como identidad visual principal
- Animaciones scroll reveal con IntersectionObserver

### Bugs conocidos
- Ninguno

## Stack técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Astro | 6.4.2 |
| Lenguaje | TypeScript | strict |
| Estilos | CSS Custom Properties | — |
| Iconos | Lucide Icons | CDN |
| Fuentes | Google Fonts | Archivo, Inter, Space Grotesk |
| Despliegue | Vercel | — |

## Enlaces

- **Sitio en producción:** https://nicolascapetillo.vercel.app
- **Repositorio:** https://github.com/mvgn91/PRESS-KIT-NICOL-S-CAPETILLO
- **Documentación:** `docs/`
