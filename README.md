# Pack Elimination

Aplicación React + Vite en JavaScript. Fase 7: diseño visual y presentación; preparación de la partida con
opciones individuales o por líneas, eliminación y validación de duplicados.
Se necesitan al menos 3 opciones. Al comenzar se mezclan con Fisher-Yates y se
crean sobres internos con UUID y se muestran cerrados alrededor de una mesa ovalada.
La profundidad controla el tamaño y el orden de superposición; el hover ofrece
feedback visual. Seleccionar un sobre inicia la revelación animada. CONTINUAR
elimina únicamente ese sobre y añade su opción al historial. Con dos sobres
restantes se muestra la ronda FINAL: el sobre elegido contiene al ganador.
Después de la apertura especial, VER RESULTADO confirma el paso a WINNER.
NUEVA PARTIDA vuelve a SETUP conservando la lista de opciones.

## Uso

Con Node.js compatible con Vite y npm disponibles:

```sh
npm install
npm run lint
npm run build
npm run dev
```

El servidor de desarrollo debe iniciarlo manualmente el usuario.

## Estructura

```text
src/
  app/App.jsx
  features/elimination/
    components/
    hooks/
    utils/
    constants/
  shared/
    components/
    styles/
  main.jsx
  index.css
```

`SetupScreen` presenta el formulario y conserva el texto de los campos.
`useEliminationGame` gestiona opciones, sobres activos y estado de la partida.
`normalizeOptions` y `shuffle` contienen las transformaciones de las opciones.
`App` compone preparación, tablero, revelación, FINAL y WINNER según el estado de la partida.
`GameBoard` consume los sobres activos sin generar ni mezclar opciones.
`calculatePackPositions` calcula posiciones porcentuales sobre una elipse,
escala por profundidad y densidad, y z-index. `Pack` solo recibe una posición
y un número: el contenido oculto nunca se pasa a su interfaz.
Las carpetas compartidas reservadas contienen `.gitkeep`.
Consultar `AGENTS.md` antes de modificar la arquitectura.

## Revelación (Fase 5)

Se utiliza `motion` (Motion para React, importado desde `motion/react`), la
alternativa oficial actual de Framer Motion: https://motion.dev/docs/react-installation.
No se añadieron otras dependencias visuales directas.

`RevealModal` coordina hitos visuales locales: entrada (0 ms), apertura (500 ms),
salida de carta (1000 ms), giro (1650 ms), sello ELIMINADA (2250 ms) y CONTINUAR
(2550 ms, con un fundido de 150 ms). `RevealPack` representa el foil original,
el sello superior que se separa y la carta que sale mediante desplazamiento,
máscara y escala antes de girar 180 grados. Los estilos usan dimensiones
adaptables con `clamp()` y `svh`, orientadas a 1920×1080 y 1366×768.

Durante REVEAL el tablero está desactivado e `inert`, detrás de un overlay
oscuro con blur. El diálogo conserva el foco y anuncia el resultado.
`useReducedMotion` muestra directamente la carta frontal, ELIMINADA y CONTINUAR
sin esperar la secuencia. Los temporizadores solo cambian presentación y se
limpian al desmontar; no dependen de callbacks de animación. El botón bloquea
clics repetidos y llama a la misma `continueAfterReveal()` existente.

La opción permanece en los sobres activos y fuera del historial hasta CONTINUAR.
La inspección visual debe realizarse manualmente iniciando el servidor.

## Ronda final y resultado (Fase 6)

`useEliminationGame` añade `selectFinalPack(id)`, `confirmWinner()` y `resetGame()`.
La selección solo es válida en FINAL con exactamente dos sobres y un ID activo.
Las actualizaciones funcionales comprueban la selección anterior, de modo que
la primera elección válida se conserva incluso ante clics rápidos o handlers
anteriores. `finalSelectedPack` es la única fuente del resultado: `winner` se
deriva de `finalSelectedPack.option`, sin duplicar estado. Ambos finalistas y el
historial permanecen intactos hasta el reinicio.

