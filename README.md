# PRESS-KIT-NICOL-S-CAPETILLO

Sitio web tipo press kit / portfolio para el actor mexicano **Nicolás Capetillo**, construido con [Astro](https://astro.build). Una sola página con secciones modulares para que directores de casting, productores y agentes conozcan su perfil profesional.

**Producción:** https://nicolascapetillo.vercel.app

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6.4 (SSG estático) |
| Estilos | CSS Custom Properties + glassmorphism |
| Iconos | Lucide Icons (CDN) |
| Fuentes | Google Fonts (Archivo, Inter, Space Grotesk) |
| Despliegue | Vercel (GitHub Integration) |

## Estructura

```
nicolas-astro/
├── src/
│   ├── components/     # 9 componentes Astro
│   ├── data/           # nicolas.json (todo el contenido)
│   ├── layouts/        # Layout.astro
│   ├── pages/          # index.astro (SPA)
│   └── styles/         # global.css (design system)
├── public/assets/      # Fotos (35) y videos (2)
├── docs/               # Documentación MVGN (00-11)
└── dist/               # Build output
```

## Comandos

| Comando | Acción |
|---------|--------|
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor local (`localhost:4321`) |
| `npm run build` | Build producción a `dist/` |
| `npm run preview` | Preview del build |

## Despliegue

Cada push a `main` dispara deploy automático en Vercel. Para deploy manual:

```bash
vercel deploy --prod --cwd nicolas-astro
```

## MVGN

Este proyecto sigue el sistema MVGN. Documentación completa en `docs/`:

| Doc | Contenido |
|-----|-----------|
| `00_idea.md` | Idea original |
| `01_prd.md` | Product Requirements Document |
| `02_architecture.md` | Arquitectura y ADRs |
| `03_tasks.md` | Desglose de tareas |
| `04_changelog.md` | Historial de cambios |
| `05_lessons_learned.md` | Lecciones aprendidas |
| `06_state_report.md` | Estado del proyecto |
| `07_release_notes.md` | Notas de release |
| `08_technical_summary.md` | Resumen técnico |
| `09_deployment_report.md` | Reporte de deploy |
| `10_maintenance_guide.md` | Guía de mantenimiento |
| `11_performance_report.md` | Reporte de rendimiento |

---

**Desarrollado por MVGN Labs**
