# Revelación Sorpresa y configuración de inercia

## Resultado

Coexisten **Eliminatoria** y **Revelación Sorpresa**. El botón circular «Cambiar modalidad» aparece en la esquina superior derecha, fuera del panel, únicamente durante preparación. El nombre activo permanece visible y el cambio usa una transición de Motion. Cada modalidad conserva su propia preparación en memoria.

Eliminatoria conserva su mínimo de tres opciones, eliminación, final, ganador, historial y reinicio. Sus valores de inercia no se cambiaron.

Sorpresa utiliza fondo carbón, panel claro, texto oscuro y acentos azul y rojo mediante estilos locales. Permite texto o imágenes del mismo catálogo, descripciones opcionales editables y comenzar con una carta. No tiene máximo artificial, ganador ni historial. La preparación y el tablero admiten muchas cartas mediante desplazamiento vertical.

## Arquitectura y archivos

`src/app/App.jsx` compone ambas modalidades y mantiene el selector local. No contiene las reglas de Sorpresa ni agrega lógica a `useEliminationGame`.

Archivos nuevos de Sorpresa:

- `src/features/surprise/constants/surpriseStates.js`: fases y mínimo de cartas.
- `src/features/surprise/utils/surpriseState.js`: transiciones puras y contador derivado.
- `src/features/surprise/utils/snakePositions.js`: posición de cada carta en filas alternadas.
- `src/features/surprise/hooks/useSurpriseGame.js`: estado React y acciones de la sesión.
- `src/features/surprise/components/SurpriseSetup.jsx`: preparación, descripciones y catálogo compartido.
- `src/features/surprise/components/SurpriseBoard.jsx`: recorrido, selección libre y finalización.
- `src/features/surprise/components/SurpriseCard.jsx`: reverso y contenido revelado.
- `src/features/surprise/components/SurpriseReveal.jsx`: diálogo, carga y giro.
- `src/features/surprise/components/Surprise.css`: tema, cartas y distribución responsive.

Otros archivos nuevos:

- `src/app/ModalitySelector.jsx` y `ModalitySelector.css`.
- `src/features/elimination/config/roulettePhysics.js`.
- `tests/surpriseState.test.js`.
- Este informe.

Extracciones compartidas, con traslado de las implementaciones existentes:

- `src/shared/components/ImageCard.jsx` y `ImageCard.css`.
- `src/shared/components/ImageLibrary.jsx` y `ImageLibrary.css` (incluye `ImagePreview`).
- `src/shared/components/SetupLayout.css`: distribución realmente utilizada por ambas preparaciones.
- `src/shared/constants/imageLibrary.js`.
- `src/shared/constants/optionModes.js`: tipos de contenido comunes.
- `src/shared/utils/imageOption.js`.
- `src/shared/hooks/useHoldCharge.js` y `holdChargeController.js`: carga existente de 1500 ms, reutilizada por FinalRound y Sorpresa.

Los archivos anteriores de ImageCard, ImageLibrary, imageLibrary, useFinalCharge y finalChargeController dentro de Eliminatoria se trasladaron a `shared`; se actualizaron sus consumidores. `gameOptions.js` sigue exportando `imageOption` para mantener su API existente.

Archivos existentes modificados: `src/app/App.jsx`; dentro de Eliminatoria, `components/SetupScreen.jsx`, `SetupScreen.css`, `FinalRound.jsx`, `EliminationHistory.jsx`, `RevealPack.jsx`, `WinnerScreen.jsx`, `hooks/useRouletteRotation.js`, `utils/rouletteInertia.js` y `utils/gameOptions.js`; además de `tests/finalCharge.test.js`, cuyo import apunta ahora al controlador compartido. No se modificaron las reglas de `useEliminationGame` ni los archivos de imágenes del usuario.

No se agregaron dependencias, backend, almacenamiento persistente ni subida de archivos.

## Modelo y flujo de Sorpresa

Cada carta conserva `id`, `type`, `label`, `imageSrc` cuando corresponde, `description` y, durante la sesión, `revealed`. El contenido reutiliza el modelo de opciones existente; la descripción y el estado pertenecen exclusivamente a esta modalidad. Los IDs de texto se generan antes de despachar la acción; las imágenes conservan sus IDs del catálogo. No se mezclan las cartas al iniciar ni durante la partida.

