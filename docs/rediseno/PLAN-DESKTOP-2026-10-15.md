# PLAN — REDISEÑO DESKTOP · PRESS KIT NICOLÁS CAPETILLO

```
DOC-REF:      PLAN/REDISENO-DESKTOP-2026-10-15
CICLO:        F3 — Rediseño desktop (después del cierre fallido de F2)
BASE:         working tree al 2026-10-15 14:52 (P0+P1 verificados + overhaul a medias)
              respaldo: rama wip/pausa-overhaul = 214fbc6
PRODUCCIÓN:   main = origin/main = 187a68e (intacta, es el punto de retorno)
ALCANCE:      nicolas-astro/ — solo presentación. Desktop primero. Móvil en F4.
AUTOR:        freebuff (MVGN, modo SOLO) — a petición del operador
ESTADO:       APROBADO. F3-A ejecutado — compuerta pendiente de visto bueno
BASELINE:     worktree en /tmp/baseline-wt sirviendo :4322; F3 sirviendo :4321
```

> **Corrección de medición (2026-10-15 15:19):** la primera pasada midió el documento en 10 432 px
> y Biografía en 2 272 px porque las imágenes aún no estaban maquetadas al medir. El baseline real
> (worktree sobre `wip/pausa-overhaul`, imágenes y fuentes resueltas) es **10 957 px** y Biografía
> **2 797 px**. Las tablas de §1.2 y §1.3 ya están corregidas.

> **Diagnóstico del operador (2026-10-15):** *"el sitio es inconsistente entre sí, veo secciones en un estilo
> y en otro, tamaños de títulos en unas y en otras, no hay estándar de nada, en desktop se desaprovecha el
> espacio, y la galería podría ser más impactante."*

Todo lo medido abajo está tomado del render real (Chromium headless, desktop **1440×900**, tema claro,
`astro dev` en `:4321`, documento de **10 957 px** de alto). No es opinión: son números.

---

## 1. La inconsistencia, medida

### 1.1 Hay 29 tamaños de fuente distintos en uso

Elementos con texto visible, agrupados por `font-size` computado:

| Rango | Tamaños encontrados | Cuántos |
|:---|:---|:---:|
| Micro-etiquetas | 9.6 · 10.4 · 11.2 · 11.5 · 12 · 12.5 · 12.8 | **7 tamaños para la misma función** |
| Cuerpo / UI | 13.6 · 14.4 · 15.2 · 15.8 · 16 · 16.8 · 17.6 · 18.4 · 19.2 · 20.8 | 10 |
| Subtítulos | 27.2 · 32 · 44.8 · 48 · 51.2 · 64 | 6 |
| Display | 80 · 144 | 2 |
| **Total** | | **29 distintos** |

La función "etiqueta pequeña en mayúsculas" existe hoy en **siete** tamaños diferentes. Eso es exactamente
"no hay estándar de nada".

### 1.2 El ritmo vertical cambia de sección en sección

| Sección | Padding arriba/abajo | Alto real | Espacio muerto |
|:---|---:|---:|---:|
| Hero | 0 / 0 | 901 px | 0 % |
| Biografía | 64 / 64 | **2 797 px** | 6 % |
| Filmografía | 64 / **96** | 1 668 px | 10 % |
| Demo Reel | 64 / 64 | **2 388 px** | 5 % |
| Galería | 64 / 64 | 1 202 px | 11 % |
| Ficha Técnica | 64 / 64 | 1 304 px | 10 % |
| Contacto | **40 / 40** | 610 px | 13 % |
| Footer | 24 / 24 | 85 px | **58 %** |

Cuatro paddings distintos (0 / 24 / 40 / 64 / 96 según la sección) y alturas que van de **610 a 2 797 px**
(×4.6 entre la más baja y la más alta). Contacto es la única sección con 40 y la más apretada;
Filmografía es la única con 96 abajo; el hero no usa el ritmo del sistema en absoluto.

### 1.3 El espacio horizontal se desperdicia en la galería y el reel

