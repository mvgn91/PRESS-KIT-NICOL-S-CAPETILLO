# MVGN System Rules — Policy Layer v2.1

> Define estados, transiciones, compuertas y roles del sistema. Estático. No contiene lógica de ejecución ni recuperación.

---

## 0. Glosario

| Término | Definición |
|---------|-----------|
| **Humano** | Desarrollador responsable. Único con autoridad para aprobar. |
| **IA** | Asistente/agente. Propone, estructura, ejecuta. No decide. |
| **Aprobación** | Firma explícita (nombre + fecha + [✓]) en el documento. |
| **Gate** | Condición obligatoria que debe cumplirse antes de avanzar. |
| **Bloqueo** | Estado del sistema que impide transiciones hasta resolverse. |

---

## 1. Roles

| Rol | Actor | Qué hace | Qué NO hace |
|-----|-------|----------|-------------|
| **Decisor** | Humano | Aprueba PRD, arquitectura, scope, cambios críticos. Decide cuándo iniciar/detener. | No ejecuta tareas técnicas. |
| **Ejecutor** | IA | Propone, redacta borradores, escribe código, ejecuta tareas, actualiza docs. | No aprueba nada. No decide arquitectura final. No modifica scope. |
| **Consistente** | IA | Garantiza sincronía documental. Refleja cada cambio en `06_state_report.md`. | No altera contenido aprobado sin autorización humana. |

---

## 2. State Machine del proyecto

El proyecto está **siempre** en exactamente un estado. Reflejado en `06_state_report.md`.

```
INIT → PRD_REQUIRED → PRD_APPROVED → ARCHITECTURE_REQUIRED
       → ARCHITECTURE_APPROVED → READY_TO_BUILD → IN_PROGRESS → COMPLETED
       ↑                                                        ↓
       └──────────────────── BLOCKED ◄──────────────────────────┘
```

| Estado | Significado | Doc mínimo |
|--------|-------------|-----------|
| `INIT` | Idea en bruto. | `00_idea.md` |
| `PRD_REQUIRED` | Se debe crear y aprobar PRD. | `01_prd.md` (borrador) |
| `PRD_APPROVED` | PRD firmado. | `01_prd.md` + firma |
| `ARCHITECTURE_REQUIRED` | Se debe crear y aprobar arquitectura. | `02_architecture.md` (borrador) |
| `ARCHITECTURE_APPROVED` | Arquitectura firmada. | `02_architecture.md` + firma |
| `READY_TO_BUILD` | Tasks listas, alineadas, verificadas. | `03_tasks.md` completo |
| `IN_PROGRESS` | Ejecutando tareas. | Todos los docs vigentes |
| `COMPLETED` | Todas las tareas cumplen criterios. | Todos los docs actualizados |
| `BLOCKED` | Meta-estado. Avance impedido. | `06_state_report.md` refleja bloqueo |

### 2.1 Transiciones

| Desde | Hacia | Condición | Autoriza |
|-------|-------|-----------|----------|
| `INIT` | `PRD_REQUIRED` | `00_idea.md` completada | Humano |
| `PRD_REQUIRED` | `PRD_APPROVED` | `01_prd.md` completo + firma humana | Humano |
| `PRD_APPROVED` | `ARCHITECTURE_REQUIRED` | PRD firmado | Humano |
| `ARCHITECTURE_REQUIRED` | `ARCHITECTURE_APPROVED` | `02_architecture.md` completo + ADRs + firma | Humano |
| `ARCHITECTURE_APPROVED` | `READY_TO_BUILD` | `03_tasks.md` verificado contra PRD + arquitectura | Humano |
| `READY_TO_BUILD` | `IN_PROGRESS` | Humano autoriza T-001 | Humano |
| `IN_PROGRESS` | `IN_PROGRESS` | Tarea completada, siguiente lista | IA o Humano (según modo de ejecución) |
| `IN_PROGRESS` | `COMPLETED` | Todas las tareas verificadas + Finalization Protocol ejecutado (VERIFY → DOCUMENT → NOMENCLATE → SEAL → RELEASE) | Humano |
| Cualquiera | `BLOCKED` | Condición de bloqueo detectada | IA detecta, humano confirma |
| `BLOCKED` | ← | Humano resuelve + autoriza reanudación | Humano |
| `COMPLETED` | `IN_PROGRESS` | Nuevo lote de tareas definido | Humano |

### 2.2 Regla de estado único

No hay dos estados activos simultáneamente.

---

## 3. Gating system

