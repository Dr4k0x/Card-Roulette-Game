# Pack Elimination: guía para agentes

## Objetivo y alcance
Aplicación web de entretenimiento donde diferentes opciones permanecen ocultas
dentro de sobres virtuales. El usuario selecciona sobres y revela opciones que
se eliminan progresivamente hasta una ronda final con dos opciones.

La fase inicial solo prepara el proyecto y muestra una pantalla de confirmación.
No implementar todavía el juego, sobres, mesa, configuración ni animaciones.
No agregar backend ni base de datos. Ampliar el alcance solo por solicitud del usuario.

## Stack
React, Vite, JavaScript, CSS normal y ESLint. Git para control de versiones y
Graphify (paquete Python `graphifyy`, CLI `graphify`) para análisis estructural.

## Arquitectura y responsabilidades
Utilizar una arquitectura feature-based, sin sobreingeniería ni servicios innecesarios.
La funcionalidad principal pertenece a `src/features/elimination/`.
Los elementos verdaderamente reutilizables pertenecen a `src/shared/`.

- `components/`: presentación e interacción de interfaz.
- `hooks/`: estado y lógica React de la funcionalidad.
- `utils/`: funciones puras independientes de React.
- `constants/`: constantes y estados definidos del juego.
- `src/app/App.jsx`: composición de la aplicación.
- `src/main.jsx`: entrada y montaje de React.

Las carpetas vacías se conservan con `.gitkeep`. Crear los módulos cuando tengan
una responsabilidad implementada; no introducir funciones o componentes vacíos.
Módulos previstos para fases posteriores: SetupScreen, GameBoard, Pack,
RevealModal, FinalRound, WinnerScreen, useEliminationGame, shuffle,
calculatePackPositions y gameStates.

## Convenciones
- Utilizar nombres descriptivos y mantener componentes pequeños.
- Evitar componentes con múltiples responsabilidades.
- No colocar toda la lógica en App.jsx; separar negocio y presentación.
- Preferir funciones puras para cálculos.
- Evitar números y strings mágicos y no duplicar lógica.
- No agregar dependencias sin necesidad real.
- Eliminar código muerto y mantener imports claros y organizados.
- Mantener la estructura feature-based al agregar funcionalidad.

## Estado
Usar estado local de React y custom hooks. No introducir Redux, Zustand,
Context global u otras soluciones mientras la complejidad no lo justifique.

## Validación obligatoria
Después de cambios relevantes ejecutar `npm run lint` y `npm run build` cuando
corresponda. No considerar terminada una tarea con errores de lint o compilación
relacionados con los cambios realizados.

## Servidor de desarrollo
No ejecutar ni dejar permanentemente activo `npm run dev`.
Usar comandos que finalicen automáticamente, como `npm install`, `npm run lint`
y `npm run build`. Si hace falta revisar mediante un servidor de desarrollo,
pedir al usuario que lo ejecute manualmente.

## Git
Realizar cambios enfocados, sin mezclar modificaciones no relacionadas.
No hacer commits automáticamente salvo petición explícita del usuario.

## Graphify
Antes de cambios amplios o tareas que afecten varias partes, utilizar Graphify
como apoyo para comprender relaciones entre componentes, hooks, utilidades y módulos.
Actualizar el grafo después de cambios estructurales significativos.
Generar el mapa local con `graphify extract . --code-only`.
Revisar los artefactos y sus límites: los módulos futuros todavía no existen.
No editar manualmente artefactos generados. `graphify-out/` es regenerable y no
se versiona. No reinstalar Graphify si ya está disponible ni instalar paquetes npm homónimos.
Preservar esta guía al registrar o actualizar la integración de Graphify.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
