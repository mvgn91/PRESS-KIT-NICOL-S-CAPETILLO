# MVGN Session Contract — Runtime Behavior Agreement v2.1

> Define cómo debe comportarse cualquier IA una vez que el sistema MVGN se activa mediante el CLI.
> Sin este contrato cargado, el sistema NO está activo y la IA no debe ejecutar operaciones MVGN.

---

## 1. Activación del sistema

El sistema se considera activo **únicamente** cuando se cumplen todas estas condiciones:

- [ ] `mvgn start` o `mvgn resume` se ejecutó exitosamente
- [ ] Las 4 capas de `.mvgn/` están cargadas (system-rules, execution-engine, recovery-protocol, kernel-spec)
- [ ] `docs/06_state_report.md` fue leído y su estado es conocido
- [ ] El Kernel validó integridad (K-01 a K-06)
- [ ] Este contrato (session-contract.md) está cargado en la sesión actual

Si alguna condición falla → la IA opera en **modo no-MVGN** (estado inválido). No debe ejecutar operaciones del sistema.

---

## 2. Regla de comportamiento obligatorio

Una vez activo el sistema, la IA se rige por estas reglas en orden de prioridad:

| Prioridad | Fuente | Qué define |
|-----------|--------|-----------|
| 1 (máxima) | **session-contract.md** | Comportamiento de la IA en esta sesión |
| 2 | **kernel-spec.md** | Orquestación: qué capa está activa y quién arbitra |
| 3 | **recovery-protocol.md** | Reparación si hay corrupción o inconsistencia |
| 4 | **system-rules.md** | Qué es estructuralmente válido (gates, estados, roles) |
| 5 | **execution-engine.md** | Cómo ejecutar tareas (modos, loop, propagación) |

### 2.1 La IA debe

- Operar exclusivamente dentro de la capa activa determinada por el Kernel
- Usar system-rules como restricción absoluta (no se puede violar un gate)
- Validar el estado del proyecto antes de cada acción (`06_state_report.md`)
- Reportar al final de cada interacción usando el formato de la sección 6
- Si detecta una inconsistencia, activar recovery-protocol

### 2.2 La IA NO puede

- Saltarse PRD (G01)
- Saltarse arquitectura (G02)
- Ejecutar múltiples tareas simultáneas (una a la vez)
- Modificar documentos aprobados sin nueva aprobación humana
- Continuar si el Kernel declara estado `CORRUPTED`
- Ignorar `06_state_report.md` como fuente de verdad
- Decidir cambios de scope sin autorización humana

---

## 3. Flujo obligatorio de respuesta IA

Cada interacción debe seguir este orden. No se puede omitir ningún paso.

```
PASO 1 — LEER ESTADO
  Leer docs/06_state_report.md → estado actual, modo, tarea activa, bloqueos

PASO 2 — CONSULTAR KERNEL
  Determinar:
  - Estado del sistema (de 06_state_report.md)
  - Integridad (OK / DEGRADED / CORRUPTED)
  - Capa activa (rules / engine / recovery)

PASO 3 — DETERMINAR CAPA ACTIVA
  Según el resultado del Kernel:
  - RULES    → validación de gates o definiciones
  - ENGINE   → ejecución de tareas (FAST / DEBUG / FULL)
  - RECOVERY → reparación del sistema

PASO 4 — EJECUTAR ACCIÓN
  Actuar dentro de las reglas de la capa activa.
  No mezclar capas. No saltar entre capas sin que el Kernel lo autorice.

PASO 5 — ACTUALIZAR ESTADO
  Si la acción modificó el sistema:
  - Actualizar docs afectados (según propagación del modo actual)
  - Reflejar cambios en 06_state_report.md

PASO 6 — RESPONDER CON FORMATO
  Ver sección 6.
```

---

## 4. Integración con CLI

Este contrato se activa automáticamente cuando:

```
mvgn start     → bootstrap completo + carga de contrato
mvgn resume    → retoma sesión anterior + carga de contrato
```

El CLI (`mvgn.ps1`) inyecta este contrato en el contexto de la sesión de las siguientes maneras:

1. **Lo muestra en pantalla** como parte del output de `start` / `resume`
2. **Lo exporta a `.mvgn-context.json`** como campo `contract.loaded: true`
3. **Lo incluye como referencia** en el archivo `.mvgn-context.json` para que la IA lo cargue al inicio de la sesión

---

## 5. Estado del sistema como verdad única

La única fuente de verdad del sistema es:

```
docs/06_state_report.md
```

### 5.1 Resolución de conflictos

| Conflicto | Resolución |
|-----------|-----------|
| `06_state_report.md` vs cualquier otro doc | `06_state_report.md` tiene prioridad |
| `06_state_report.md` vs `kernel-spec.md` | Kernel decide |
| Corrupción detectada en `06_state_report.md` | Recovery-protocol se activa |
| Inconsistencia menor entre docs | System-rules valida, se corrige |

### 5.2 Regla de integridad

Si `06_state_report.md` no existe, no es legible, o declara un estado que no coincide con la evidencia documental → el sistema está en estado inválido. No se ejecuta ninguna operación hasta que recovery lo resuelva.

---

## 6. Formato obligatorio de respuesta IA

Al final de cada interacción, la IA debe responder con este bloque exacto:

```
MVGN SESSION STATE
────────────────────
STATE:         <INIT | PRD_REQUIRED | PRD_APPROVED | ARCHITECTURE_REQUIRED |
                ARCHITECTURE_APPROVED | READY_TO_BUILD | IN_PROGRESS | COMPLETED | BLOCKED>
MODE:          <FAST | DEBUG | FULL>
ACTIVE LAYER:  <rules | engine | recovery | finalization>
INTEGRITY:     <OK | DEGRADED | CORRUPTED>
────────────────────
LAST ACTION:   <qué se acaba de hacer>
NEXT ACTION:   <qué toca hacer ahora>
BLOCKERS:      <B-XX o "none">
────────────────────
CONTRACT:      <loaded | missing>
```

Ejemplo real:

```
MVGN SESSION STATE
────────────────────
STATE:         IN_PROGRESS
MODE:          FAST
ACTIVE LAYER:  engine
INTEGRITY:     OK
────────────────────
LAST ACTION:   Completed T-004 — Add user login endpoint
NEXT ACTION:   Execute T-005 — Add input validation
BLOCKERS:      none
────────────────────
CONTRACT:      loaded
```

---

## 7. Ciclo de vida del contrato

| Fase | Estado del contrato | Acción de la IA |
|------|--------------------|-----------------|
| Antes de `mvgn start` | No cargado | No opera en MVGN |
| Durante `mvgn start` | Cargándose | Esperar a que complete |
| Después de `mvgn start` exitoso | **ACTIVO** | Operar según las reglas de este documento |
| Durante `mvgn resume` | Reactivándose | Validar que sigue siendo válido |
| Después de bloqueo B-06 | Congelado | No ejecutar, activar recovery |
| Después de recovery exitoso | Reactivado | Reanudar operación normal |

---

## 8. Regla final

Si este contrato no está explícitamente cargado en la sesión actual, el sistema MVGN NO está activo. La IA no debe ejecutar operaciones MVGN (no debe crear docs, modificar state_report, ejecutar tareas, etc.) hasta que el contrato sea cargado mediante `mvgn start` o `mvgn resume`.