- Contenedor único: **1300 px** en un viewport de 1440 → 70 px de margen por lado. Correcto para texto.
- **Galería:** grid de 3 columnas de **385 px** para las fotos pequeñas, dentro de 1300 → ocupa 1 204 px y
  **deja 96 px sin usar**. Toda la sección mide **1 202 px** y contiene 6 fotos: en una pantalla de 900 px de
  alto, la galería entera entra sin scroll y ninguna foto supera los 795 px de ancho. Un press kit de actor
  con 34 fotos buenas y la galería es el bloque **más pequeño** de la página.
- **Demo Reel:** la sección más alta del sitio (**2 388 px**) para dos clips. La fila de clips mide 960 px y
  el video dentro ocupa **340 × 600 px** (9:16); el resto es columna de texto. Hay ~600 px de alto dedicados
  a información de dos clips.
- Se cuentan **2 familias** en uso (Inter 340 elementos · Archivo 52) pero el `<link>` de `Layout.astro`
  **carga 3**: `Space Grotesk` no se usa en ninguna parte. Peso muerto en cada visita.

### 1.4 Qué se conserva de lo ya hecho

Las ganancias **técnicas** de F2 son buenas, invisibles y no dependen del lenguaje visual. Se mantienen:

- Peso inicial móvil 81.64 MB → **0.93 MB**, LCP 1.5 s en 4G simulado, 0 JS de terceros.
- Galería **34/34** rutas en 200 (los 404 corregidos), dedupe de descargas.
- Pipeline `astro:assets` (WebP, tiers, sin EXIF), OG/Twitter/canonical/theme-color, `og-image` 1200×630.
- Galería accesible por teclado + lightbox `role="dialog"` con trampa y retorno de foco.
- `robots.txt`, `sitemap.xml`, JSON-LD `Person`, contraste AA en textos informativos.

**El contenido no se toca.** Copy, 34 fotos, 3 films, 2 clips, datos y contactos se quedan exactamente como
están. Cambia solo el modo de mostrarlos.

---

## 2. Dirección: dossier de cine, completa y coherente

El problema no es el lenguaje elegido, es que **hoy conviven dos y medio a la vez**: vidrio en nav, móvil y
chips; sin vidrio en hero, bio, galería y reel; orbes animados y rotación de fotos por encima de todo. Cuando
todo tiene profundidad, nada tiene profundidad.

**Decisión: un solo lenguaje de superficie — papel e tinta con reglas de 1px — y un solo truco de profundidad,
reservado a la navegación.** La fotografía es el color; la tipografía es el drama; nada más compite.

*(Alternativa si prefieres conservar el vidrio: se puede pulir la identidad actual en vez de unificarla al
papel. Dilo y reescribo §2-§5 con esa base — el resto del plan no cambia.)*

### 2.1 Escala tipográfica — 7 pasos, no 29

| Token | Valor (1440 px) | Uso único |
|:---|:---|:---|
| `--fs-display` | `clamp(3.5rem, 10vw, 8.5rem)` → 144 px | Solo el lockup del nombre en el hero |
| `--fs-h2` | `clamp(2rem, 3.2vw, 2.75rem)` → 44 px | **Todos** los títulos de sección, sin excepción |
| `--fs-h3` | `1.5rem` → 24 px | Título de film, título de bloque |
| `--fs-lead` | `1.125rem` → 18 px | Párrafo de entrada |
| `--fs-body` | `1rem` → 16 px | Todo el texto corrido |
| `--fs-small` | `0.875rem` → 14 px | Datos secundarios |
| `--fs-micro` | `0.75rem` → 12 px | **Única** medida de microetiqueta: Inter 600, mayúsculas, tracking 0.08em |

Regla: dos familias (`Archivo` display + `Inter` texto), salida `Space Grotesk` del `<link>`. Medida de
lectura ≤ 68 caracteres.

### 2.2 Ritmo vertical — uno solo

