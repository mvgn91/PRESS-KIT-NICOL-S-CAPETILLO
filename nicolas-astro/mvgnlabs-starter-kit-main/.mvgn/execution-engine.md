# MVGN Execution Engine — Runtime Layer v2.1

> Comportamiento operativo del sistema durante ejecución diaria.
> Define cómo se ejecutan tareas, cómo avanza el sistema y cómo se comporta en cada modo.
> Depende de `system-rules.md` para políticas. No las redefine.

---

## 1. Modos de operación

El modo se declara al iniciar sesión. Se cambia con `/switch <modo>`. Se registra en `06_state_report.md`.

| Aspecto | FAST | DEBUG | FULL |
|---------|------|-------|------|
| **Validación pre-ejecución** | B-03, B-04 | Todas + explicar cada una | Todas |
| **Post-task verification** | Criterios + lint | Criterios + lint + logs | Criterios + tests + lint + docs |
| **State report update** | Automático IA | Automático + detalle | Manual + confirmación |
| **Propagación documental** | State + tasks | State + tasks + changelog | Todos los docs |
| **Avance automático** | Sí | No (pausa explicativa) | No (pide confirmación) |
| **Verbosidad IA** | Solo resultado | Causa + efecto + posible solución | Completa |
| **Uso** | Desarrollo diario | Resolución de bugs / bloqueos | PRD / Arquitectura / Release |

**Default:** `/fast`. Al cambiar de modo, la IA notifica y actualiza la cabecera del state report.

---

## 2. Task execution loop

Ciclo obligatorio para cada tarea. El nivel de detalle depende del modo.

```
┌──────────────────────────────────────────────────┐
│ 1. SELECCIÓN  → elegir T-XXX de 03_tasks.md      │
│ 2. VALIDACIÓN  → verificar pre-condiciones        │
│ 3. EJECUCIÓN   → implementar                      │
│ 4. VERIFICACIÓN→ validar criterios de aceptación  │
│ 5. REGISTRO    → actualizar docs                  │
│ 6. DECISIÓN    → ¿continuar o detener?            │
└──────────────────────────────────────────────────┘
```

### 2.1 Selección

La IA toma la primera tarea en estado `Pendiente` de `03_tasks.md` cuyas dependencias estén cumplidas.

- Si no hay tareas pendientes → informar al humano y sugerir próximos pasos.
- Si la tarea seleccionada está bloqueada → informar y detener.

### 2.2 Validación pre-ejecución

**FAST:**
- [ ] Tarea tiene criterios de aceptación (B-03)
- [ ] Tarea tiene referencia a PRD o arquitectura (B-04)
- [ ] Tarea no depende de otra incompleta

Si falla → Bloquear (B-03 o B-04).

**DEBUG:**
- [ ] Lo mismo que FAST
- [ ] Explicar qué se validó y por qué es suficiente
- [ ] Listar dependencias y su estado

Si falla → Bloquear + explicar causa raíz.

**FULL:**
- [ ] Lo mismo que FAST
- [ ] Estado del proyecto es `READY_TO_BUILD` o `IN_PROGRESS`
- [ ] Gate G01 (PRD aprobado)
- [ ] Gate G02 (Arquitectura aprobada)
- [ ] Gate G03 (Tarea con criterios + refs)
- [ ] Gate G04 (State report actualizado)
- [ ] Gate G05 (Scope definido)

Si falla → Bloquear según corresponda.

### 2.3 Ejecución

- Una sola tarea a la vez. No se abre otro frente.
- No se añade funcionalidad fuera del alcance de la tarea.
- Si surge algo fuera de alcance → crear `T-NEXT` en `03_tasks.md` y notificar al humano.

### 2.4 Verificación post-ejecución

**FAST:**
- [ ] Verificar criterios de aceptación de la tarea
- [ ] Ejecutar lint / typecheck
- [ ] Confirmar que el cambio es atómico

**DEBUG:**
- [ ] Lo mismo que FAST
- [ ] Revisar logs de ejecución
- [ ] Explicar qué se verificó y el resultado

**FULL:**
- [ ] Lo mismo que FAST
- [ ] Ejecutar pruebas relevantes (unitarias, integración)
- [ ] Verificar cobertura si aplica
- [ ] Revisar que no hay regresiones

Si la verificación falla:
1. Registrar en `05_lessons_learned.md`
2. Devolver tarea a `Pendiente` en `03_tasks.md`
3. Informar al humano con el error y posible solución
4. Cambiar a modo DEBUG automáticamente si no lo está

### 2.5 Registro

Actualizar docs según modo (ver sección 4).

### 2.6 Decisión

Ver sección 5 (auto-advance) y sección 6 (interrupts).

---

## 3. State report update logic

La cabecera de `06_state_report.md` se actualiza después de cada tarea.

**Formato de actualización:**

```
Estado:     [nuevo estado]
Tarea activa: [T-XXX o —]
Progreso:   [N] / [M] completadas
Última acción: [descripción corta]
Siguiente acción: [descripción corta]
Modo:       FAST | DEBUG | FULL
Bloqueos activos: [B-XX o —]
```

**Por modo:**

| Modo | Cuándo se actualiza | Cómo |
|------|--------------------|------|
| FAST | Inmediato, automático | IA sobrescribe cabecera, notifica al humano solo el resultado |
| DEBUG | Inmediato, automático | IA sobrescribe cabecera + añade explicación del cambio |
| FULL | Después de confirmación humana | IA presenta el cambio propuesto, humano lo aprueba, IA lo aplica |

La actualización reemplaza la cabecera completa. No se acumulan versiones. El historial del proyecto se mantiene en `04_changelog.md`.

---

## 4. Propagación documental por modo

