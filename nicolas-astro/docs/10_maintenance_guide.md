# 10 — Maintenance Guide

> **Proyecto:** Press Kit Digital — Nicolás Capetillo
> **Versión:** v1.1.0

---

## Requisitos

- Node.js >= 22.12.0
- npm (incluido con Node.js)

## Comandos

| Acción | Comando |
|--------|---------|
| Development | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Verificar tipos | `npx astro check` |

## Estructura de datos

Todo el contenido del sitio se encuentra en `src/data/nicolas.json`:

| Sección | Contenido |
|---------|-----------|
| `personal` | Nombre, bio, fotos |
| `physical` | Altura, peso, color ojos/pelo |
| `languages` | 4 idiomas con nivel |
| `skills` | Habilidades artísticas y físicas |
| `timeline` | 9 hitos cronológicos |
| `filmography` | 3 proyectos |
| `demoReel` | URLs de video |
| `gallery` | 35 fotos con alt text |
| `downloads` | Ficha técnica + ZIP |
| `contact` | Email, teléfono, redes, manager |

## Actualizar contenido

1. Editar `src/data/nicolas.json`
2. Ejecutar `npm run build` para verificar
3. Commit y push a GitHub (Vercel despliega automáticamente)

## Agregar fotos a la galería

1. Colocar archivos en `public/assets/fotos/`
2. Agregar entrada en `gallery[]` en `nicolas.json` con `src` y `alt`
3. Reconstruir y desplegar

## Desplegar

El despliegue es automático vía integración GitHub + Vercel. Cada push a `main` dispara un build y deploy.

Para desplegar manualmente desde CLI:
```bash
vercel deploy --prod --cwd nicolas-astro
```
