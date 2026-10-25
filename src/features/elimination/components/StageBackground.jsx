import { AnimatePresence, motion as Motion, useReducedMotion } from 'motion/react'
import { getVisualStage } from '../utils/getVisualStage.js'
import './StageBackground.css'

export default function StageBackground({ count }) {
  const reducedMotion = useReducedMotion()
  const stage = getVisualStage(count)

  return (
    <div className="stage-background" aria-hidden="true">
      <AnimatePresence initial={false}>
        <Motion.div
          key={stage}
          className={`stage-light stage-${stage}`}
          initial={{ opacity: reducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 1.2 }}
        />
      </AnimatePresence>
    </div>
  )
}