| Gate | Descripción | Verificación |
|------|-------------|--------------|
| G01 — PRD | No código sin PRD aprobado | `01_prd.md` con firma humana + fecha |
| G02 — Architecture | No código sin arquitectura aprobada | `02_architecture.md` con firma humana + fecha |
| G03 — Tasks | No ejecución sin tarea definida | Tarea tiene criterios de aceptación + refs a PRD/arquitectura |
| G04 — State | No acción sin state_report actualizado | State report refleja estado actual |
| G05 — Scope | No cambios fuera de alcance | Código alineado con PRD + arquitectura |
| G06 — Finalization | No COMPLETED sin Finalization Protocol ejecutado | `.mvgn/finalization-protocol.md` completó VERIFY → DOCUMENT → NOMENCLATE → SEAL → RELEASE |
| G07 — Release | No renombrar carpetas sin autorización humana | Humano confirma nombre definitivo del proyecto |

### 3.1 Violación de gate

Si un gate es violado: detener ejecución → registrar en `05_lessons_learned.md` → mover a `BLOCKED` → notificar humano con la acción específica. Las consecuencias operativas de cada infracción se listan en la sección 8.

---

## 4. Definición de "aprobado"

### 4.1 PRD aprobado

- [ ] Secciones sin placeholders `<!-- -->`
- [ ] RFs y RNFs numerados y priorizados
- [ ] Firma humana: nombre + fecha + [✓]
- [ ] Sin `TODO`, `?`, `TBD`

### 4.2 Arquitectura aprobada

- [ ] Componentes con responsabilidad y dependencias definidas
- [ ] ADRs documentados con contexto y consecuencia
- [ ] Stack tecnológico definido con justificación por capa
- [ ] Firma humana: nombre + fecha + [✓]
- [ ] Sin `TODO`, `?`, `TBD`

### 4.3 Task lista para ejecución

- [ ] ID único `T-XXX` + criterios de aceptación verificables + ref a RF/RNF
- [ ] Prioridad asignada + archivos afectados listados
- [ ] Dependencias cumplidas
- [ ] Estado del proyecto permite ejecución (`READY_TO_BUILD` o `IN_PROGRESS`)

---

## 5. Sistema de bloqueo

### 5.1 Condiciones de bloqueo

| Código | Condición | Severidad |
|--------|-----------|-----------|
| B-01 | PRD incompleto al hacer arquitectura | Crítica |
| B-02 | Arquitectura incompleta al crear tasks | Crítica |
| B-03 | Task sin criterios de aceptación al ejecutar | Crítica |
| B-04 | Task sin ref a PRD/arquitectura al ejecutar | Alta |
| B-05 | State report no coincide con estado real del proyecto | Alta |
| B-06 | Inconsistencia documental (docs contradictorios) | Alta |
| B-07 | Scope creep detectado | Crítica |
| B-08 | Humano solicita bloqueo explícitamente | Media |

### 5.2 Comportamiento en BLOCKED

- Toda ejecución de código se detiene
- No se modifican documentos (salvo `05_lessons_learned.md` y `06_state_report.md`)
- IA documenta la causa del bloqueo en `06_state_report.md`
- IA espera instrucciones del humano
- Solo el humano puede desbloquear

### 5.3 Desbloqueo

1. Humano corrige la causa raíz o da instrucciones explícitas
2. Humano confirma "Reanudar" o "Desbloquear"
3. IA actualiza `06_state_report.md` eliminando el bloqueo
4. Sistema vuelve al estado anterior

---

## 6. Consistencia documental

### 6.1 Reglas de sincronización

| C01 | Reflectividad inmediata | Todo cambio se refleja en `06_state_report.md` antes de cerrar la acción |
| C02 | Versión única | Cada concepto (RF, ADR, término) tiene exactamente una definición. Si cambia, cambia en todos los docs. |
| C03 | Traza bidireccional | Tarea ↔ RF/RNF. ADR ↔ componentes. Verificable siempre. |
| C04 | Congelación post-aprobación | Documento aprobado no se modifica sin nueva firma humana. |

### 6.2 Matriz de impacto documental

| Documento modificado | Afecta a | Acción requerida |
|---------------------|----------|------------------|
| `00_idea.md` | `01_prd.md` | Revisar que PRD sigue alineado |
| `01_prd.md` | `02_architecture.md`, `03_tasks.md`, `04_changelog.md`, `06_state_report.md` | Actualizar referencias RF/RNF, verificar cobertura en tasks |
| `02_architecture.md` | `03_tasks.md`, `04_changelog.md`, `06_state_report.md` | Actualizar referencias ADR, verificar tasks contra componentes |
| `03_tasks.md` | `06_state_report.md`, `04_changelog.md` | Actualizar conteo de tareas, registrar cambios |
| `04_changelog.md` | `06_state_report.md` | Reflejar última entrada |
| `05_lessons_learned.md` | `06_state_report.md` | Actualizar riesgos activos si aplica |
| `06_state_report.md` | Ninguno | Es el reflejo del sistema |

