# Modo imágenes e inercia de la ruleta

## Uso de la biblioteca local

1. Coloca tus imágenes dentro de `src/assets/image-mode-library/`. Se admiten subcarpetas.
2. Formatos admitidos: PNG, JPG, JPEG, WebP, AVIF, GIF y SVG, con extensión en minúsculas o completamente en mayúsculas.
3. Si Vite está ejecutándose, detenlo y vuelve a ejecutar `npm run dev` manualmente después de añadir, quitar o renombrar archivos. Recarga la página. Así se garantiza que el catálogo se reconstruya; no dependas del comportamiento de HMR para descubrir archivos nuevos.
4. Selecciona **Jugar con imágenes** en el setup. Usa **Añadir** para incorporar una carta, o pulsa su imagen para ampliarla. La vista ampliada se cierra con su botón, Escape o el fondo.
5. Añade al menos tres cartas y pulsa **COMENZAR**. Puedes eliminar cartas de “Tus opciones” antes de comenzar.
6. Para un build publicado, añade primero las imágenes y vuelve a ejecutar `npm run build`. Copiarlas después del build no cambia el catálogo.

El nombre del archivo sin extensión es el label por defecto; guiones y guiones bajos se convierten en espacios. Por ejemplo, `mi-personaje_01.webp` se presenta como `mi personaje 01`. La ruta relativa completa identifica cada imagen: dos archivos en distintas subcarpetas pueden compartir nombre sin confundirse.

La carpeta se entrega vacía con `.gitkeep`, preparada para tus archivos. La interfaz explica cómo llenarla cuando no hay imágenes. No hay carga de archivos desde la UI, backend ni lectura de carpetas del sistema operativo.

## Implementación y compatibilidad

`imageLibrary.js` usa `import.meta.glob` de Vite, con `eager`, `?url` e importación del valor por defecto. Vite descubre los archivos al transformar el módulo y genera URLs compatibles con el build, incluyendo archivos con hash o recursos pequeños inline. La aplicación no enumera una carpeta en runtime.

Ambos tipos de opción tienen `id`, `type` y `label`. Las imágenes incorporan `imageSrc`. El hook de dominio no importa el catálogo, componentes visuales ni APIs de imágenes. Mezcla, selección, eliminación, final de dos sobres y confirmación del ganador siguen usando el mismo flujo. La normalización de nombres conserva el orden, ignora espacios y duplicados sin distinguir mayúsculas.

Cada modo conserva su selección independiente mientras la aplicación está abierta. Al cambiar de modo se guarda el borrador anterior y se recupera el del nuevo modo. Nueva partida conserva las opciones del modo utilizado y limpia sobres, eliminados y selección final. Recargar la página limpia el estado local, como antes.

El setup muestra únicamente los controles del modo activo. La galería usa cuatro columnas cuando hay espacio, se adapta a pantallas menores y tiene scroll interno. “Tus opciones” muestra mini cartas con previsualización y eliminación. Las imágenes ya añadidas tienen su botón deshabilitado para evitar duplicados.

`ImageCard` aporta marco fino, esquinas redondeadas, sombra, brillo suave y una base negra con líneas y emblema de rombo. La imagen utiliza `object-fit: contain` para verse completa; puede haber bandas con otras proporciones. Un recurso que no se puede decodificar muestra un mensaje de imagen no disponible.

Los sobres del tablero y de la final permanecen cerrados. La carta de imagen se utiliza en la cara revelada de la animación existente, sin sustituir el rasgado ni la secuencia. Permanece grande hasta continuar. El ganador muestra la carta grande y el segundo lugar una carta menor con label secundario.

El historial conserva el orden real de inserción: primera eliminación a última, numeradas desde 01. Tiene una línea vertical entre pasos y mini cartas en modo imágenes. El finalista que no gana aparece como segundo lugar, no como una eliminación inventada. Texto mantiene su contenido y recibe el mismo tratamiento de secuencia numerada.

## Física de la rueda

`useRouletteRotation` encapsula gestos, click, teclado y ciclo de animación. El umbral horizontal es de 8 px y exige predominio horizontal para permitir scroll vertical en dispositivos táctiles. Un click o movimiento menor no inicia inercia.

La velocidad angular se calcula a partir del desplazamiento horizontal y tiempo entre muestras, con suavizado. Al soltar se limita a ±4 rad/s. Si el usuario mantiene quieto el puntero más de 120 ms antes de soltar, no se aplica inercia.

`rouletteInertia.js` integra un damping exponencial de 5.6 por segundo mediante `requestAnimationFrame`. Su integración analítica mantiene el recorrido consistente entre tasas de cuadros; se limita el intervalo por cuadro a 50 ms para evitar saltos después de una pausa. La animación termina debajo de 0.012 rad/s, sin rebote ni giro eterno.

El click posterior a un drag real se suprime; una activación por teclado conserva su comportamiento. Un nuevo gesto, selección o flecha detiene la inercia. Cancelación del puntero, pérdida de captura, bloqueo del tablero y desmontaje cancelan el gesto o sus cuadros pendientes. Con movimiento reducido, el arrastre funciona sin inercia automática.

