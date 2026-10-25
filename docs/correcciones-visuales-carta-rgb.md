# Correcciones visuales: carta protagonista y sobres RGB

## Alcance

Cambios exclusivamente de presentación. No se modificaron las reglas, el estado de dominio, la selección, la eliminación, la confirmación del ganador ni el reinicio. No se instalaron dependencias, no se hicieron commits y no se inició ningún servidor de desarrollo.

## Archivos creados

- `src/features/elimination/components/PackArtwork.jsx`: grafismo SVG y definiciones de foil compartidos por sobres cerrados y rasgables.
- `src/features/elimination/components/PackAppearance.css`: estilos del SVG y glow lateral RGB del sobre rasgable.
- `docs/correcciones-visuales-carta-rgb.md`: este informe.

Como herramientas locales de validación, se creó `.tooling/visual-protagonist-check.mjs` y se guardaron capturas y hashes en `.tooling/`, carpeta ya excluida de Git. Los artefactos de `graphify-out/` se regeneraron mediante Graphify, sin editarlos manualmente.

## Archivos modificados

- `RevealPack.jsx`: mantiene la carta y el sello en `result`, `retiring` y `ready`; ajusta desplazamiento y escala del resultado.
- `RevealModal.css`: tamaño del escenario, posición del sobre, capas y composición del sello; atenúa el foil y sus luces cuando aparece el resultado.
- `TornPack.jsx`: reutiliza el grafismo común; conserva el contorno del rasgado, la separación de piezas y su animación.
- `Pack.jsx`: sustituye la cara anterior por el SVG común, conservando el botón, accesibilidad, selección y eventos existentes.
- `GameBoard.css`: elimina estilos del frontal anterior y el barrido redundante; conserva dimensiones, hover y glow del botón.
- `WinnerScreen.jsx`: el nombre accesible permanece disponible, mientras la carta concentra la presentación visible del ganador.
- `FinalRound.css`: amplía el área principal del ganador, mejora el acabado de su carta y evita recortar el nombre largo del segundo lugar; elimina estilos del frontal anterior.

Todos estos archivos de implementación pertenecen a `src/features/elimination/components/`.

## Reveal normal y final

La secuencia continúa preparando, rasgando, desprendiendo la parte superior, extrayendo y girando la carta. Al mostrar el resultado, la carta aumenta de tamaño y queda centrada horizontalmente en el área principal. Conserva esa misma pose hasta la acción explícita del usuario.

La secuencia y sus tiempos no se modificaron. Las fases existentes `retiring` y `ready` ya no ocultan la carta en el componente de presentación. CONTINUAR y VER RESULTADO conservan sus condiciones de disponibilidad y callbacks.

El canal de extracción permanece recortado durante la salida; al revelar, pasa por encima del frontal del sobre. El foil abierto queda al 18 % de opacidad. El sello aparece debajo de la carta y continúa visible al habilitarse el botón, sin cubrir el nombre.

## WinnerScreen

El panel principal ocupa más espacio que el resumen. La carta utiliza la misma pose estable del resultado, con borde luminoso, fondo oscuro y una sombra que la separa del escenario. Se oculta la envoltura para dar protagonismo al ganador.

El panel derecho conserva segundo lugar e historial. El nombre del finalista puede ocupar varias líneas sin el recorte vertical anterior. NUEVA PARTIDA permanece debajo de la carta. En móvil los paneles se apilan.

## Familia de sobres y RGB

`PackFoilArtwork` conserva el diseño frontal del sobre rasgable: foil oscuro, sellados estriados, marco geométrico, emblema y tipografía. `Pack` muestra el grafismo completo cerrado; `TornPack` recorta ese mismo grafismo en las dos piezas existentes. La ronda final usa `Pack`, por lo que hereda el diseño sin duplicación.

El contorno SVG utiliza un gradiente vertical con rojo, naranja, verde, cian, azul y violeta. El sobre rasgable suma dos líneas laterales estrechas con gradiente animado y desenfoque; el botón cerrado conserva su halo RGB animado. El cuerpo del sobre permanece oscuro. La preferencia de movimiento reducido desactiva la animación de las luces.

Los haces ambientales azul/rojo de la ronda final se conservaron: la sustitución RGB se aplica a la identidad del sobre, sin alterar los efectos de carga ya existentes.

## Validación

- `npm run lint`: correcto, código de salida 0.
- `npm run build`: correcto, código de salida 0.
- `npm test`: 11 pruebas existentes aprobadas.
- Navegador Edge sin interfaz, con interceptación de peticiones hacia el build local: correcto, sin errores de página y sin iniciar servidor.
- Comprobaciones en 1920×1080, 1366×768 y 390×844: carta contenida en su escenario, centrada, sin overflow horizontal; nombres largos legibles; sellos y botones fuera del área de la carta.
- Carta persistente tanto durante el resultado como después de habilitar CONTINUAR; historial sin cambios antes de confirmar.
- Giro de ruleta con teclado y arrastre: correcto; arrastrar no selecciona un sobre.
- Hover: conserva la elevación del sobre.
- Selección final manteniendo Enter: correcto; ganador e historial permanecen disponibles después de confirmar.
- NUEVA PARTIDA y revelación con movimiento reducido: correctos.
- Hashes SHA-256 de `useEliminationGame.js`, `revealSequence.js`, `useFinalCharge.js` y `shuffle.js`: idénticos antes y después.

Alturas aproximadas de las cartas, medidas en el navegador:

| Vista | 1920×1080 | 1366×768 | 390×844 |
| --- | ---: | ---: | ---: |
| Reveal listo para continuar | 487 px | 346 px | 380 px |
| Revelación final lista | 635 px | 406 px | 429 px |
| WinnerScreen | 495 px | 352 px | 387 px |

Se inspeccionaron capturas del reveal, tablero, ganador y revelación final móvil. Las capturas están en `.tooling/visual-*.png`; el script permite repetir las comprobaciones después de generar el build.

## Graphify

Consulta inicial realizada sobre RevealPack, TornPack, RevealModal, FinalReveal, WinnerScreen y Pack. Graphify confirmó el uso compartido de RevealPack por la revelación normal, final y pantalla del ganador.

`graphify update .` final: correcto, 166 nodos, 327 relaciones y 11 comunidades, mediante extracción de código sin LLM. Se actualizaron `graph.json`, `graph.html` y `GRAPH_REPORT.md`.

Camino verificado con `graphify path Pack TornPack --undirected`:

`Pack → PackArtwork → PackFoilArtwork ← TornPack`

Las relaciones están marcadas como EXTRACTED. Graphify no clasifica los CSS en esta extracción; sus capas, posiciones y efectos se verificaron directamente en el navegador. La primera actualización avisó de cambios en comunidades y nombres derivados de sus hubs; no se solicitaron etiquetas mediante LLM ni análisis semántico adicional.

## Decisiones técnicas

Se reutilizó el SVG existente en un componente propio de la funcionalidad, sin moverlo a `shared/`: su responsabilidad pertenece al juego. Se ajustó el resultado visual conservando el árbol de extracción y los temporizadores. Las dimensiones dependen del escenario mediante unidades de contenedor y se limitan por ancho, para mantener la carta dentro del layout en móvil.

El proyecto estaba íntegramente sin seguimiento en Git al comenzar la tarea. Se mantuvo ese estado y no se añadieron archivos al índice.
