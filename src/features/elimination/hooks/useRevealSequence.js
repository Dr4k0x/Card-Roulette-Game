import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { scheduleRevealSequence } from './revealSequence.js'

export function useRevealSequence(delay = 0) {
  const reducedMotion = Boolean(useReducedMotion())
  const [stage, setStage] = useState(reducedMotion ? 'result' : delay ? 'centering' : 'entering')

  useEffect(() => scheduleRevealSequence({ reducedMotion, delay, onStage: setStage }), [reducedMotion, delay])

  // A preference change during playback must immediately suppress large motion.
  const visibleStage = reducedMotion && !['retiring', 'ready'].includes(stage) ? 'result' : stage
  return {
    stage: visibleStage,
    reducedMotion,
    ready: visibleStage === 'ready' || reducedMotion,
    hasResult: ['result', 'retiring', 'ready'].includes(visibleStage),
  }
}