`--section-pad: clamp(4.5rem, 6vw, 6.5rem)` aplicado **igual** a las seis secciones. Se eliminan 40, 96 y
cualquier valor puntual. Regla de densidad: **ninguna sección > 1 600 px** en desktop.

### 2.3 Superficie, estructura y acento

| Token | Valor | Uso |
|:---|:---|:---|
| `--paper` | `#f6f6f4` | Fondo claro (ya en uso) |
| `--ink` | `#0d0d0d` | Texto y tiras oscuras |
| `--line` | `rgba(13,13,13,0.16)` | **Toda** la estructura: reglas de 1px, no tarjetas |
| `--muted` | `#6b6b6b` | Texto secundario (contraste 5:1, ya corregido) |
| `--signal` | `#b23a2e` | Acento mínimo: estado de proyecto, foco de teclado, rating IMDb |

- **Fuera del cuerpo:** vidrio, orbes, canvas ambiental, sombras de tarjeta, radios de 16 px.
- **Se quedan con vidrio:** nav, lightbox, botones flotantes (donde hay contenido pasando debajo).
- **Un solo encabezado de sección**: `.section-head` = número (2 dígitos, 12 px) + título (`--fs-h2`) + regla

  de 1px. Hoy cada sección inventa el suyo.

### 2.4 Motion — un momento

- **Se conserva:** la entrada del hero (600–900 ms, una sola vez) y las transiciones de respuesta (hover,
  lightbox, tema, foco).
- **Se retira:** rotación automática del retrato cada 5 s, orbes `orbFloatA/B/C` (25–35 s en bucle),
  `slowZoom` de los fondos de filmografía, y el revelado por scroll de `index.astro` (20+ elementos).
- `prefers-reduced-motion` se mantiene como está (bien implementado).

### 2.5 Ancho y uso del espacio

- Contenedor de texto: 1300 px (se mantiene) a 12 columnas.
- **Bloques visuales a sangre:** el hero y la galería pasan a usar el **ancho completo del viewport** con un
  margen mínimo de 40 px. Es donde el "espacio desaprovechado" se convierte en impacto.

---

## 3. Sección por sección (desktop 1440)

| # | Sección | Hoy | Qué cambia | Por qué |
|:--|:---|:---|:---|:---|
| 01 | **Hero** | 901 px · 3 orbes animados · retrato **400×533 px** rotando 6 fotos cada 5 s · botón primario blanco sobre papel claro (se desvanece) | Un retrato, fijo y grande, que **sangra por el borde derecho** junto al nombre; botón primario en `--ink`; etiquetas a 12 px; sin orbes; sin rotación | La primera pantalla no puede estar moviéndose. El retrato es el activo y hoy mide 400 px de ancho |
| 02 | **Biografía** | 2 272 px · huecos de 96 px · datos rápidos duplicados con la Ficha | Cronología como **línea temporal real** (años al margen, entradas sobre la línea), sin tarjetas; huecos a la escala única; ≤ 1 500 px | Es una secuencia, no un grid de tarjetas. Hoy es la segunda sección más alta |
| 03 | **Filmografía** | 1 668 px · año partido en "2024 / PRESENTE" · fondo invisible en táctil | Año en una línea + chip de estado con `--signal`; fondo permanente en táctil; años a `--fs-h3`, chips a `--fs-micro` | Es la mejor sección del sitio (8.5/10): solo se afina, no se rehace |
| 04 | **Demo Reel** | 2 388 px (la más alta) · clip de 340 px en fila de 960 px | Reel principal 16:9 a ancho completo (731 px de alto) + los dos 9:16 en columnas de 320 px con aire. ≤ 1 600 px | Dos clips no pueden costar 2 388 px de scroll |
| 05 | **Galería** | 1 202 px · 3 columnas de 385 px · el bloque más pequeño de la página | **Mosaico a sangre** (ver §4): primera foto a ancho completo, luego piezas de 4:5 y 3:2 en 2–3 columnas con gap de 8 px; contador 34 y CTA al lightbox; ≥ 1 pantalla de alto | Tiene las 34 fotos y hoy es lo que menos impacta. Tu queja principal |
| 06 | **Ficha Técnica** | 1 304 px · layout disciplinado (8/10) | Solo se alinea al sistema: `.section-head`, escala única, CTA de descarga en la misma sección | Es la más útil para un casting: no se reinventa |
| 07 | **Contacto** | 610 px · padding 40 · 13 % muerto · 3 tarjetas | **Bloque de cierre** denso en 2 columnas (4 canales a la izquierda, 3 acciones a la derecha), ≤ 800 px, padding del sistema | Es el call to action y hoy es la sección más vacía |
| — | **Footer** | 85 px · 58 % muerto | Alineado a la escala única; sin "ACTOR | ARTISTA DE VOZ | PERFORMER" repetido por cuarta vez | Es el cuarto lugar donde aparece el mismo tic |

