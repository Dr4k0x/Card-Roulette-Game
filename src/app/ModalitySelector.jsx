import { motion as Motion, useReducedMotion } from 'motion/react'
import './ModalitySelector.css'

export default function ModalitySelector({ surprise, onChange }) {
  const reduced = useReducedMotion()
  return <aside className="modality-selector" aria-label="Modalidad de juego">
    <span aria-live="polite">{surprise ? 'REVELACIÓN SORPRESA' : 'ELIMINATORIA'}</span>
    <Motion.button type="button" title="Cambiar modalidad" aria-label="Cambiar modalidad" aria-pressed={surprise} onClick={onChange} animate={{ rotate: surprise ? 180 : 0 }} transition={{ duration: reduced ? 0 : .35 }}>⇄</Motion.button>
  </aside>
}