### 6.3 Inconsistencia

Si dos documentos contradicen el mismo hecho → Bloquear (B-06). Humano resuelve cuál es correcto.

---

## 7. State report estructurado (formato)

Formato obligatorio de `docs/06_state_report.md`:

```markdown
# 06 — State Report

> Modo: FAST | DEBUG | FULL

## Cabecera

| Campo | Valor |
|-------|-------|
| **Estado** | [estado actual del sistema] |
| **Tarea activa** | T-XXX o — |
| **Progreso** | N / M completadas |
| **Última acción** | Qué se hizo |
| **Siguiente acción** | Qué toca hacer |
| **Modo** | FAST / DEBUG / FULL |
| **Bloqueos activos** | B-XX o — |

## Riesgos activos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| — | — | — |

## Notas

—
```

Cada actualización reemplaza la cabecera completa. No se acumulan versiones.

---

## 8. Infracciones y consecuencias

| Código | Infracción | Detección | Consecuencia |
|--------|-----------|-----------|-------------|
| I-G01 | Código sin PRD aprobado | IA en code review | Revertir + Bloquear (B-01) + lessons |
| I-G02 | Código sin arquitectura aprobada | IA en code review | Revertir + Bloquear (B-02) + lessons |
| I-G03 | Tarea no atómica | IA detecta cambios múltiples | Dividir en `03_tasks.md` |
| I-G04 | Saltar una fase | IA detecta estado inconsistente | Mover atrás + Bloquear + notificar |
| I-G05 | Scope creep | IA detecta funcionalidad extra | Revertir extra + nueva tarea |
| I-C01 | Documentación desactualizada | IA en validación pre-ejecución | Actualizar + lessons |
| I-C03 | Trazabilidad rota | IA detecta task sin ref a RF | Bloquear (B-04) + corregir |
| I-S01 | IA decide sin autorización | IA detecta decisión sin humano | Bloquear (B-08) + lessons + esperar |

Toda infracción se registra en `05_lessons_learned.md`:

```
## I-XXX — <fecha>
**Qué:** <ocurrencia>
**Causa:** <por qué>
**Acción:** <qué se hizo>
**Prevención:** <cómo evitarlo>
```

---

## 9. Convenciones

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Tareas | `T-XXX` | `T-001` |
| Req. funcionales | `RF-XX` | `RF-01` |
| Req. no funcionales | `RNF-XX` | `RNF-01` |
| Decisiones arq. | `ADR-XX` | `ADR-01` |
| Versiones | SemVer | `v1.0.0` |
| Infracciones | `I-XXXX` | `I-G01` |
| Bloqueos | `B-XX` | `B-03` |

```
docs/
├── 00_idea.md           ← Captura inicial
├── 01_prd.md            ← Contrato funcional (gate G01)
├── 02_architecture.md   ← Contrato técnico (gate G02)
├── 03_tasks.md          ← Desglose ejecutable (gate G03)
├── 04_changelog.md      ← Registro de cambios
├── 05_lessons_learned.md← Incidentes y aprendizaje
├── 06_state_report.md   ← Estado del sistema (gate G04)
├── 07_release_notes.md  ← Notas de release (generado por Finalization Protocol)
├── 08_technical_summary.md ← Resumen técnico (generado por Finalization Protocol)
├── 09_deployment_report.md ← Reporte de deploy (generado por Finalization Protocol)
├── 10_maintenance_guide.md ← Guía de mantenimiento (generado por Finalization Protocol)
└── 11_performance_report.md ← Hoja de rendimiento (generado por Finalization Protocol)
```

**Reglas de edición:**
- Sin `<!-- -->`, `TODO`, `TBD`, `?` en docs aprobados. Válidos solo en borradores.
- Todo cambio en doc aprobado requiere nueva firma humana.
- La sección "Historial de cambios" de cada documento se actualiza con cada modificación.

---

## 10. Prompt maestro

Cada sesión con un asistente IA debe cargar primero `prompts/master-prompt.md`. Si no existe, la IA informa al humano y no inicia acciones.

---

## 11. Regla final

Si hay conflicto entre instrucción humana y estas reglas, la instrucción humana tiene prioridad. La decisión se registra en `05_lessons_learned.md` con justificación.