**Presupuesto de alturas objetivo (desktop):** hero 900 · bio ≤ 1 500 · filmo ≤ 1 500 · reel ≤ 1 600 ·
galería 1 600–1 800 · ficha ≤ 1 300 · contacto ≤ 800 · footer 90 → total **≈ 10 900 px**, contra 10 957 de
hoy, pero repartido en piezas parecidas en vez de 610 / 2 797.

---

## 4. La galería (lo que más cambia)

**Hoy:** 6 fotos en 3 columnas de 385 px, sección de 1 202 px, 96 px de ancho sin usar.

**Propuesta — mosaico a sangre:**

1. **Apertura:** una foto a **ancho completo del viewport** (1440 px, ~72vh de alto, recorte 16:9), sin marco
   ni tarjeta. Es el golpe de impacto que hoy no existe.
2. **Mosaico:** 5 piezas más con proporciones alternadas 4:5 y 3:2, en 2 columnas grandes (≈ 640 px cada una)
   ocupando los 1300 px completos, gap de **8 px** (hoy 24): las fotos se leen como un contact sheet, no como
   una cuadrícula de tarjetas.
3. **Hover:** zoom sutil (1.03) + la descripción real del `alt`, no el chip "#01" que no aporta información.
4. **Cierre:** contador de las 34 y botón al lightbox ("Explorar las 34 fotos"), que ya funciona por teclado.

**Criterio:** la primera foto ≥ 1 400 px de ancho; ninguna pieza por debajo de 400 px; sección ≥ 1 500 px y
≤ 1 800 px; las 34 siguen en 200.

---

## 5. Fases y compuertas

Ejecución por fases con visto bueno entre cada una (como pediste), y **nada se da por bueno sin captura**.

| Fase | Contenido | Compuerta |
|:---|:---|:---|
| **F3-A** | Sistema de diseño (tokens, escala, `.section-head`, retiro de orbes/reveals) + **Hero** desktop | Capturas hero claro y oscuro a 1440. Si el hero no te gusta, no seguimos |
| **F3-B** | Biografía (línea temporal) + Filmografía + Demo Reel | Capturas por sección + alturas medidas ≤ 1 600 px |
| **F3-C** | Galería (mosaico) + Ficha + Contacto + Footer | Capturas por sección + contador de ancho usado |
| **F3-D** | Verificación desktop completa + comparativa antes/después | Peso, LCP, contraste AA, teclado, 34/34, alturas. Build verde |
| **F4** | Móvil | Se abre solo cuando apruebes el desktop |

Cada fase termina con: `npm run build` verde, capturas en `docs/rediseno/evidencia/` y una tabla de medidas
del script de verificación. Ninguna fase toca más de lo que declara.

---

## 6. Criterios de aceptación (desktop)