Después de completar una tarea:

| Documento | FAST | DEBUG | FULL |
|-----------|------|-------|------|
| `03_tasks.md` | Actualizar estado de tarea | Actualizar + nota | Actualizar + verificar |
| `06_state_report.md` | Actualizar cabecera | Actualizar + explicar | Actualizar + confirmar |
| `04_changelog.md` | Al final del batch | Por tarea | Por tarea |
| `05_lessons_learned.md` | Solo incidentes | Solo incidentes | Solo incidentes |

En FAST mode: la IA difiere `04_changelog.md` hasta el final del batch para reducir fricción.
En FULL mode: cada tarea produce una entrada en `04_changelog.md`.

---

## 5. Auto-advance y ejecución continua

### 5.1 Auto-advance

Después de registrar una tarea completada, la IA evalúa:

```
¿T-N+1 existe en estado Pendiente?
├── No → Detener. Informar resumen del batch.
└── Sí
    └── ¿Dependencias de T-N+1 están cumplidas?
        ├── No → Detener. Informar qué falta.
        └── Sí
            └── Consultar modo:
                ├── FAST → Avanzar automáticamente. Notificar: "Continuando con T-00N".
                ├── DEBUG → Explicar + preguntar "¿Continuar?"
                └── FULL → Informar + esperar "Continuar" del humano.
```

### 5.2 Batch execution

El humano define un rango de tareas a ejecutar en secuencia:

> "Ejecuta T-003 a T-005 en fast"
> IA: "Batch T-003 → T-005. Modo FAST."

Comportamiento durante el batch:
- Ejecución secuencial e ininterrumpida
- State report se actualiza después de cada tarea
- `04_changelog.md` se actualiza al finalizar el batch
- Si ocurre un bloqueo → el batch se interrumpe
- Si una tarea falla verificación → se detiene el batch, se cambia a DEBUG

### 5.3 Finalización de batch final

Cuando el batch completo agota todas las tareas de `03_tasks.md` (ninguna queda en estado `Pendiente`):

1. La IA informa al humano que **no hay más tareas pendientes**
2. Sugiere ejecutar el **Finalization Protocol** (`.mvgn/finalization-protocol.md`)
3. Si el humano autoriza, el Kernel cambia la capa activa a `finalization`
4. El Engine se congela hasta que finalice el protocolo
5. Si el humano no autoriza, el sistema queda en `IN_PROGRESS` sin tareas pendientes

### 5.4 Resumen de batch

Al finalizar un batch (completado o interrumpido), la IA presenta:

```
Batch T-003 → T-005:
  ✓ T-003 completada
  ✓ T-004 completada
  ✗ T-005: bloqueada (dependencia T-002 incompleta)
  Progreso: 4/5
  Siguiente: resolver bloqueo de T-005
```

---

## 6. Interrupt rules (condiciones de parada)

La IA **debe detenerse inmediatamente** y notificar al humano cuando:

| Condición | Acción |
|-----------|--------|
| Batch completado | Informar resumen, sugerir próximos pasos |
| Bloqueo detectado (B-01 a B-08) | Entrar en BLOCKED, cambiar a DEBUG, explicar causa |
| Tarea falla verificación | Registrar en lessons, devolver a Pendiente, cambiar a DEBUG |
| No hay más tareas pendientes válidas | Informar, sugerir nuevas tareas o cierre |
| Scope creep detectado | Revertir cambios extra, crear nueva tarea, notificar |
| Humano solicita interrupción | Detener inmediatamente, esperar instrucciones |
| En FULL mode: antes de cada transición de estado | Pausar, informar, esperar confirmación |

---

## 7. Árbol de decisión rápido

```
¿Cuál es mi modo?
├── /fast
│   ├── Leer cabecera de state_report
│   ├── Tomar siguiente tarea Pendiente de 03_tasks.md
│   ├── Validar: ¿tiene criterios? ¿dependencias ok?
│   │   ├── No → Bloquear (B-03/B-04). Informar.
│   │   └── Sí → Ejecutar
│   ├── Verificar criterios + lint
│   │   ├── Fallo → lessons + Pendiente + switch DEBUG
│   │   └── OK → Actualizar tasks + state_report
│   └── ¿Siguiente tarea lista?
│       ├── Sí → Auto-advance
│       └── No → Informar resumen
│
├── /debug
│   ├── Validar todo + explicar cada paso
│   ├── Ejecutar con registro detallado
│   ├── Verificar + explicar resultado
│   ├── Actualizar docs con detalle
│   └── Preguntar antes de avanzar
│
└── /full
    ├── Validar todos los gates (G01-G05)
    ├── Confirmar cada paso con humano
    ├── Ejecutar con validación completa
    ├── Actualizar todos los docs afectados
    └── Esperar confirmación para cada transición
```

---

## 8. Performance rules

| Modo | Objetivo | Acciones permitidas | Acciones omitidas |
|------|----------|--------------------|--------------------|
| FAST | Velocidad | Validación mínima, updates automáticos, auto-advance | Consistencia full, changelog por tarea, confirmaciones |
| DEBUG | Diagnóstico | Validación completa, logs detallados, explicaciones | Auto-advance, ejecución en batch |
| FULL | Control | Todas las validaciones, confirmaciones humanas, docs completos | Velocidad, automación |

---

## 9. Consistencia con system-rules.md

Este engine NO puede:
- Cambiar estados del sistema directamente (solo a través de transiciones definidas)
- Modificar PRD o arquitectura sin pasar por los gates G01, G02
- Saltar fases del state machine
- Decidir aprobaciones (eso es rol del humano)

Solo ejecuta dentro de las restricciones definidas en `system-rules.md`.
