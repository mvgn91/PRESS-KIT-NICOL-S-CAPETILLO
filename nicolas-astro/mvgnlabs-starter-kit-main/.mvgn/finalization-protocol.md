# MVGN Finalization Protocol — Completion & Release Layer v1.0

> Define el procedimiento formal para finalizar un proyecto o liberar una versión a producción.
> Se activa cuando todas las tareas están completadas, el build es exitoso y el humano autoriza el cierre.
> Sin este protocolo ejecutado, el estado `COMPLETED` no puede declararse.

---

## 0. Glosario

| Término | Definición |
|---------|-----------|
| **Finalización** | Proceso completo de cierre de un proyecto o versión. Incluye verificación, documentación, nomenclatura y sellado. |
| **Release** | Versión publicada a producción. Puede ocurrir múltiples veces (v1.0.0, v1.1.0, etc.). |
| **Sellado** | Acción de dejar el proyecto en un estado inmutable documentado, con respaldo y nomenclatura definitiva. |
| **Nomenclatura** | Sistema de nombrado estandarizado para proyectos, carpetas, artefactos y documentación. |
| **SLUG** | Identificador URL-safe del proyecto: minúsculas, guiones, sin espacios. |
| **TIER** | Nivel de despliegue: PRODUCTION, ARCHIVE, SANDBOX, LEGACY. |

---

## 1. Activación del protocolo

El Finalization Protocol se activa **obligatoriamente** cuando se cumplen **todas** estas condiciones:

| # | Condición | Cómo se verifica |
|---|-----------|------------------|
| F-01 | Todas las tareas en `03_tasks.md` están en estado `Completada` | Lectura de `03_tasks.md` |
| F-02 | Build del proyecto exitoso (`astro build`, `npm run build`, etc.) | Verificar carpeta `dist/` o `build/` existe |
| F-03 | No hay bloqueos activos (B-01 a B-08) | Cabecera de `06_state_report.md` |
| F-04 | Humano autoriza explícitamente la finalización | Instrucción humana: "Finalizar proyecto" o "Ejecutar Finalization Protocol" |

### 1.1 Disparadores

| Disparador | Origen | Descripción |
|------------|--------|-------------|
| Tareas completadas + solicitud humana | Humano | "Finaliza el proyecto" o "Completar" |
| Release de nueva versión | Humano | "Release vX.Y.Z" |
| Transición IN_PROGRESS → COMPLETED | Sistema | Automático si se cumplen F-01 a F-04 |

### 1.2 Efectos de la activación

- El sistema cambia a modo **FULL** (control completo, todas las validaciones activas)
- El Kernel despacha a la capa `finalization` como activa
- No se ejecutan nuevas tareas de código mientras el protocolo esté activo
- Todos los documentos existentes quedan en modo "lectura para sellado"

---

## 2. Fase 1 — VERIFY (Verificación de integridad pre-cierre)

Antes de generar documentación o renombrar nada, se verifica que el proyecto esté íntegro.

### 2.1 Checklist de verificación

- [ ] F-01: 100% de tareas completadas
- [ ] F-02: Build exitoso verificado
- [ ] F-03: Sin bloqueos activos
- [ ] F-04: Autorización humana recibida
- [ ] V-01: `01_prd.md` — todos los RF/RNF están cubiertos por tareas completadas
- [ ] V-02: `02_architecture.md` — todos los componentes están implementados
- [ ] V-03: `03_tasks.md` — sin tareas huérfanas (sin ref a PRD o arquitectura)
- [ ] V-04: `04_changelog.md` — actualizado hasta la última tarea
- [ ] V-05: `05_lessons_learned.md` — sin incidentes abiertos
- [ ] V-06: `06_state_report.md` — cabecera refleja estado real
- [ ] V-07: No hay archivos `TODO`, `TBD`, `<!-- -->` sin resolver en docs
- [ ] V-08: Consistencia entre estado declarado y evidencia documental (K-03)

### 2.2 Si la verificación falla

| Falla | Acción |
|-------|--------|
| V-01 a V-05 | Registrar en `05_lessons_learned.md`. Pausar finalización. Notificar al humano qué falta. |
| V-06 | Corregir `06_state_report.md` antes de continuar. |
| V-07 | Limpiar placeholders y TBDs. |
| V-08 | Activar Recovery Protocol si hay inconsistencia grave. |

Solo cuando todos los checks pasan se avanza a Fase 2.

### 2.3 Salida de Fase 1

```
Resultado VERIFY:
  ✅ V-01: PRD cubierto
  ✅ V-02: Arquitectura implementada
  ✅ ...
  Integridad pre-cierre: OK
  Documentos afectados: ninguno
```