| Métrica | Hoy | Objetivo | Verificación |
|:---|---:|---:|:---|
| Tamaños de fuente distintos | 29 | **≤ 8** | histograma computado (script §7) |
| Paddings de sección distintos | 3 (40/64/96) | **1** | computed style de las 6 secciones |
| Desviación de altura entre secciones | 610 ↔ 2 388 | **≤ 1 600 todas** | bounding boxes |
| Ancho sin usar en galería | 96 px de 1300 | **0** (a sangre) | bounding boxes |
| Foto más ancha de la galería | 795 px | **≥ 1 400 px** | bounding boxes |
| Familias cargadas | 3 (1 sin uso) | **2** | `<link>` + elementos computados |
| Momentos de motion autónomo | 4 (orbes, rotación, reveals, slowZoom) | **0** | revisión de CSS/JS |
| Peso inicial móvil | 0.93 MB | **≤ 0.93 MB** (no subir) | script de red |
| Galería 34 fotos | 34/34 | **34/34** | HTTP 200 |
| Textos informativos AA | cumple | **cumple** | contraste calculado |
| Peso tras scroll | — | **≤ 6 MB** | script de red |

Se conservan además: `prefers-reduced-motion`, navegación por teclado de galería y filmografía, lightbox con
trampa de foco, OG/Twitter/canonical/`og-image`, `robots.txt`, `sitemap.xml`, JSON-LD `Person`.

---

## 7. Verificación (reproducible)

```bash
cd "/home/mvgn/Proyectos/NICO CAPETILLO PORTFOLIO/PRESS-KIT-NICOL-S-CAPETILLO/nicolas-astro"
npm run dev -- --port 4321 --host          # 200 OK
npm run build                               # debe dar verde
node /tmp/opencode/redesign/measure.js      # tamaños, paddings, alturas, galería
node /tmp/opencode/redesign/measure2.js     # espacio muerto, geometría de galería y reel
node /tmp/opencode/shot.js                  # capturas desktop claro/oscuro + móvil
node /tmp/opencode/gate-p0.js               # peso + LCP + terceros
```

*(Los scripts viven en `/tmp/opencode/redesign/`. Si los quieres versionados, se copian a
`tools/verificacion/` en la fase F3-D.)*

---

## 8. Qué NO se toca

- **El contenido**: copy, 34 fotos, 3 films, 2 clips, datos, contactos, IDs, enlaces.
- **El lockup del nombre** (Archivo 900 a dos líneas): es la firma del sitio.
- **La fotografía en B&N como sistema.**
- **Las ganancias técnicas de F2** (§1.4).
- **La Ficha Técnica como layout** (8/10): se alinea al sistema, no se rediseña.
- **Producción** (`main` / Vercel) hasta que apruebes el desktop completo.

## 9. Riesgos y decisiones abiertas

1. **Rotación del retrato del hero:** el plan la retira (un retrato fijo y grande). Si la quieres conservar,
   se puede mantener con **3 fotos curadas y sin bucle infinito**. Decisión del operador.
2. **Acento `--signal` rojo claqueta:** es la única adición cromática a un sitio hoy 100 % acromático. Si lo
   rechazas, la paleta se mantiene neutra y el resto del plan no cambia.
3. **Galería a sangre:** implica recortar las fotos al formato del mosaico (`object-position` por foto, como
   ya se hizo en el hero) y perder el encuadre completo en las piezas del mosaico. El lightbox conserva el
   original íntegro.
4. **Punto de retorno:** `wip/pausa-overhaul` (214fbc6) = todo el trabajo de F2 tal como quedó. `main`
   (187a68e) = producción. Ninguno de los dos se toca.

---

---

## 10. Estado de ejecución

### F3-A — EJECUTADO (compuerta pendiente)