1. La preparación mantiene borradores separados para texto e imágenes. Las descripciones pueden ocupar varias líneas; no son obligatorias.
2. Al comenzar se copian las cartas del borrador, todas con `revealed: false`.
3. El tablero distribuye cuatro columnas en escritorio, tres en anchuras intermedias, dos en móviles y una en ventanas muy estrechas. Las filas impares invierten el sentido, incluso si la última fila está incompleta. La numeración identifica el recorrido; el teclado sigue el orden lógico de cartas.
4. Cualquier carta oculta abre su reverso ampliado. El título, imagen y descripción no se renderizan en el DOM hasta revelarla.
5. Mantener presionado con Pointer Events, Espacio o Enter carga la revelación durante 1500 ms. El progreso aumenta el brillo y el halo. Soltar, salir del botón, perder foco, cambiar la visibilidad o cerrar cancela la carga.
6. El controlador compartido bloquea las activaciones repetidas antes del callback. El reducer exige que la carta a revelar sea la seleccionada; cerrar una carta antes de completar no la revela.
7. Completar marca únicamente esa carta como revelada. Motion realiza el giro 3D y el destello; las preferencias de movimiento reducido desactivan el movimiento físico.
8. Cerrar o pulsar Escape devuelve la carta al recorrido con su contenido visible. Reabrirla muestra el anverso directamente, sin carga ni nuevo descubrimiento.
9. El contador se deriva de las cartas. Al revelar todas aparece SALIR, que regresa a preparación conservando selección y descripciones. La siguiente sesión vuelve a ocultarlas.

El diálogo nativo limita el foco al modal y restaura el foco al cerrar. El selector de modalidad desaparece durante partidas activas, de modo que no puede abandonarse una partida por alternar accidentalmente. No se llama a `selectPack` ni `continueAfterReveal` desde Sorpresa.

## Previsualización grande

El tamaño se ajusta en `src/shared/components/ImageLibrary.css`, selector `.image-preview`. La altura de la carta es:

```css
--preview-height: min(88dvh, calc(100dvh - 7rem), calc((100vw - 3rem) * 1.6));
```

La anchura se deriva de la proporción 5:8. En 1920×1080 alcanza el 88% de la altura; en 1366×768 aproximadamente el 85%. En ventanas estrechas prima el ajuste proporcional al ancho. La carta no tiene scroll interno, conserva las decoraciones y sus imágenes usan `object-fit: contain`. Cerrar, Escape y navegación por teclado siguen disponibles. Los colores del diálogo se fijan localmente para mantener legibilidad en ambas preparaciones.

## Archivo único para ajustar la ruleta

Abrir **`src/features/elimination/config/roulettePhysics.js`**. Los parámetros actuales están en las líneas **3–22** y los ejemplos en **31–33**. Cada declaración incluye comentarios sobre su efecto.

| Parámetro | Línea | Valor actual | Al aumentar | Al disminuir |
| --- | ---: | --- | --- | --- |
| `RADIANS_PER_PIXEL` | 3 | `0.006` rad/px | Más ángulo y velocidad para el mismo gesto | Arrastre menos sensible |
| `MAX_VELOCITY` | 5 | `4` rad/s | Permite mayor velocidad inicial y recorrido | Limita la velocidad liberada |
| `DAMPING` | 7 | `5.6` s⁻¹ | Desaceleración más fuerte | Más recorrido y duración |
| `STOP_VELOCITY` | 9 | `0.012` rad/s | Detención más temprana | Cola más larga, poco recorrido adicional |
| `RELEASE_IDLE_MS` | 11 | `120` ms | Tolera una pausa mayor antes de soltar | Descarta antes una muestra de velocidad antigua |
| `DRAG_THRESHOLD` | 13 | `8` px | Exige más desplazamiento para iniciar arrastre | Activa el arrastre antes |
| `VELOCITY_SAMPLE_WEIGHT` | 15 | `0.65` | Mayor peso del movimiento más reciente | Velocidad más suavizada |
| `VELOCITY_HISTORY_WEIGHT` | 17 | `0.35` | Mayor peso de la velocidad anterior | Menor memoria del gesto |
| `MAX_FRAME_SECONDS` | 19 | `0.05` s | Más avance al recuperarse de frames lentos | Limita más el avance en pausas |
| `KEY_ROTATION` | 21 | `Math.PI / 12` (15°) | Mayor paso por flecha | Ajuste más fino |
| `FULL_TURN` | 22 | `Math.PI * 2` | No ajustar: es una vuelta completa en radianes | No ajustar |

Mantener los pesos de velocidad entre 0 y 1 y su suma igual a 1. Ambos se conservaron literalmente para no introducir cambios ni siquiera por redondeo de `1 - 0.65`.

### Qué controla realmente la inercia

`useRouletteRotation.js` obtiene la velocidad de los desplazamientos horizontales por segundo, aplica los pesos anteriores y llama a `releaseVelocity`. Esta función descarta una liberación con más de 120 ms sin movimiento reciente y limita la velocidad a ±4 rad/s. La velocidad inicial viene del gesto: **no existe una velocidad inicial fija ni un multiplicador de liberación**.

`utils/rouletteInertia.js`, función `inertiaStep`, integra exactamente:

```text
v(t) = v0 · exp(-DAMPING · t)
desaceleración = -DAMPING · v(t)
ángulo del paso = (velocidad anterior - velocidad nueva) / DAMPING
```

La fricción se representa mediante ese damping exponencial; no hay otro parámetro separado de fricción o desaceleración. Tampoco existe duración máxima explícita. Se detiene al bajar de `STOP_VELOCITY`, al seleccionar una carta, iniciar otro arrastre, deshabilitar la interacción o activar movimiento reducido. Las flechas giran en pasos sin inercia.

Para una liberación válida por encima del umbral, el tiempo ideal aproximado es `ln(abs(v0) / STOP_VELOCITY) / DAMPING`. Con los valores actuales y la velocidad máxima son unos **1.04 s**. Los frames lentos y el límite por frame pueden aumentar el tiempo de reloj real.

### Ejemplos orientativos, sin aplicar

| Perfil | MAX_VELOCITY | DAMPING | STOP_VELOCITY | Tiempo ideal desde el máximo | Vueltas adicionales aproximadas |
| --- | ---: | ---: | ---: | ---: | ---: |
| Suave | 3 | 7 | 0.02 | 0.72 s | 0.07 |
| Media / actual | 4 | 5.6 | 0.012 | 1.04 s | 0.11 |
| Alta | 12 | 0.8 | 0.012 | 8.63 s | 2.38 |

Estas cifras describen solamente el movimiento **después de soltar**, suponiendo que el gesto alcance el máximo. El arrastre previo añade su propio recorrido. Para conseguir más vueltas, combinar un máximo mayor y un damping menor; aumentar sensibilidad ayuda a alcanzar ese máximo. Reducir únicamente el umbral de parada no añade muchas vueltas.

Para evitar giros infinitos o valores inválidos, usar números finitos, `DAMPING > 0`, `STOP_VELOCITY > 0` y un máximo positivo razonable. No poner damping o umbral a cero. Probar gestos suaves y rápidos en ambas direcciones al experimentar. Los perfiles son orientativos y el comportamiento predeterminado sigue siendo el original.

## Validación

- `npm run lint`: sin errores.
- `npm run build`: compilación correcta.
- `npm test`: 21 pruebas correctas, incluidas las pruebas anteriores de inercia, secuencia y carga.
- `tests/surpriseState.test.js`: mínimo de una carta, borradores separados, restricciones de fase, cartas independientes, cierre sin revelar, doble finalización, reapertura, conservación del borrador, reinicio y IDs estables con 1, 6, 12 y 120 cartas; recorrido de serpiente en distintas columnas.
- Regresión de dominio existente `.tooling/image-domain-check.mjs`: correcta, con ambos finalistas, estados inválidos, acciones encoladas y reinicio.
- Regresión de navegador de Eliminatoria: texto e imágenes, borradores, previsualización, eliminación y duplicados, historial cronológico, final, ganador, reinicio, inercia en ambas direcciones, detención, arrastre frente a clic y movimiento reducido; sin errores de navegador.
- Pruebas del build en Edge sin servidor: flujo completo de Sorpresa en texto con 1, 6 y 12 cartas; imágenes con descripción; cancelación y finalización mediante teclado y puntero; reapertura sin carga; repetición y movimiento reducido. Comprobación de overflow y límites del modal en 1920×1080, 1366×768, 390×844, 320×568 y 800×400.
- Los scripts locales de navegador están en `.tooling/surprise-check.mjs`, `.tooling/elimination-regression.mjs` y `.tooling/modalities-check.mjs`. Reutilizan Playwright disponible en el equipo y leen `dist` mediante rutas interceptadas; no inician Vite. `.tooling/` permanece ignorado por Git.

La revisión estética manual queda para el usuario, tal como solicitó. Las comprobaciones automáticas de dimensiones no sustituyen esa revisión.

## Graphify

Se consultó el grafo existente antes de implementar. Al terminar, `graphify update .` regeneró `graphify-out/graph.json`, `graph.html` y `GRAPH_REPORT.md`: **265 nodos, 599 relaciones, 14 comunidades**, coste de API **0 tokens**. La revisión de integridad no encontró extremos inexistentes ni bucles sobre sí mismos.

El grafo registra la nueva feature y los componentes compartidos. Graphify no indexa los archivos CSS y otros archivos sin extensión soportada: 17 archivos quedaron fuera; por ello el grafo no valida el diseño visual. La actualización avisó de cambios en las comunidades y usó sus hubs para los nombres; no se pidió un etiquetado mediante LLM. El lanzador requirió ejecución fuera del sandbox para acceder al Python de Microsoft Store; no se reinstaló Graphify ni se añadieron paquetes npm homónimos.

No se realizaron commits ni se inició o dejó activo un servidor de desarrollo.