## Archivos creados

- `src/assets/image-mode-library/.gitkeep`
- `src/features/elimination/constants/imageLibrary.js`
- `src/features/elimination/utils/gameOptions.js`
- `src/features/elimination/utils/rouletteInertia.js`
- `src/features/elimination/hooks/useRouletteRotation.js`
- `src/features/elimination/components/ImageCard.jsx`
- `src/features/elimination/components/ImageCard.css`
- `src/features/elimination/components/ImageLibrary.jsx`
- `tests/optionsAndInertia.test.js`
- `docs/modo-imagenes-e-inercia.md`

## Archivos modificados

- `src/features/elimination/hooks/useEliminationGame.js`: opciones tipadas, selección por modo y adición de imágenes.
- `src/features/elimination/components/GameBoard.jsx`: integración del hook de rotación.
- `src/features/elimination/components/SetupScreen.jsx` y `SetupScreen.css`: selector de modo, galería y opciones visuales.
- `src/features/elimination/components/RevealPack.jsx`: cara de carta según tipo de opción.
- `src/features/elimination/components/RevealModal.jsx` y `FinalReveal.jsx`: anuncios con labels accesibles.
- `src/features/elimination/components/WinnerScreen.jsx`: ganador y segundo lugar visuales.
- `src/features/elimination/components/EliminationHistory.jsx` y `EliminationHistory.css`: secuencia y miniaturas.
- `README.md`: acceso a estas instrucciones.

Las herramientas y capturas de comprobación están en `.tooling/`, ignorado por Git. Los artefactos Graphify permanecen generados e ignorados. No se modificaron AGENTS.md, dependencias ni la composición de App.

## Validación

- `npm run lint`: correcto.
- `npm run build`: correcto, tanto con biblioteca temporal de prueba como con la biblioteca vacía final.
- `npm test`: 15 pruebas correctas, incluyendo normalización, identidad de imágenes, damping en ambos sentidos, recorrido independiente de cuadros, límite de velocidad y detención tras una pausa.
- Navegador Edge mediante Playwright ya disponible: partidas completas de texto e imágenes, deduplicación, selección, eliminación, modal/Escape, borradores separados, sobres cerrados, revelación, final, ganador, segundo lugar y reinicios. Sin errores JavaScript del navegador.
- Gestos: arrastre a izquierda y derecha, continuación después de soltar, detención progresiva, drag iniciado sobre un sobre sin selección accidental, flechas, movimiento pequeño que sigue siendo click y movimiento reducido sin inercia.
- Historial: miniaturas en orden real y numeración comprobada contra las cartas reveladas.
- Responsive: setup, tablero, reveal, final, historial y ganador en 1920×1080, 1366×768 y 390×844. Capturas inspeccionadas; sin desbordamiento horizontal. Se corrigió el ancho de la columna del segundo lugar al revisar las capturas.
- Ocho SVG temporales permitieron verificar descubrimiento y gameplay sin suministrar imágenes definitivas. Se retiraron después de las comprobaciones.

## Graphify

Se consultó el grafo antes de implementar y se regeneró con `graphify extract . --code-only`; también se ejecutó `graphify update .` al terminar. La revisión de imports se complementa con un recorrido directo de módulos JS/JSX para detectar ciclos y validar referencias del grafo. El catálogo depende de utilidades de datos; el hook de dominio depende de esas utilidades, no del catálogo ni de la UI. La inercia tiene un hook y cálculos propios.

El alcance del análisis AST no incluye CSS ni demuestra comportamiento de renderizado; este se verificó por separado en el navegador. No se usaron APIs de pago ni se editaron artefactos Graphify manualmente.

Resultado final: **220 nodos, 465 relaciones y 11 comunidades**. La comprobación directa de los **31 módulos fuente JS/JSX** no encontró dependencias circulares. El grafo no contiene nodos duplicados ni relaciones con extremos inexistentes. Graphify reasignó automáticamente los nombres de comunidades según sus nodos centrales; no se ejecutó el etiquetado semántico con LLM. El código está actualizado; los documentos nuevos no reciben análisis semántico en esta actualización AST.

## Límites

- Las referencias visuales mencionadas en el texto no estaban adjuntas; las cartas siguen la descripción escrita de marco, base negra y rombo.
- El catálogo se construye con Vite. Añadir imágenes exige reinicio/recarga en desarrollo o nuevo build en producción.
- No hay persistencia de selecciones tras recargar ni subida de archivos. Tampoco se añadió reordenamiento opcional.
- No se comprueban automáticamente dimensiones o peso de archivos: usa imágenes razonables para mantener fluida una biblioteca grande. La decodificación y formatos dependen del navegador; un GIF conserva su animación propia.
- Extensiones mezcladas como `.JpG` no entran en el patrón: usa `.jpg` o `.JPG`.
- La prueba visual utiliza imágenes de prueba; tus archivos reales pueden tener proporciones distintas y se mostrarán completos dentro del marco.

No se dejaron servidores activos ni se hicieron commits.