| Qué | Resultado |
|:---|:---|
| Sistema | 7 pasos tipográficos, `--section-pad` único, `.section-head` único, `.reveal` inerte (observador retirado) |
| Fuentes | `<link>` con **2** familias (Archivo 600-900 + Inter 400-600); Space Grotesk fuera |
| Canvas ambiental | `FluidBackground.astro` **eliminado** (import + componente) |
| Hero | Reescrito: retrato **658×745** a sangre por el borde derecho (antes 400×533), 3 fotos curadas con placas 01/02/03, sin orbes, sin rotación, botón primario en `--ink` |
| Ritmo | **86 / 86 px en las seis secciones** (antes 0 / 24 / 40 / 64 / 96) |
| Títulos | Todos los `h2` a **44 px** (antes ya eran 45, pero cada sección los sobreescribía en color y borde) |
| Peso inicial | **0.93 MB** móvil · 46 reqs — sin regresión. LCP 736 ms móvil / 760 ms desktop |
| Consola | 0 errores. Sin scroll horizontal (el sangrado del retrato no desborda) |
| Teclado | Placas 01/02/03 operables con Tab + Enter, `aria-pressed` correcto |
| Tamaños de fuente | **31** (subió de 29: el hero aporta la escala nueva; los 7 sueltos de bio/filmo/reel/galería/ficha/contacto se retiran en F3-B y F3-C) |
| Pendiente | `bio 2837`, `reel 2428`, `galería 1242` siguen fuera del presupuesto → F3-B y F3-C |

Evidencia: `docs/rediseno/evidencia/f3-a/` (hero claro 01/02/03, hero oscuro, página completa) y
`docs/rediseno/evidencia/baseline/` (antes).

### Hero — lettering, revisión 2 (a petición del operador: «en desktop se siente apretado»)

Solo tipografía. La estructura, el retrato a sangre y las placas no se tocaron.

| Medida | v1 | **v2** |
|:---|---:|---:|
| Tamaño del lockup (`--fs-display`) | 136 px | **124 px** |
| Interlineado | 0.82 | **0.90** |
| Tracking | -0.035 em (-4.76 px) | **-0.02 em (-2.48 px)** |
| Hueco visual entre las dos líneas | 13.5 px | **22.5 px** |
| Hueco título → subtítulo | 23 px | **29 px** |
| Hueco subtítulo → descripción | **8 px** | **16 px** |
| Ancho del texto más largo («Capetillo») | 616 px | **578 px** |
| Aire hasta el borde de la columna | 69 px | **107 px** |
| Alto del hero | 900 px | **900 px** (sin cambios) |

El alto del hero no cambió: el tipo baja 12 px y el interlineado sube justo lo necesario para absorberlo.
El hueco de 8 px entre subtítulo y descripción era el punto más apretado del bloque y se dobló.

### Hero — revisión 3 (a petición del operador: «aún hay mucho espacio arriba del texto», kicker pequeño, 2025→2026)

| Qué | Antes | **Ahora** |
|:---|:---|:---|
| Kicker «Press Kit» | flotante en absoluto, **12 px** | **en flujo dentro del bloque, 18 px** (`--fs-index`), «Press Kit · **2026**» |
| Lockup del nombre | 124 px | **136 px** con el interlineado suelto (0.90 / -0.02 em) |
| Hueco kicker → nombre | 246 px (kicker arriba, nombre abajo) | **27 px** |
| Espacio sobre el nombre (del arranque del bloque al capuchón de «Nicolás») | 258 px | **147 px** (kicker 193→224 + 27 px de hueco) |
| Reparto del sobrante | todo el hueco acumulado arriba | **125 px arriba / 125 px abajo** = 89 + 36 de padding (bloque centrado) |
| Columna de texto | 685 px | **694 px** (gap de la rejilla 57.6 → 40 px) |
| Aire del lockup hasta el borde | 69 px | **59 px** |
| Alto del hero | 900 px | **900 px** |

**Fila de datos del hero, reescrita.** Fuera las categorías que el operador rechazó (Netflix / 4 idiomas / GDL /
«Disponibilidad nacional e internacional»). Ahora, cuatro datos con **hover** (el texto sube a tinta y se dibuja
una regla de acento de 1 px debajo), todos tomados de `nicolas.json`:

1. `El Centauro del Norte · Netflix`
2. `Campeón Gabacho · En Post-Producción`
3. `Guadalajara · Ciudad de México, MX`
4. `Representación: Mimi Carrillo`

La fila sigue en **una sola línea** (borde derecho en 1276 de 1400 disponibles). Hover verificado en el render:
`color` pasa a `#0d0d0d`, la regla a `#b23a2e` y `scaleX` de 0 a 1.