`FinalRound` presenta dos sobres grandes, iluminación y feedback al elegir.
`Pack` sigue recibiendo únicamente ID, posición y número, sin contenido oculto.
`FinalReveal` coordina fases locales: centrado, apertura, salida de carta, giro,
GANADOR y VER RESULTADO. Reutiliza `RevealPack` con `mode="winner"`, conservando
la estructura de apertura y carta, con estilos carbón, azul/rojo y celebración moderada.
Los temporizadores solo cambian la presentación; únicamente la acción explícita
`confirmWinner()` cambia FINAL a WINNER. Con movimiento reducido, el ganador y
la acción se muestran directamente. Los temporizadores se limpian al desmontar.

`WinnerScreen` muestra el nombre exacto de `winner` y la carta sin repetir la
apertura. NUEVA PARTIDA limpia sobres, historial y selecciones, con lo que también
limpia el ganador derivado. La lista `options` se conserva y puede editarse en
SETUP. `startGame()` vuelve a mezclarla y genera nuevos UUID en cada partida.
El resultado también presenta todas las eliminaciones reales, en orden, sin incluir artificialmente al finalista no seleccionado.

## Graphify

```sh
graphify extract . --code-only
```

El mapa usa análisis local del código, sin requerir una API de modelos.
`graphify-out/` se ignora en Git porque contiene artefactos regenerables.

## Entorno de Codex

Si npm no está en PATH, esta inicialización dispone de una copia local en
`.tooling/` (ignorada en Git). Desde PowerShell, en esta carpeta:

```powershell
node .tooling/node_modules/npm/bin/npm-cli.js run dev
```

En otra máquina, instalar Node.js con npm y usar los comandos normales anteriores.

## Diseño e interacción visual (Fase 7)

