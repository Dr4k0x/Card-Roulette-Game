# Apertura rasgada y distribución de la ronda final

## Resultado y alcance

La apertura de eliminaciones y la selección ganadora comparten una secuencia de presentación: preparar, rasgar, retirar el sellado, extraer la carta, girarla, mostrar el resultado durante tres segundos y desvanecerla. El cuerpo abierto permanece visible. La ronda final utiliza todo el ancho disponible con dos paneles independientes.

Se leyó AGENTS.md y se inspeccionaron FinalRound, FinalReveal, RevealPack, RevealModal, WinnerScreen, sus estilos y useEliminationGame antes de editar. No se modificaron las reglas, la generación de opciones, la elección del ganador, confirmWinner, el historial ni la carga de 1,5 segundos. No se agregaron dependencias, backend, commits ni servidores.

## Herramientas evaluadas

Se consultó documentación oficial antes de implementar:

- [Motion: animación React](https://motion.dev/docs/react-animation) y [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion): transformaciones independientes, keyframes, animación SVG y adaptación al movimiento reducido. Se conserva Motion, ya instalado.
- [SVG clipPath](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/clipPath): recortes vectoriales. Se utilizan para dividir el mismo dibujo del foil en dos piezas.
- [CSS clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path): alternativa nativa viable; los paths SVG facilitan compartir el contorno exacto y dibujar el reflejo de rotura. El canal de extracción emplea clipping CSS mediante overflow.
- [GSAP MorphSVGPlugin](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/): permite transformar paths, pero esta apertura necesita separar dos piezas con un contorno estable. No aporta una mejora suficiente para introducir otro motor de animación.
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction): permite construir una escena Three.js. La extracción y la oclusión solicitadas se resuelven con capas SVG/HTML, sin Canvas ni escena 3D adicional.

La solución elegida es **SVG + clipping CSS + Motion**. No necesita máscaras alfa ni morphing de paths. El arte es vectorial propio; no se copiaron recursos de otros juegos.

## Responsabilidades y archivos

| Archivo | Cambio |
| --- | --- |
| `src/features/elimination/components/TornPack.jsx` | Nuevo envoltorio SVG, arte foil compartido, interior, frente, sección superior y reflejo progresivo de rotura. |
| `src/features/elimination/components/RevealPack.jsx` | Compone el envoltorio y la carta; extracción, giro, tipografía según longitud, sello y desvanecimiento. |
| `src/features/elimination/hooks/revealSequence.js` | Secuencia temporal de presentación y cancelación de todos sus timers. |
| `src/features/elimination/hooks/useRevealSequence.js` | Estado React de presentación compartido y preferencia de movimiento reducido. |
| `src/features/elimination/components/RevealModal.jsx` | Usa el hook compartido; conserva foco, diálogo, bloqueo de scroll y confirmación explícita de eliminación. |
| `src/features/elimination/components/FinalReveal.jsx` | Usa la misma secuencia con 700 ms previos para centrar; conserva VER RESULTADO y bloqueo de confirmación repetida. |
| `src/features/elimination/components/WinnerScreen.jsx` | Presenta una carta estática en `result`, porque `ready` ahora significa que la carta ya se retiró. |
| `src/features/elimination/components/RevealModal.css` | Capas, canal de extracción, dimensiones relativas al escenario, tensión foil y adaptación de nombres. Se eliminan estilos de la apertura anterior. |
| `src/features/elimination/components/FinalRound.css` | Márgenes y separación menores, ancho completo, proporción 3,5:1 y mejor uso de altura. Ajusta la carta estática de WinnerScreen. |
| `tests/revealSequence.test.js` | Prueba los tres segundos, la secuencia compartida, movimiento reducido y limpieza de timers. |

`FinalRound.jsx`, `useFinalCharge`, `finalChargeController`, `useEliminationGame`, `gameStates.js`, `App.jsx` y las dependencias permanecen intactos.

## Técnica de rasgado y extracción

`TEAR_EDGE` define una polilínea irregular en un viewBox de 100 × 160. Tiene picos, entrantes y tramos de distintas longitudes, sin dientes repetidos uniformemente. Ambos clipPaths parten de esa misma línea: uno se cierra hacia el extremo superior del sobre y el otro hacia el extremo inferior. Comparten coordenadas, arte y gradientes; los bordes coinciden antes de separarse.

Durante la tensión, el frente se deforma levemente y una línea luminosa recorre el contorno de izquierda a derecha. Después, la sección superior sube, se desplaza un poco lateralmente, gira 13 grados y se desvanece. El borde expuesto combina una sombra oscura y un filo plateado fino para sugerir el interior del material.

La profundidad utiliza cuatro capas: interior en z-index 1, canal y carta en 2, frente rasgado en 3 y sellado superior en 4. La carta comienza completamente dentro del sobre, por debajo de todo el contorno. El frente opaco cubre la parte que sigue dentro del envoltorio; el canal recorta las sombras laterales mientras se extrae. La carta asciende un 132% de su propia altura. Una vez completamente fuera, el canal permite mostrar la sombra completa, la escala aumenta a 1,12 y comienza el giro de 180 grados. No se sube la carta por delante del frente durante la extracción.

