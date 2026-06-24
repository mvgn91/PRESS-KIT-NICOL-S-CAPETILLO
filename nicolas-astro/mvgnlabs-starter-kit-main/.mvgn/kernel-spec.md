# MVGN Kernel Specification — Orchestrator Layer v2.1

> Único punto lógico de arbitraje del sistema. Orquesta system-rules, execution-engine y recovery-protocol.
> No ejecuta tareas. No define reglas. No implementa runtime. Solo decide flujo y prioridad.

---

## 0. Glosario

| Término | Definición |
|---------|-----------|
| **Arbitraje** | Decisión sobre qué capa tiene prioridad en un conflicto. |
| **Integridad** | Estado de coherencia global del sistema (OK / DEGRADED / CORRUPTED). |
| **Capa activa** | Módulo que tiene el control en un momento dado. |
| **Dispatch** | Acción de delegar control a una capa específica. |
| **Orquestación** | Coordinación del flujo entre capas sin intervenir en su lógica interna. |

---

## 1. Arquitectura del sistema

```
                      ┌──────────────────────┐
                      │     KERNEL (v2.1)     │
                      │   Orchestrator Layer  │
                      │   arbitra + despacha  │
                      └──┬───────┬───────┬────┘
                         │       │       │
                    ┌────┘       │       └────┐
                    ▼            ▼            ▼
          ┌─────────────┐ ┌────────────┐ ┌────────────────┐
          │ system-rules│ │execution-  │ │recovery-       │
          │ (policy)    │ │engine      │ │protocol        │
          │ define      │ │(runtime)   │ │(resilience)    │
          │ verdad      │ │ejecuta     │ │repara          │
          └─────────────┘ └────────────┘ └────────────────┘
```

Flujo de control:

```
INPUT → KERNEL → validar integridad → determinar capa activa → despachar → ejecutar → state update → KERNEL
```

---

## 2. Principio de autoridad

El Kernel decide **qué capa tiene prioridad** en cada momento. No modifica el contenido de ninguna capa.

### 2.1 Jerarquía de verdad

| Prioridad | Capa | Cuándo gana |
|-----------|------|-------------|
| 1 (máxima) | **recovery-protocol** | Cuando hay corrupción o inconsistencia crítica. Recovery puede congelar el sistema completo. |
| 2 | **system-rules** | Define qué es estructuralmente válido. Si rules prohíbe una acción, ninguna otra capa puede ejecutarla. |
| 3 | **execution-engine** | Ejecuta dentro de los límites permitidos por rules. No puede saltarse gates. |

### 2.2 Tabla de conflictos

| Conflicto | Resolución | Acción del Kernel |
|-----------|-----------|-------------------|
| Engine quiere ejecutar, Rules lo prohíbe | Rules gana | Bloquear ejecución, notificar violación de gate |
| Engine ejecutando, Recovery se activa | Recovery gana | Congelar engine, activar recovery |
| Rules y Recovery contradicen | Recovery gana si hay corrupción; si no, Rules | Evaluar integridad primero |
| Estado inconsistente detectado | Recovery obligatorio | Detener todo, activar recovery |
| Humano ordena algo contra Rules | Humano > todo | Permitir, pero registrar en lessons |

---

## 3. Estado interno del Kernel

El Kernel mantiene su propia vista lógica del sistema, independiente del state report.

```
KERNEL_STATE = {
  mode:          FAST | DEBUG | FULL
  integrity:     OK | DEGRADED | CORRUPTED
  active_layer:  rules | engine | recovery | finalization | idle
  locked:        true | false
}
```

### 3.1 Transiciones del Kernel

```
                    ┌───────────┐
                    │   IDLE    │ ← sistema en reposo, sin operación activa
                    └─────┬─────┘
                          │ operación solicitada
                          ▼
                    ┌───────────┐
                    │ EVALUATE  │ ← valida integridad, determina capa
                    └─────┬─────┘
                          │
              ┌───────────┼────────────┬──────────────┐
              ▼           ▼            ▼              ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
        │ RULES    │ │ ENGINE   │ │ RECOVERY │ │ FINALIZATION │
        │ active   │ │ active   │ │ active   │ │ active       │
        └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘
             │            │            │              │
             └────────────┼────────────┼──────────────┘
                          ▼            ▼
                    ┌───────────┐
                    │  UPDATE   │ ← reflejar cambio en state_report
                    └─────┬─────┘
                          │
                          ▼
                    ┌───────────┐
                    │   IDLE    │
                    └───────────┘
```

Cualquier estado puede ir a `LOCKED` si se detecta CORRUPTED:

```
IDLE ─┐
EVALUATE ─┤
RULES ─┤──▶ LOCKED
ENGINE ─┤
RECOVERY ─┤
FINALIZATION ─┘
```

LOCKED solo se desbloquea cuando recovery completa su ciclo.

---

## 4. Ciclo operativo del Kernel

Cada operación del sistema sigue este flujo obligatorio. El Kernel lo ejecuta antes de permitir cualquier acción.

### 4.1 Fases

