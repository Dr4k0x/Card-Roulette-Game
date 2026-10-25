// Presentation only; the remaining pack count is the single source of truth.
export function getVisualStage(count) {
  if (count > 8) return 'midnight'
  if (count > 4) return 'charged'
  if (count > 2) return 'tension'
  return 'final'
}
