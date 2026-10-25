// Presentation only. No timer receives a game callback or changes a result.
export const RESULT_HOLD_MS = 3000
export const REVEAL_SEQUENCE = [
  { stage: 'tearing', at: 650 },
  { stage: 'opening', at: 1100 },
  { stage: 'emerging', at: 1750 },
  { stage: 'revealing', at: 2650 },
  { stage: 'result', at: 3400 },
  { stage: 'retiring', at: 3400 + RESULT_HOLD_MS },
  { stage: 'ready', at: 3850 + RESULT_HOLD_MS },
]

export function scheduleRevealSequence({ reducedMotion, delay = 0, onStage, schedule = setTimeout, cancel = clearTimeout }) {
  const sequence = reducedMotion
    ? [{ stage: 'retiring', at: RESULT_HOLD_MS }, { stage: 'ready', at: RESULT_HOLD_MS + 200 }]
    : [{ stage: 'entering', at: 0 }, ...REVEAL_SEQUENCE]
  const timers = sequence.map(({ stage, at }) => schedule(() => onStage(stage), at + (reducedMotion ? 0 : delay)))
  return () => timers.forEach(cancel)
}