La paleta está centralizada en `src/index.css`: blanco ligeramente grisáceo
(#f7f8fa), carbón (#191c22), negro (#0d1016), azul (#2563eb / #79a9ff)
y rojo (#dc3545 / #f68a95). Setup tiene fondo claro y formulario oscuro;
los estilos del formulario están junto a `SetupScreen`.

`StageBackground` deriva su tema de `activePacks.length`, mediante
`getVisualStage`: más de 8 = midnight, 5–8 = azul/carbón, 3–4 = borgoña/carbón,
2 = final negra con iluminación azul/roja. Motion cruza las opacidades en
1,2 segundos; no se crean estados de juego ni pantallas intermedias.

Los sobres comparten un diseño negro: borde RGB con gradiente animado,
pseudo-elemento para glow y reflejo móvil discreto. El hover eleva el sobre
e intensifica su iluminación. La apertura reutiliza esa identidad e incorpora
una onda y rayos breves, sin cambiar los hitos ni la confirmación existentes.

`GameBoard` guarda exclusivamente un offset angular visual. Arrastrar en
horizontal más de 8 px activa la captura del puntero; el click posterior se
suprime en la fase de captura. Un gesto pequeño selecciona normalmente.
La cancelación del puntero termina el gesto; una nueva pulsación lo reinicia.
No hay inercia: el giro se detiene al soltar. Las flechas también giran el
tablero cuando este tiene foco. `calculatePackPositions` acepta el offset y
recalcula posición, escala y z-index sin alterar IDs, opciones ni orden.
El tablero permanece montado entre PLAYING y REVEAL para conservar el giro.

`EliminationHistory` muestra todas las eliminaciones en un único panel derecho,
en filas compactas numeradas 01, 02, etc. Conserva el orden del array original.
La lista tiene altura limitada y scroll interno, también en FINAL y en pantallas
estrechas. La mesa aprovecha el espacio libre de la izquierda.
`WinnerScreen` reutiliza la lista y muestra el array completo en orden;
el ganador sigue siendo el elemento central y más luminoso.

En FINAL, hover o foco elige una de cinco frases rotativas al entrar al sobre,
sin cambiarla mientras se permanece en él; el otro sobre se oscurece.
Todo ese estado es local a `FinalRound`. No afecta al resultado.

`SetupBackground` conserva 14 nodos decorativos azules, rojos y grises pastel.
Sus configuraciones estables varían tamaño, posición, rotación, oscilación,
duración (28–39 segundos) y desfase inicial. Motion repite la caída desde arriba
hasta debajo del viewport. El fondo está recortado, detrás del formulario y no
recibe eventos. Con movimiento reducido las cartas quedan estáticas y visibles.

En FINAL, un haz azul entra desde el borde izquierdo y uno rojo desde el derecho.
Hover/foco muestra una previsualización parcial. Mantener el botón principal,
touch, Espacio o Enter durante 1,5 segundos hace avanzar el haz hasta el centro.
Un click rápido cancela. Soltar, salir del sobre, cancelar el pointer, perder el
foco o esconder la pestaña detiene la carga y devuelve suavemente el ambiente
al hover. El controlador de `useFinalCharge` es exclusivamente de presentación:
no incorpora estados a `gameStates` ni cambia `useEliminationGame`.

La primera carga completa bloquea sincrónicamente nuevas cargas y llama una sola
vez al callback existente `selectFinalPack`. El color elegido supera ligeramente
el centro con un pulso moderado; el contrario se atenúa. Continúan `FinalReveal`
y `RevealPack` con su secuencia original. Con movimiento reducido se mantiene
la duración funcional y un relleno sencillo, sin escalas ni pulso expansivo.
`npm run test` comprueba duración, cancelación, teclado, exclusión de cargas
simultáneas, limpieza y bloqueo de reentrada con el runner nativo de Node.

`prefers-reduced-motion` detiene RGB y reflejos, elimina desplazamientos de
hover y efectos de apertura, y muestra la revelación directamente con los
controles disponibles. La paleta RGB sigue visible como gradiente estático.
La ruleta sigue siendo manual y se detiene inmediatamente.

Validación: lint, build, `npm run test` y las comprobaciones funcionales locales
existentes de fases 4/6. `.tooling/phase8-check.mjs` adapta la regresión visual
de fase 7 al historial compacto y a la selección sostenida. Este archivo local
usa Edge headless y sirve el build por interceptación de peticiones, sin iniciar
un servidor: partida completa con 16 opciones, umbrales visuales, giro en ambos
sentidos, drag desde un sobre, clicks pequeños, selección por teclado,
revelación normal/reducida, orden de 14 eliminaciones, ganador y reinicio.
También comprueba 20 opciones y ausencia de desbordamiento horizontal en
1920×1080, 1366×768 y 390×844. `.tooling/phase8-interaction-check.mjs`
comprueba caída continua, cartas estáticas con movimiento reducido, haces de
ambos lados, cancelación tras 0,5 segundos, salida del pointer, pérdida de foco,
carga completa con mouse y teclado y continuidad de la apertura existente.
La revisión estética final es manual.

No se modificaron `useEliminationGame`, `shuffle`, `normalizeOptions`,
`gameStates` ni las reglas de selección o eliminación. No se añadieron
paquetes, backend ni commits. Graphify analiza relaciones del código;
los estilos CSS y el aspecto visual requieren verificación independiente.

## Modo imágenes e inercia de la ruleta

El setup permite alternar entre texto e imágenes conservando una selección
independiente por modo. La ruleta incorpora inercia suave al terminar un drag.

Coloca las imágenes en `src/assets/image-mode-library/`. Se aceptan PNG,
JPG/JPEG, WebP, AVIF, GIF y SVG. Reinicia Vite manualmente y recarga la página
después de añadir archivos; para producción, vuelve a generar el build.
El nombre del archivo se utiliza como etiqueta. No hay subida de archivos.

Consulta [la guía e informe de implementación](docs/modo-imagenes-e-inercia.md)
para el flujo, formatos, descubrimiento con Vite, validaciones y limitaciones.