```
FASE 1 — RECIBIR
  └─ Recibe solicitud de operación (humano o IA)
  └─ Identifica origen y tipo

FASE 2 — EVALUAR INTEGRIDAD
  └─ Lee 06_state_report.md
  └─ Verifica coherencia entre estado declarado y docs
  └─ Determina nivel: OK / DEGRADED / CORRUPTED

FASE 3 — DECIDIR CAPA ACTIVA
  └─ Según integridad y tipo de operación:
      ├─ CORRUPTED → recovery-protocol
      ├─ DEGRADED → system-rules (validación) + permitir con warnings
      └─ OK →
          ├─ operación de validación → system-rules
          ├─ operación de ejecución → execution-engine
          ├─ operación de reparación → recovery-protocol
          └─ operación de finalización → finalization-protocol

FASE 4 — DESPACHAR
  └─ Delegar control a la capa activa
  └─ La capa ejecuta su lógica internamente

FASE 5 — RECIBIR RESULTADO
  └─ Capa devuelve resultado + cambios de estado
  └─ Kernel verifica que el resultado no rompe integridad

FASE 6 — ACTUALIZAR
  └─ Si todo OK → reflejar cambios en estado del Kernel
  └─ Si se rompió integridad → ir a LOCKED → recovery
  └─ Volver a IDLE
```

### 4.2 Árbol de decisión del Kernel

```
Solicitud recibida
├── ¿state_report accesible?
│   ├── No → CORRUPTED → activar recovery
│   └── Sí
│       └── ¿Estado declarado vs docs coherente?
│           ├── No → CORRUPTED → activar recovery
│           └── Sí
│               └── ¿Nivel de integridad?
│                   ├── CORRUPTED → LOCKED → recovery
│                   ├── DEGRADED → permitir con warnings, rules activa
│                   └── OK
│                       └── ¿Tipo de operación?
│                           ├── validación → despachar a system-rules
│                           ├── ejecución → despachar a execution-engine
│                           ├── reparación → despachar a recovery-protocol
│                           └── finalización → despachar a finalization-protocol
│
└── Después de ejecución:
    ├── ¿Resultado mantiene integridad?
    │   ├── No → LOCKED → recovery
    │   └── Sí → UPDATE → IDLE
    └──
```

---

## 5. Control de integridad

El Kernel ejecuta estos checks **antes de cada despacho** y **después de cada retorno**.

### 5.1 Checks obligatorios

| # | Check | Qué valida | Falla si |
|---|-------|-----------|----------|
| K-01 | State report accesible | `06_state_report.md` existe y tiene cabecera válida | No existe / formato inválido |
| K-02 | Estado único | Cabecera declara un solo estado | Múltiples estados o ninguno |
| K-03 | Consistencia estado vs docs | Estado declarado coincide con evidencia documental | PRD_APPROVED pero PRD sin firma |
| K-04 | Sin bloqueos fantasma | Bloqueos listados existen realmente | B-XX listado pero sin causa real |
| K-05 | Capa activa válida | La capa a despachar existe y es aplicable | Despachar engine en CORRUPTED |
| K-06 | Post-ejecución estable | Después de operación, sistema sigue coherente | Estado cambió sin transición válida |

### 5.2 Niveles de integridad

| Nivel | Significado | Acción del Kernel |
|-------|-------------|-------------------|
| **OK** | Todos los checks K-01 a K-06 pasan | Despachar normal según tipo de operación |
| **DEGRADED** | K-01, K-02, K-04 OK; K-03/K-05/K-06 con inconsistencias menores | Permitir ejecución con warnings, activar system-rules para validación forzada, registrar en lessons |
| **CORRUPTED** | K-01 o K-02 fallan, o múltiples checks críticos fallan | LOCKED inmediato, activar recovery-protocol, detener cualquier ejecución |

### 5.3 Detección de corrupción

El Kernel considera el sistema CORRUPTED si:

- `06_state_report.md` no existe o no es legible
- `06_state_report.md` declara `BLOCKED` pero no hay bloqueo listado
- `06_state_report.md` declara `PRD_APPROVED` pero `01_prd.md` no tiene firma
- `06_state_report.md` declara `IN_PROGRESS` pero `03_tasks.md` no tiene tareas en progreso
- Dos documentos declaran el mismo estado con valores diferentes
- No se puede determinar el estado actual del proyecto por contradicciones

---

## 6. Interface entre capas

El Kernel se comunica con cada capa mediante un contrato de entrada/salida estricto.

### 6.1 System Rules → Kernel

```
ENTRADA: solicitud de validación (operación propuesta, estado actual)
SALIDA:  resultado (válido / inválido), restricciones activas, gates aplicables
CONDICIÓN: solo se activa si integridad ≥ DEGRADED
```

### 6.2 Execution Engine → Kernel

```
ENTRADA: solicitud de ejecución (T-XXX, modo)
SALIDA:  resultado (completada / fallida / bloqueada), cambios en tasks + state_report
CONDICIÓN: solo se activa si integridad = OK
```

### 6.3 Recovery Protocol → Kernel

