import { useEffect, useRef } from 'react'
import { motion as Motion } from 'motion/react'
import RevealPack from './RevealPack.jsx'
import { optionLabel } from '../utils/gameOptions.js'
import { useRevealSequence } from '../hooks/useRevealSequence.js'
import './RevealModal.css'

const CENTERING_DELAY_MS = 700

export default function FinalReveal({ option, onConfirm }) {
  const { stage, reducedMotion, ready, hasResult } = useRevealSequence(CENTERING_DELAY_MS)
  const continueRef = useRef(null)
  const announcementRef = useRef(null)
  const continuingRef = useRef(false)

  useEffect(() => {
    announcementRef.current?.focus()
  }, [])

  useEffect(() => { if (ready) continueRef.current?.focus() }, [ready])

  function handleConfirm() {
    if (!ready || continuingRef.current) return
    continuingRef.current = true
    continueRef.current.disabled = true
    onConfirm()
  }

  return (
    <section className={`final-reveal${stage === 'result' ? ' has-winner' : ''}`} aria-label="Revelación del ganador">
      {stage !== 'centering' && <RevealPack option={option} stage={stage} reducedMotion={reducedMotion} mode="winner" />}
      <div className="final-controls">
        <p className="reveal-announcement" role="status" aria-live="polite" aria-atomic="true" tabIndex={-1} ref={announcementRef}>
          {hasResult ? `${optionLabel(option)}. GANADOR.` : 'Abriendo el sobre ganador…'}
        </p>
        {ready && (
          <Motion.button ref={continueRef} className="start-button" type="button" initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} onClick={handleConfirm}>
            VER RESULTADO
          </Motion.button>
        )}
      </div>
    </section>
  )
}
