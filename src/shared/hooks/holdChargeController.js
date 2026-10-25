export const HOLD_CHARGE_DURATION = 1500

// Presentation timing only. The game still owns the meaning of the selection.
export function createHoldChargeController({ onProgress, onCancel, onComplete,
  now = () => performance.now(), schedule = requestAnimationFrame, unschedule = cancelAnimationFrame }) {
  let gesture = null
  let frame = null
  let committed = false

  function cancel(source) {
    if (!gesture || (source && (source.type !== gesture.source.type || source.id !== gesture.source.id))) return
    gesture = null
    unschedule(frame)
    frame = null
    onCancel()
  }

  function start(packId, source) {
    if (committed || gesture) return false
    gesture = { packId, source, startedAt: now() }
    onProgress(packId, 0)
    function tick() {
      if (!gesture || committed) return
      const progress = Math.min(1, (now() - gesture.startedAt) / HOLD_CHARGE_DURATION)
      onProgress(packId, progress)
      if (progress === 1) {
        // Lock synchronously before React renders or the domain callback runs.
        committed = true
        gesture = null
        frame = null
        onComplete(packId)
      } else {
        frame = schedule(tick)
      }
    }
    frame = schedule(tick)
    return true
  }

  function dispose() {
    gesture = null
    if (frame !== null) unschedule(frame)
    frame = null
  }

  return { start, cancel, dispose }
}