**Ciudades base (nuevo dato de contenido, pedido por el operador).** `personal.bases` = `["Guadalajara",
"Ciudad de México"]` + `baseCountry: "MX"` en `nicolas.json`, como fuente única. Se muestra en el hero, en los
datos rápidos de Biografía, en la Ficha Técnica y en el JSON-LD (`homeLocation` + `workLocation`), que antes
solo declaraba Guadalajara.

**2025 → 2026.** Actualizado: el kicker del hero, `demoReel.mainTitle` («Demo Reel 2026»), el `alt` de la
miniatura del reel y su etiqueta de crédito. El pie de página ya calculaba el año en tiempo de build y muestra
2026. **No se tocaron las fechas históricas**: el periodo `2025` de la cronología y el año `2025` del crédito de
Campeón Gabacho, porque describen hechos ocurridos y cambiarlos falsearía el historial.

**Nota de herramienta:** el servidor `astro dev` sirvió dos veces CSS cacheado de `Hero.astro` (los cambios no
aparecían hasta reiniciarlo). Verificar con captura y medida después de cada reinicio, no antes.

### Sección CONTACTO — EJECUTADO (adelantado de F3-C a petición del operador)

Revisión 2, tras el «no me convence» del operador: fuera la estructura de 2 columnas y fuera las filas tipo
tabla (`Ver` / `Descargar`). El bloque pasa a **tres tarjetas contenidas** y el descargable, a botón.

| Qué | Antes (original) | v1 descartada | **v2 entregada** |
|:---|:---|:---|:---|
| Alto de la sección | 610 px | 785 px | **650 px** |
| Ritmo | padding 40 / 40 (único fuera del sistema) | 86 / 86 | **86 / 86** (el del sistema) |
| Estructura | 3 tarjetas de vidrio flotantes | bloque de 2 columnas con 6 filas de 1px | **3 tarjetas de 385 px** en rejilla de 1204 px |
| Vidrio / gradientes dentro de la sección | 4 elementos | 0 | **0** |
| Enlaces | 8 en tarjetas separadas | 10 | **10**: Directo (correo · teléfono · Instagram · WhatsApp) · Representación (correo · teléfono · agencia) · Material |
| Acción principal | tarjeta-fila de descarga | fila de tabla `Descargar` | **botón invertido en tinta** (156 × 44) |
| Divisor Contacto→Footer | barra de gradiente de 2 px | retirado | **retirado** |
| Foco de teclado | contorno por defecto del navegador | `--signal` | **`--signal` #b23a2e** (2px), ambos temas |
| Errores de consola | 0 | 0 | 0 |

Las tres tarjetas miden 385 px cada una dentro de una rejilla de 1204 px: **no se estiran a lo ancho de la
página** (la versión descartada repartía filas sobre los 1300 px completos). El descargable sigue apuntando
al enlace de OneDrive que ya existía (H-16 abierto); **no se añadió la ficha PDF** porque no existe todavía.

Evidencia: `docs/rediseno/evidencia/f3-contacto/` (antes, después claro, después oscuro, página completa).

### Números de sección — EJECUTADO (global, a petición del operador)

Los números de índice de las seis secciones pasan de **12 px a 18 px**: `--fs-index: 1.125rem` en
`global.css`, un solo valor para todo el sitio. Verificado en el render: `01`…`06` a 18 px. El `02` de
Filmografía conserva su color propio por ser sección siempre oscura.

### Pendiente de F3-B y F3-C

- Biografía **2 837 px** y Demo Reel **2 428 px** siguen sobre el presupuesto de 1 600 px → F3-B.
- Galería en 1 242 px con 3 columnas de 385 px → F3-C.
- Tamaños de fuente distintos: **31** → baja a ≤ 8 con F3-B y F3-C.

---

*Plan producido bajo protocolo MVGN · NYX v5.3 · Modo SOLO · Blackboard: `.mvgn/blackboard/state.json`*
*Crimson Nexus Corporation · MVGN Labs · Node MX-03*