```
ENTRADA: señal de activación (B-06, humano, K-04/5 fallido)
SALIDA:  diagnóstico, plan de reparación, estado post-recovery
CONDICIÓN: se activa en CORRUPTED o por solicitud humana
```

### 6.4 Finalization Protocol → Kernel

```
ENTRADA: señal de activación (tareas completadas + autorización humana)
SALIDA:  documentación generada, nomenclatura aplicada, estado post-finalización
CONDICIÓN: se activa si integridad = OK, todas las tareas completadas, y humano autoriza
DURANTE:  Engine se congela, no se ejecutan tareas de código
```

---

## 7. Modos de operación del Kernel

El Kernel opera en el mismo modo que el sistema (`06_state_report.md` → Modo). El modo afecta cuánto valida el Kernel antes de despachar.

| Aspecto | FAST | DEBUG | FULL |
|---------|------|-------|------|
| Checks de integridad | K-01, K-02, K-05 | Todos (K-01 a K-06) | Todos + explicación |
| Post-ejecución check | K-06 rápido | K-06 detallado | K-06 + verificación humana |
| Decisiones | Automáticas | Explicadas | Confirmadas por humano |
| Tolerancia a DEGRADED | Sí, con warning | No, pasa a CORRUPTED | No, pasa a CORRUPTED |
| Logging de arbitraje | Solo conflictos | Todas las decisiones | Todas las decisiones + contexto |

---

## 8. Reglas de arbitraje detalladas

### 8.1 Conflicto: Engine vs Rules

```
Engine: "Quiero ejecutar T-005"
Rules:  "T-005 no tiene criterios de aceptación (B-03)"
Kernel: → Bloquear T-005
       → Notificar: "Rules bloquea T-005 por B-03"
       → Sugerir: corregir criterios en 03_tasks.md
       → Mantener estado actual
```

### 8.2 Conflicto: Engine vs Recovery

```
Engine:  "Ejecutando T-006"
Recovery: "B-06 detectado: 01_prd.md y 02_architecture.md contradictorios"
Kernel:  → Congelar Engine
       → Activar Recovery
       → Estado: LOCKED
```

### 8.3 Conflicto: Rules vs Recovery

```
Rules:  "PRD_APPROVED según 01_prd.md"
Recovery: "Corrupción detectada: 01_prd.md sin firma"
Kernel: → Evaluar integridad
       → Si CORRUPTED → Recovery gana
       → Si solo DEGRADED → Rules gana + warning
```

### 8.4 Solicitud humana contra Rules

```
Humano: "Ejecuta esto aunque no tenga PRD"
Rules:  "G01 prohibe código sin PRD"
Kernel: → Humano tiene prioridad
       → Permitir ejecución
       → Registrar en lessons: "Excepción humana a G01 — <fecha> — <motivo>"
       → No cambiar estado del sistema (sigue en PRD_REQUIRED)
```

---

## 9. Logging de arbitraje

El Kernel registra cada decisión de arbitraje. El log se escribe en `05_lessons_learned.md` bajo la sección de incidentes, con formato:

```
## Arbitraje: <fecha> — <id>

**Conflicto:** <capas involucradas>
**Origen:** <solicitud que causó el conflicto>
**Decisión:** <qué resolvió el Kernel>
**Justificación:** <por qué se decidió así>
**Impacto:** <cambios en estado del sistema>
```

En FAST mode, el Kernel solo registra conflictos que resultaron en bloqueo o cambio de estado. En DEBUG y FULL, registra todas las decisiones de arbitraje.

---

## 10. Fail-safe del Kernel

Si el Kernel detecta cualquiera de estas condiciones, activa el fail-safe:

### 10.1 Condiciones de activación

| Código | Condición | Acción |
|--------|-----------|--------|
| F-01 | Doble estado activo en state_report | LOCKED → recovery |
| F-02 | State_report con formato inválido | LOCKED → recovery |
| F-03 | Ciclo infinito detectado (misma operación repetida sin avance) | LOCKED → notificar humano |
| F-04 | Contradicción entre integridad OK y operación fallando repetidamente | LOCKED → recovery |
| F-05 | Kernel no puede determinar estado (contradicción entre capas) | LOCKED → recovery |

### 10.2 Comportamiento en fail-safe

1. Declarar LOCKED en estado del Kernel
2. No despachar ninguna capa
3. Notificar al humano con el código F-XX y la evidencia
4. Esperar instrucciones humanas o activación de recovery
5. Solo el humano o recovery pueden desbloquear

---

## 11. Regla final del Kernel

El Kernel nunca ejecuta tareas. El Kernel nunca define reglas. El Kernel nunca repara documentos.

El Kernel solo orquesta: recibe una solicitud, evalúa integridad, determina qué capa debe actuar, despacha, verifica el resultado, y actualiza su estado interno.

Si hay conflicto entre cualquier capa y la orquestación del Kernel, la decisión del Kernel tiene prioridad absoluta en el flujo, pero el Kernel no puede modificar el contenido de ninguna capa.
