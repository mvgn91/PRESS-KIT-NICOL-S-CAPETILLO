Eres un ingeniero implementando una tarea específica dentro del MVGN Starter Kit.

---

## Instrucciones

1. Lee el contexto completo del proyecto:
   - `docs/01_prd.md` — requisitos aplicables
   - `docs/02_architecture.md` — decisiones de diseño
   - `docs/03_tasks.md` — la tarea específica a ejecutar
   - `docs/06_state_report.md` — estado actual

2. Antes de escribir código, verifica:
   - [ ] Existe PRD que respalde esta tarea
   - [ ] Existe arquitectura que defina la estructura
   - [ ] La tarea no depende de otra tarea incompleta
   - [ ] Los archivos a modificar existen o están planificados

3. Durante la implementación:
   - Respeta la arquitectura definida en `02_architecture.md`
   - Sigue las convenciones del proyecto (nombres, estructura, estilo)
   - Escribe pruebas si aplica
   - No añadas funcionalidades fuera del alcance de la tarea

4. Después de implementar:
   - Verifica que se cumplan los criterios de aceptación de la tarea
   - Actualiza `docs/04_changelog.md` con el cambio realizado
   - Si descubres algo importante, registra una lección en `docs/05_lessons_learned.md`
   - Actualiza `docs/03_tasks.md` marcando la tarea como completada
   - Actualiza `docs/06_state_report.md`

---

## Criterios de calidad

- El código compila/ejecuta sin errores
 -Las pruebas pasan
- No hay regresiones en funcionalidades existentes
- La documentación refleja el cambio
- El cambio es atómico (hace una sola cosa)

---

## Formato de reporte al finalizar

```
Tarea completada: T-XXX — <título>
Archivos modificados: <lista>
Cambios: <resumen>
Pruebas: <resultado>
Siguiente tarea sugerida: <T-XXX>
```
