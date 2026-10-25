import { DAMPING, MAX_VELOCITY, RELEASE_IDLE_MS } from '../config/roulettePhysics.js'
export { DRAG_THRESHOLD, RADIANS_PER_PIXEL, KEY_ROTATION, FULL_TURN, MAX_VELOCITY, STOP_VELOCITY } from '../config/roulettePhysics.js'

// Exact exponential integration keeps travel independent of display refresh rate.
export function inertiaStep(velocity, seconds) {
  const nextVelocity = velocity * Math.exp(-DAMPING * seconds)
  return { velocity: nextVelocity, delta: (velocity - nextVelocity) / DAMPING }
}

export function releaseVelocity(velocity, idleMilliseconds) {
  return idleMilliseconds > RELEASE_IDLE_MS ? 0 : Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity))
}
