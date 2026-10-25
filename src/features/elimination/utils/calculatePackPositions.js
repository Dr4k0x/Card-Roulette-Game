const FULL_TURN = Math.PI * 2
const START_ANGLE = -Math.PI / 2
const CENTER = { x: 50, y: 50 }
const RADIUS = { x: 39, y: 29 }
const BACK_SCALE = 0.75
const FRONT_SCALE = 1.1
const UNCROWDED_COUNT = 8
const MIN_DENSITY_SCALE = 0.6
const BACK_Z_INDEX = 10
const DEPTH_LAYERS = 100

// Percent coordinates stay independent of the board's rendered dimensions.
export function calculatePackPositions(count, rotationOffset = 0) {
  if (!Number.isInteger(count) || count <= 0) return []

  const angleStep = FULL_TURN / count
  const densityScale = Math.max(MIN_DENSITY_SCALE, Math.min(1, Math.sqrt(UNCROWDED_COUNT / count)))

  return Array.from({ length: count }, (_, index) => {
    const angle = START_ANGLE + index * angleStep + rotationOffset
    const verticalOffset = Math.sin(angle)
    const depth = (verticalOffset + 1) / 2

    return {
      x: CENTER.x + RADIUS.x * Math.cos(angle),
      y: CENTER.y + RADIUS.y * verticalOffset,
      scale: (BACK_SCALE + (FRONT_SCALE - BACK_SCALE) * depth) * densityScale,
      zIndex: BACK_Z_INDEX + Math.round(depth * DEPTH_LAYERS),
    }
  })
}
