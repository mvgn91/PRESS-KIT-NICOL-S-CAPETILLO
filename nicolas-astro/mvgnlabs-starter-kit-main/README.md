# MVGN Starter Kit

**Framework de desarrollo asistido por IA para convertir ideas en productos.**

MVGN Starter Kit es un sistema estructurado que fuerza disciplina de ingeniería mediante documentos obligatorios, prompts especializados, una máquina de estados formal y un runtime operativo con CLI.

---

## Quick start

```powershell
git clone <repo> my-project
cd my-project
.\install-mvgn.ps1
.\tools\mvgn.ps1 start
```

## Estructura

```
/
├── .mvgn/                 # Reglas del sistema MVGN
│   ├── system-rules.md
│   ├── execution-engine.md
│   ├── recovery-protocol.md
│   ├── finalization-protocol.md
│   ├── kernel-spec.md
│   ├── session-contract.md
│   └── authority-map.md
├── tools/                 # CLI y utilidades
│   ├── mvgn.ps1
│   ├── mvgn-loader.ps1
│   └── mvgn-context.json
├── prompts/               # Prompts especializados para IA
│   ├── master-prompt.md
│   ├── task-execution.md
│   ├── bugfix-prompt.md
│   └── component-prompt.md
├── install-mvgn.ps1       # Instalador global
└── README.md
```

## CLI

| Comando | Descripción |
|---------|-------------|
| `mvgn start` | Bootstrap completo |
| `mvgn resume` | Retoma sesión anterior |
| `mvgn state` | Muestra estado actual |
| `mvgn context` | Exporta contexto |
| `mvgn validate` | Checks de integridad |

## Licencia

MIT