---

## 3. Fase 2 — DOCUMENT (Generación de documentación definitiva)

Se genera la documentación de cierre del proyecto. Esta documentación es el "acta de entrega" técnica.

### 3.1 Documentos a generar

| Documento | Contenido | Destino |
|-----------|-----------|---------|
| `07_release_notes.md` | Notas de release: versión, fecha, cambios, features, bugs conocidos | `docs/` |
| `08_technical_summary.md` | Resumen técnico: stack, arquitectura, decisiones clave, ADRs finales | `docs/` |
| `09_deployment_report.md` | Reporte de deploy: URL, proveedor, configuración, checks, métricas | `docs/` |
| `10_maintenance_guide.md` | Guía de mantenimiento: cómo correr, buildear, desplegar, actualizar dependencias | `docs/` |
| `11_performance_report.md` | Hoja de rendimiento: tiempo estimado vs real, resultados, métricas, conclusiones para evaluación del sistema MVGN | `docs/` |

### 3.2 Formato obligatorio

Cada documento de cierre usa este frontmatter:

```markdown
# NN — Título

> **Proyecto:** {NOMBRE_PROYECTO}
> **Versión:** {SEMVER}
> **Generado:** {YYYY-MM-DD} por MVGN Finalization Protocol
> **Basado en:** docs/ — estado al momento de finalización

---
```

### 3.3 Plantillas

#### 07_release_notes.md

```markdown
# 07 — Release Notes

> **Proyecto:** {NOMBRE_PROYECTO}
> **Versión:** {SEMVER}
> **Release:** {YYYY-MM-DD}

## Resumen

{qué es este proyecto/producto en una línea}

## Novedades en esta versión

### Features
- {feature 1}
- {feature 2}

### Mejoras técnicas
- {mejora 1}
- {mejora 2}

### Bugs conocidos
- {bug 1}

## Stack técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | {framework} | {versión} |
| Lenguaje | {lenguaje} | {versión} |
| ... | ... | ... |

## Enlaces

- **Sitio en producción:** {URL}
- **Repositorio:** {URL}
- **Documentación:** {docs/}
```

#### 08_technical_summary.md

```markdown
# 08 — Technical Summary

> **Proyecto:** {NOMBRE_PROYECTO}
> **Versión:** {SEMVER}

## Arquitectura

{diagrama o descripción de la arquitectura final}

## Decisiones técnicas (ADRs)

| ADR | Decisión | Contexto |
|-----|----------|---------|
| ADR-01 | {decisión} | {contexto} |

## Estructura del proyecto

{árbol de directorios relevante}

## Dependencias principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| {pkg} | {ver} | {propósito} |
```

#### 10_maintenance_guide.md

```markdown
# 10 — Maintenance Guide

> **Proyecto:** {NOMBRE_PROYECTO}
> **Versión:** {SEMVER}

## Requisitos

- Node.js {versión mínima}
- npm / pnpm / yarn

## Comandos

| Acción | Comando |
|--------|---------|
| Development | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |

## Actualizar dependencias

{procedimiento}

## Desplegar

{procedimiento de deploy}
```

#### 11_performance_report.md

