# Contexto del Dominio

```
DOC-REF: CONTEXT/1.0
SIG: Domain Context — Blackboard
DIVISION: MVGN Labs — Research & Creative Systems Division
NODE: MX-03
STATE: ACTIVE
ΚΛΕΙΣ: CTXT-001
```

> Instrucciones generales para todo activo que opere en este dominio.
> Complementa a state.json (estado) y JOIN.md (misiones). No los duplica.

## Dominio

PRESS-KIT-NICOL-S-CAPETILLO: sitio press-kit / portfolio del actor Nicolás Capetillo.
Raíz: sitio legacy estático (index.html + script.js + styles.css, galería).
Subproyecto activo: `nicolas-astro/` (Astro 6.4 SSG, deploy Vercel en nicolascapetillo.vercel.app).
Legacy MVGN pre-5.x preservado en `nicolas-astro/.mvgn/` + `nicolas-astro/docs/00-11`. No migrar en silencio.

## Convenciones

- Stack: Astro 6.4, CSS Custom Properties + glassmorphism, Lucide CDN, Google Fonts.
- Comandos Astro: `npm install`, `npm run dev` (4321), `npm run build`, `npm run preview`. Deploy auto por push a main.
- No PowerShell (.ps1 solo referencia histórica). Linux.
- Código del proyecto en raíz y `nicolas-astro/src/`. Docs del proyecto en `docs/` (raíz, nuevo) y `nicolas-astro/docs/` (existente).

## Restricciones

- No modificar `nicolas-astro/.mvgn/` legacy sin autorización explícita.
- No eliminar archivos: usar `archive/` si aplica.
- Todo cambio se registra en `state.json → artifacts_generated` y `logs/execution.log`.
- Sin commit sin veredicto en modo COLLAB.
