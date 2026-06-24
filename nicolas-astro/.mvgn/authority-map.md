# MVGN Authority Map — Priority Hierarchy v2.1

> Define la prioridad absoluta entre capas del sistema. Es la única fuente de verdad para resolver conflictos.
> Este archivo es máquina-legible: su estructura de prioridad es vinculante para todas las capas y la IA.

---

## 1. Prioridad absoluta (de mayor a menor)

| Prioridad | Capa | Rol | Qué controla | Cuándo gana |
|-----------|------|-----|-------------|-------------|
| **P1** | **session-contract** | Comportamiento IA | Cómo debe operar la IA en cada sesión. Formato de respuesta, prohibiciones, flujo obligatorio. | Siempre. Si el contrato dice X, ninguna otra capa puede decir no-X. |
| **P2** | **kernel-spec** | Orquestación | Qué capa está activa. Cuándo despachar. Evaluación de integridad. Arbitraje entre capas. | Cuando hay conflicto entre capas. Kernel decide qué capa tiene control. |
| **P3** | **recovery-protocol** | Resiliencia | Congelación, diagnóstico, reconstrucción, revalidación, reanudación. | Cuando el sistema está CORRUPTED o el Kernel activa recovery. Puede override rules y engine. |
| **P4** | **system-rules** | Política | Estados, transiciones, gates, roles, definición de aprobado. | Cuando no hay recovery activo. Define qué es estructuralmente válido. |
| **P5** | **execution-engine** | Ejecución | Task loop, modos, propagación, auto-advance, batches. | Solo dentro de los límites permitidos por P4, P3, P2, P1. |

---

## 2. Reglas de resolución de conflictos

### 2.1 Tabla de resolución

| Conflicto entre | Quién gana | Fundamento |
|-----------------|-----------|-----------|
| Contract vs Kernel | **Contract** (P1) | Contract define el comportamiento de la IA. Kernel orquesta capas, pero no puede cambiar cómo la IA debe operar. |
| Contract vs Recovery | **Contract** (P1) | Recovery repara el sistema, pero la IA sigue obligada por el contrato durante la reparación. |
| Contract vs Rules | **Contract** (P1) | Si contract prohibe algo, rules no puede permitirlo. Contract es la capa de binding. |
| Contract vs Engine | **Contract** (P1) | Engine solo ejecuta lo que contract permite. |
| Kernel vs Recovery | **Kernel** (P2) si integridad >= DEGRADED; **Recovery** (P3) si CORRUPTED | Kernel decide cuándo activar recovery. Una vez activo, recovery tiene control temporal. |
| Kernel vs Rules | **Kernel** (P2) | Kernel decide qué capa está activa. Rules define restricciones, pero Kernel orquesta. |
| Kernel vs Engine | **Kernel** (P2) | Si Kernel bloquea una operación, Engine no puede ejecutarla. |
| Recovery vs Rules | **Recovery** (P3) | Recovery puede reconstruir docs y cambiar estado. Rules aplica post-recovery. |
| Recovery vs Engine | **Recovery** (P3) | Recovery congela Engine. Engine no puede ejecutar durante recovery. |
| Rules vs Engine | **Rules** (P4) | Si Rules prohibe una acción, Engine no puede ejecutarla. |

### 2.2 Casos prácticos

**Caso 1:** Engine quiere ejecutar T-005. Rules detecta que T-005 no tiene criterios (B-03).
```
Engine solicita → Kernel evalúa → Rules bloquea → Kernel falla → Engine no ejecuta.
Prioridad: P4 (Rules) > P5 (Engine).
```

**Caso 2:** Recovery quiere reconstruir 01_prd.md. Rules dice que docs aprobados no se modifican.
```
Recovery activo → override de P4 por P3.
Prioridad: P3 (Recovery) > P4 (Rules).
Razón: recovery es excepción a la congelación post-aprobación.
```

**Caso 3:** Contract dice que la IA debe responder con formato MVGN SESSION STATE. Engine le pide responder en otro formato.
```
Contract P1 > Engine P5.
La IA responde con formato del contrato, no del engine.
```

**Caso 4:** Kernel declara integridad CORRUPTED. Engine tiene tareas en cola.
```
Kernel P2 detecta → activa Recovery P3 → Recovery congela Engine P5.
Prioridad: P2 > P3 > P5.
```

---

## 3. Formato máquina-legible

La IA debe usar esta tabla como referencia directa para resolver conflictos:

```
AUTHORITY_MAP = {
  "P1": "session-contract.md",
  "P2": "kernel-spec.md",
  "P3": "recovery-protocol.md",
  "P4": "system-rules.md",
  "P5": "execution-engine.md",
  "resolution": {
    "contract_vs_kernel":     "P1 wins",
    "contract_vs_recovery":   "P1 wins",
    "contract_vs_rules":      "P1 wins",
    "contract_vs_engine":     "P1 wins",
    "kernel_vs_recovery":     "P2 wins (unless CORRUPTED, then P3)",
    "kernel_vs_rules":        "P2 wins",
    "kernel_vs_engine":       "P2 wins",
    "recovery_vs_rules":      "P3 wins",
    "recovery_vs_engine":     "P3 wins",
    "rules_vs_engine":        "P4 wins",
    "human_vs_all":           "HUMAN wins (logged in lessons)"
  }
}
```

---

## 4. Regla final: override humano

Cualquier instrucción humana explícita puede override cualquier capa. La decisión se registra en `05_lessons_learned.md` con justificación. Esto no cambia la jerarquía entre capas, solo permite excepciones controladas.