```markdown
# 11 — Performance Report

> **Proyecto:** {NOMBRE_PROYECTO}
> **Versión:** {SEMVER}
> **Generado:** {YYYY-MM-DD} por MVGN Finalization Protocol
> **Propósito:** Evaluación de rendimiento del ciclo de desarrollo para retroalimentación del sistema MVGN

## 1. Métricas del proyecto

| Métrica | Valor |
|---------|-------|
| **Nombre** | {NOMBRE_PROYECTO} |
| **Versión** | {SEMVER} |
| **Total tareas** | {N} |
| **Tareas completadas** | {N} |
| **Tareas fallidas / rehechas** | {N} |
| **Tiempo estimado total** | {HH:MM} |
| **Tiempo real total** | {HH:MM} |
| **Diferencia** | {+/- HH:MM} ({+/- X%}) |

## 2. Desglose por tarea

| Tarea | Tiempo estimado | Tiempo real | Diferencia | Observaciones |
|-------|----------------|-------------|------------|---------------|
| T-000 | {HH:MM} | {HH:MM} | {+/- HH:MM} | {obs} |
| ... | ... | ... | ... | ... |

## 3. Resultados

### 3.1 Calidad de ejecución

| Aspecto | Resultado | Evidencia |
|---------|-----------|-----------|
| Build exitoso | ✅ / ❌ | {output} |
| Deploy exitoso | ✅ / ❌ | {URL} |
| Errores de compilación | {N} | — |
| Warnings críticos | {N} | — |
| Cobertura de requisitos | {N} / {N} RF cubiertos | c/`01_prd.md` |

### 3.2 Estabilidad del proceso MVGN

| Indicador | Estado | Notas |
|-----------|--------|-------|
| Bloqueos durante el ciclo | {N} (B-XX) | {causas} |
| Recovery activado | Sí / No | {veces} |
| Gates violados | {N} | {cuáles} |
| Cambios de scope | {N} | {descripción} |
| Documentación desactualizada | Sí / No | {frecuencia} |

## 4. Rendimiento del sistema MVGN

| Componente | Evaluación | Problemas encontrados |
|------------|-----------|----------------------|
| Session Contract | {1-5} | {observaciones} |
| Kernel | {1-5} | {observaciones} |
| Recovery Protocol | {1-5} | {observaciones} |
| Finalization Protocol | {1-5} | {observaciones} |
| System Rules | {1-5} | {observaciones} |
| Execution Engine | {1-5} | {observaciones} |

## 5. Conclusiones

### 5.1 Qué funcionó bien
- {aspecto 1}
- {aspecto 2}

### 5.2 Qué no funcionó
- {aspecto 1}
- {aspecto 2}

### 5.3 Recomendaciones para MVGN
- {recomendación 1}
- {recomendación 2}

### 5.4 Veredicto final

> **Eficiencia del ciclo:** {ALTA / MEDIA / BAJA}
> **Precisión de estimación:** {ALTA / MEDIA / BAJA}
> **Calidad del resultado:** {ALTA / MEDIA / BAJA}
> **Madurez del proceso MVGN:** {ALTA / MEDIA / BAJA / ITERATIVA}
```

---

## 4. Fase 3 — NOMENCLATE (Aplicación de nomenclatura definitiva)

Se aplica el sistema de nomenclatura estandarizado al proyecto, sus carpetas y artefactos.

### 4.1 Sistema de Nomenclatura MVGN (NOM)

| Código | Elemento | Formato | Ejemplo |
|--------|----------|---------|---------|
| NOM-001 | **Directorio raíz del proyecto** | `{SLUG}_v{SEMVER}_{TIER}` | `scientific-glass-portfolio_v1.0.0_PRODUCTION` |
| NOM-002 | **Release tag** | `v{SEMVER}-{YYYYMMDD}` | `v1.0.0-20260622` |
| NOM-003 | **Documentación de cierre** | `{SLUG}_docs_v{SEMVER}.pdf` | `scientific-glass-portfolio_docs_v1.0.0.pdf` |
| NOM-004 | **Build / dist** | `{SLUG}-build_v{SEMVER}.zip` | `scientific-glass-portfolio-build_v1.0.0.zip` |
| NOM-005 | **Repo / remote** | `{SLUG}` | `scientific-glass-portfolio` |
| NOM-006 | ** Rama principal** | `main` | — |

### 4.2 Reglas de nomenclatura

| Regla | Descripción |
|-------|-------------|
| **R-NOM-01** | El SLUG se deriva del nombre oficial del proyecto en `00_idea.md`: minúsculas, espacios → guiones, sin caracteres especiales. |
| **R-NOM-02** | SEMVER sigue el formato `MAJOR.MINOR.PATCH` según especificación semver.org. |
| **R-NOM-03** | TIER se determina según el estado del despliegue: |
| | `PRODUCTION` — sitio en producción público |
| | `ARCHIVE` — proyecto cerrado, ya no activo |
| | `SANDBOX` — experimental, demo o pruebas |
| | `LEGACY` — versión anterior reemplazada |
| **R-NOM-04** | Una vez asignado el nombre definitivo, el SLUG no cambia. Cualquier rename posterior se documenta en `04_changelog.md`. |
| **R-NOM-05** | Los tags de release se aplican al VCS (git tag) cuando existe. Si no hay VCS, se registran en `07_release_notes.md`. |

### 4.3 Procedimiento de renombrado de carpeta raíz

1. Determinar SLUG del proyecto basado en `docs/00_idea.md`
2. Determinar SEMVER basado en `04_changelog.md` (última versión)
3. Determinar TIER basado en estado del deploy
4. Construir nombre: `{SLUG}_v{SEMVER}_{TIER}`
5. Presentar al humano el nombre propuesto:
   ```
   Nombre actual:     SCIENTIFIC GLASS VERSION
   Nombre definitivo: scientific-glass-portfolio_v1.0.0_PRODUCTION
   ```
6. Humano confirma o modifica
7. IA ejecuta el renombrado (fuera del contexto actual)

### 4.4 Nomenclatura de documentación

