// Valores originales. Unidades: radianes, segundos y píxeles.
// Subir sensibilidad: más ángulo/velocidad con el mismo arrastre; bajar: menos.
export const RADIANS_PER_PIXEL = .006
// Subir límite: permite soltar más rápido; bajar: limita la inercia.
export const MAX_VELOCITY = 4
// Subir damping: frena antes; bajar (siempre > 0): recorre más ángulo.
export const DAMPING = 5.6
// Subir umbral: detiene antes; bajar (siempre > 0): prolonga el giro.
export const STOP_VELOCITY = .012
// Subir: tolera más pausa antes de soltar; bajar: descarta gestos viejos antes.
export const RELEASE_IDLE_MS = 120
// Subir: exige más desplazamiento para arrastrar; bajar: activa antes.
export const DRAG_THRESHOLD = 8
// Peso de la muestra nueva (0..1). Subir: respuesta inmediata; bajar: suaviza.
export const VELOCITY_SAMPLE_WEIGHT = .65
// Peso anterior original. Conservar suma 1 con VELOCITY_SAMPLE_WEIGHT.
export const VELOCITY_HISTORY_WEIGHT = .35
// Tope de tiempo integrado por frame. Subir: más avance tras pausas; bajar: menos.
export const MAX_FRAME_SECONDS = .05
// Subir: flechas del teclado giran más; bajar: ajuste más fino (sin inercia).
export const KEY_ROTATION = Math.PI / 12
export const FULL_TURN = Math.PI * 2

// No hay velocidad inicial fija, multiplicador al soltar, fricción separada,
// ni duración máxima: v0 viene del arrastre suavizado y limitado.
// v(t) = v0 * exp(-DAMPING*t); desaceleración = -DAMPING*v.
// Tiempo ideal hasta detenerse = ln(abs(v0)/STOP_VELOCITY)/DAMPING.
// Para más vueltas: mayor MAX_VELOCITY y menor DAMPING. Sensibilidad solo ayuda
// a alcanzar el límite; bajar STOP_VELOCITY alarga la cola, apenas el recorrido.
// Ejemplos orientativos (no aplicados):
// suave: MAX_VELOCITY=3, DAMPING=7, STOP_VELOCITY=.02
// media (actual): MAX_VELOCITY=4, DAMPING=5.6, STOP_VELOCITY=.012
// alta: MAX_VELOCITY=12, DAMPING=.8, STOP_VELOCITY=.012
// Mantener valores finitos, DAMPING>0 y STOP_VELOCITY>0 para evitar giro infinito.