Se conserva la identidad negra, azul y roja. Los nombres largos reciben una fuente menor y más espacio vertical; nombres extraordinariamente extensos conservan scroll en el área de texto. El anuncio accesible incluye siempre la opción completa.

## Secuencia y tiempos

Tiempos desde el comienzo de la apertura normal:

| Inicio | Presentación |
| --- | --- |
| 0 ms | Entrada, presencia y brillo del foil. |
| 650 ms | Tensión y rasgado progresivo durante 450 ms. |
| 1100 ms | Desprendimiento superior durante 600 ms. |
| 1750 ms | Extracción vertical durante 850 ms. |
| 2650 ms | Giro de 180° durante 700 ms; crecimiento suave. |
| 3400 ms | Resultado completamente revelado. |
| 6400 ms | Desvanecimiento de la carta durante 400 ms. |
| 6850 ms | CONTINUAR disponible. |

La final agrega 700 ms de centrado: resultado a los 4100 ms y VER RESULTADO a los 7550 ms. Los tres segundos empiezan después del giro; no hay cuenta regresiva.

Con movimiento reducido se muestra inmediatamente el resultado, se omiten rasgado, extracción y giro amplios, y los botones están accesibles desde el principio. Si el usuario permanece, la carta se retira después de tres segundos con una transición de 200 ms.

Todos los timers se cancelan al desmontar o cambiar la preferencia de movimiento. Los callbacks programados solo reciben `setStage`; nunca eliminan opciones, cambian winner, confirman el ganador ni navegan. Los botones mantienen sus guardas para impedir acciones repetidas.

## Distribución final

El escenario ocupa aproximadamente 77,8% del ancho de los paneles y el historial 22,2%. Se elimina el límite anterior de 1740 px. Margen exterior y separación son de 8 a 16 px; el padding interior del escenario es de 12 a 20 px. La altura del escenario crece con el viewport y reserva espacio para encabezado y controles.

Hasta 900 px de ancho el historial se coloca debajo. Los paneles mantienen bordes, radios y fondos separados. El tamaño del sobre depende de la altura y anchura reales del escenario mediante unidades de contenedor, lo que conserva espacio para el fragmento y la carta completa.

## Validación

- `npm run lint`: correcto, sin errores.
- `npm run build`: correcto, 448 módulos compilados; sin nuevas dependencias.
- `npm test`: 11 pruebas correctas, incluyendo las 8 existentes de carga final y 3 nuevas de presentación.
- `node .tooling/phase8-domain-check.mjs`: correcto; reglas, ambas elecciones finales, IDs inválidos, 100 selecciones encoladas, confirmación explícita y reinicio.
- `node .tooling/phase8-interaction-check.mjs`: correcto; carga azul/roja, cancelación a 0,5 segundos, salida del puntero, pérdida de foco, teclado y movimiento reducido. Sin errores de navegador.
- `.tooling/tear-visual-check.mjs`: revisión de producción en Edge headless, con archivos de `dist/` interceptados directamente mediante Playwright. No se inició ningún servidor. Verifica carta inicialmente oculta, desprendimiento, extracción, giro, permanencia, desvanecimiento, historial exclusivamente al continuar, ganador correcto y navegación exclusivamente por botón.
- Tamaños revisados: 1920×1080, 1366×768, 800×700 y 390×844. Se verifican proporciones, separación de paneles, altura en escritorio, carta dentro del escenario y ausencia de overflow horizontal. Nombres de unas 60 letras se verificaron completos, sin scroll, en la eliminación y la final.
- Capturas revisadas: sobre cerrado, tensión, fragmento separado, extracción, resultado, layout de escritorio/móvil, ganador final y WinnerScreen. Se guardan en `.tooling/tear-*.png`, que permanece ignorado por Git.

## Graphify

Se ejecutó una consulta previa de los componentes y del hook del juego. El ejecutable existente funcionó fuera del sandbox; no se reinstaló Graphify ni se instalaron paquetes homónimos.

Tras los cambios se ejecutó `graphify update .`: **162 nodos, 313 relaciones y 10 comunidades** en la actualización final, incluyendo la navegación estructural del nuevo informe, sin llamadas LLM. La consulta posterior muestra que RevealModal y FinalReveal importan y llaman a useRevealSequence, y RevealPack compone TornPack. Los módulos nuevos no importan useEliminationGame y no añaden estados a gameStates. Las únicas acciones de juego permanecen en los handlers explícitos existentes.

Límites del grafo: Graphify omite CSS en su extracción y advierte sobre etiquetas de comunidades que cambiaron. Las relaciones de código están actualizadas; los estilos se verificaron directamente y en navegador. No se regeneraron etiquetas mediante LLM ni se editaron artefactos generados. `graphify-out/` sigue ignorado por Git.

## Límites visuales

El foil utiliza una aproximación vectorial en capas; no simula el doblado tridimensional del plástico. El contorno de rotura es determinista y se reutiliza entre aperturas. Se prioriza una rotura clara sin partículas adicionales ni efectos que tapen la extracción. No se midió el rendimiento en dispositivos de gama baja ni se verificaron Firefox y Safari. Los nombres de longitud extrema pueden necesitar scroll y las ventanas muy bajas pueden necesitar desplazamiento vertical. Las capturas automatizadas sirven para revisar momentos de la secuencia, no sustituyen una evaluación humana de su sensación física en movimiento.