Los documentos de cierre (07-10) usan el nombre definitivo del proyecto y SEMVER.

Adicionalmente, se genera un índice de documentación:

```markdown
# Documentación — {NOMBRE_PROYECTO} v{SEMVER}

## Documentos del sistema
- `00_idea.md` — Idea original
- `01_prd.md` — Product Requirements Document
- `02_architecture.md` — Arquitectura y ADRs
- `03_tasks.md` — Desglose de tareas
- `04_changelog.md` — Historial de cambios
- `05_lessons_learned.md` — Lecciones aprendidas
- `06_state_report.md` — Estado del proyecto

## Documentos de cierre (Finalization Protocol)
- `07_release_notes.md` — Notas de release
- `08_technical_summary.md` — Resumen técnico
- `09_deployment_report.md` — Reporte de deploy
- `10_maintenance_guide.md` — Guía de mantenimiento
- `11_performance_report.md` — Hoja de rendimiento y evaluación del ciclo MVGN
```

---

## 5. Fase 4 — SEAL (Sellado y respaldo)

Se deja el proyecto en un estado inmutable y documentado.

### 5.1 Acciones de sellado

| # | Acción | Descripción |
|---|--------|-------------|
| S-01 | Backup de documentación | Copia de `docs/` completa en un archivo `{SLUG}_docs_v{SEMVER}.zip` |
| S-02 | Backup de configuración | Copia de `.mvgn/`, `prompts/`, `vercel.json`, `astro.config.mjs` |
| S-03 | Build final verificado | Ejecutar `npm run build` y verificar que no hay errores |
| S-04 | Snapshot final | Registrar el estado final de todos los archivos clave en `06_state_report.md` |
| S-05 | Sugar commit (opcional) | Si hay repo git: `git add . && git commit -m "release: v{SEMVER}"` y tag `v{SEMVER}-{YYYYMMDD}` |

### 5.2 Snapshot de sellado

Se escribe en `06_state_report.md`:

```markdown
## Snapshot de sellado — {YYYY-MM-DD}

| Componente | Estado |
|------------|--------|
| `docs/` | ✅ Documentación completa y generada |
| `src/` | ✅ Código fuente build exitoso |
| `dist/` | ✅ Build de producción verificado |
| `Deploy` | ✅ Activo en producción |
| `.mvgn/` | ✅ Estado del sistema preservado |
| **Proyecto sellado como:** | `{SLUG}_v{SEMVER}_{TIER}` |
```

### 5.3 Nota de sellado en `04_changelog.md`

Se añade la entrada final:

```markdown
## [{SEMVER}] — {YYYY-MM-DD}

### Proyecto sellado

- Finalization Protocol ejecutado
- Documentación de cierre generada (07-11)
- Proyecto renombrado a: `{SLUG}_v{SEMVER}_{TIER}`
- Estado: COMPLETED
```

---

## 6. Fase 5 — RELEASE (Transición a COMPLETED)

### 6.1 Últimas acciones

1. Cambiar estado en `06_state_report.md` de `IN_PROGRESS` a `COMPLETED`
2. Actualizar `.mvgn-context.json` con estado `COMPLETED`
3. Marcar `finalization: "completed"` en el contexto
4. Registrar en `05_lessons_learned.md` la finalización del proyecto

### 6.2 Formato de cierre

```markdown
## Finalización: {YYYY-MM-DD}

**Proyecto:** {NOMBRE_PROYECTO}
**Versión final:** {SEMVER}
**Nombre definitivo:** {SLUG}_v{SEMVER}_{TIER}
**URL producción:** {URL}
**Protocolo ejecutado:** Finalization Protocol v1.0
**Fases completadas:** VERIFY → DOCUMENT → NOMENCLATE → SEAL → RELEASE
**Documentos generados:**
  - 07_release_notes.md
  - 08_technical_summary.md
  - 09_deployment_report.md
  - 10_maintenance_guide.md
  - 11_performance_report.md
```

### 6.3 Mensaje de finalización

La IA presenta al humano:

```
╔══════════════════════════════════════════════════╗
║        MVGN FINALIZATION COMPLETE               ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Proyecto: {NOMBRE_PROYECTO}                    ║
║  Versión:  {SEMVER}                              ║
║  Nombre:   {SLUG}_v{SEMVER}_{TIER}              ║
║  Estado:   ✅ COMPLETED                          ║
║                                                  ║
║  Documentación generada:                         ║
║    ✅ 07_release_notes.md                        ║
║    ✅ 08_technical_summary.md                    ║
║    ✅ 09_deployment_report.md                    ║
║    ✅ 10_maintenance_guide.md                    ║
║    ✅ 11_performance_report.md                   ║
║                                                  ║
║  Sellado:   ✅ Backup completado                 ║
║  Deploy:    ✅ {URL}                             ║
║                                                  ║
║  El proyecto queda oficialmente COMPLETED.       ║
║  Para reabrir: el humano debe crear nuevo batch  ║
║  de tareas y autorizar transición a IN_PROGRESS. ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

---

## 7. Reapertura de proyecto completado

Si un proyecto en estado `COMPLETED` necesita modificaciones:

### 7.1 Proceso de reapertura

1. Humano autoriza: "Reabrir proyecto"
2. Se añaden nuevas tareas en `03_tasks.md` (T-020+)
3. Se actualiza `06_state_report.md`: estado `IN_PROGRESS`, nuevo progreso
4. Se añade entrada en `04_changelog.md`: "Proyecto reabierto — {motivo}"
5. La documentación de cierre (07-10) se actualiza al completar el nuevo batch

### 7.2 Reglas de reapertura

- No se regenera documentación de cierre previa — se añade una nueva versión
- El nombre definitivo del proyecto (SLUG) no cambia
- La versión SEMVER avanza según el alcance del cambio

---

## 8. Integración con otras capas

| Capa | Relación con Finalization Protocol |
|------|-----------------------------------|
| **session-contract** | El contrato debe incluir `finalization` como capa activa posible y el formato de respuesta debe reflejar el estado de finalización. |
| **kernel-spec** | El Kernel debe reconocer `finalization` como capa despachable cuando se cumplen condiciones de finalización. |
| **recovery-protocol** | Si durante VERIFY se detecta corrupción (V-08), Recovery tiene prioridad. Finalization se pausa hasta que Recovery complete. |
| **system-rules** | La transición `IN_PROGRESS → COMPLETED` requiere que Finalization Protocol se haya ejecutado completamente. |
| **execution-engine** | Durante Finalization, no se ejecutan tareas de código. El engine queda en pausa. |
| **authority-map** | Finalization Protocol tiene prioridad P4 (entre recovery y rules). |

### 8.1 Prioridad en autoridad

| Prioridad | Capa |
|-----------|------|
| P1 | session-contract |
| P2 | kernel-spec |
| P3 | recovery-protocol |
| **P4** | **finalization-protocol** |
| P5 | system-rules |
| P6 | execution-engine |

### 8.2 Resolución de conflictos

| Conflicto | Resolución |
|-----------|-----------|
| Finalization vs Recovery | Recovery gana (P3 > P4). Corrupción sobre cierre. |
| Finalization vs Rules | Finalization gana (P4 > P5). Durante finalización, el protocolo puede renombrar y reestructurar. |
| Finalization vs Engine | Finalization gana (P4 > P6). Engine se pausa durante finalización. |
| Human vs Finalization | Humano gana siempre. |

---

## 9. Casos borde

### 9.1 Proyecto sin deploy

Si el proyecto no se despliega (ej: librería, CLI tool), la Fase 3 (NOMENCLATE) asigna TIER como `ARCHIVE`. No se genera `09_deployment_report.md`.

### 9.2 Proyecto con múltiples releases

Para releases subsiguientes (v1.1.0, v2.0.0), el protocolo se ejecuta de forma ligera:
- VERIFY: solo tareas del nuevo batch
- DOCUMENT: actualizar `07_release_notes.md` + `08_technical_summary.md`
- NOMENCLATE: actualizar SEMVER, no cambiar SLUG
- SEAL: nuevo tag + backup incremental
- RELEASE: mantener estado `COMPLETED` o pasar a `IN_PROGRESS` si hay más batches

### 9.3 Finalización cancelada

Si el humano cancela la finalización durante cualquier fase:
1. Detener protocolo inmediatamente
2. Restaurar estado anterior en `06_state_report.md`
3. No se eliminan documentos parcialmente generados (quedan como borrador)
4. Registrar en `05_lessons_learned.md`: "Finalización cancelada — {motivo}"

### 9.4 Renombrado sin VCS

Si no hay git, el renombrado de carpeta raíz se propone al humano como acción manual o se ejecuta mediante script. El nombre definitivo se documenta en `07_release_notes.md` y `06_state_report.md`.

---

## 10. Regla final

El Finalization Protocol es **obligatorio** para declarar un proyecto como `COMPLETED`. Sin su ejecución completa (VERIFY → DOCUMENT → NOMENCLATE → SEAL → RELEASE), el sistema no puede transicionar a `COMPLETED`. Si se intenta la transición sin ejecutar el protocolo, el Kernel debe bloquearla y notificar al humano.
