import { useEffect, useRef } from 'react'
import { motion as Motion } from 'motion/react'
import RevealPack from './RevealPack.jsx'
import { optionLabel } from '../utils/gameOptions.js'
import { useRevealSequence } from '../hooks/useRevealSequence.js'
import './RevealModal.css'

export default function RevealModal({ selectedPack, onContinue }) {
  const { stage, reducedMotion, ready, hasResult } = useRevealSequence()
  const titleRef = useRef(null)
  const continueRef = useRef(null)
  const continuingRef = useRef(false)

  useEffect(() => {
    titleRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => {
    if (ready) continueRef.current?.focus()
  }, [ready])

  function handleContinue() {
    if (!ready || continuingRef.current) return
    continuingRef.current = true
    continueRef.current.disabled = true
    onContinue()
  }

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const target = ready ? continueRef : titleRef
    target.current?.focus()
  }

  return (
    <Motion.div
      className="reveal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-title"
      aria-describedby="reveal-hint"
      initial={{ opacity: reducedMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : .25 }}
      onKeyDown={handleKeyDown}
    >
      <section className="reveal-panel">
        <header>
          <p className="eyebrow">PACK ELIMINATION · REVELACIÓN</p>
          <h1 id="reveal-title" tabIndex={-1} ref={titleRef}>El sobre elegido</h1>
        </header>
        <RevealPack option={selectedPack.option} stage={stage} reducedMotion={reducedMotion} />
        <div className="reveal-controls">
          <div className="reveal-announcement" role="status" aria-live="polite" aria-atomic="true">
            {hasResult ? `${optionLabel(selectedPack.option)}. ELIMINADA. La eliminación se confirma al continuar.` : 'Abriendo el sobre…'}
          </div>
          {ready && (
            <Motion.button
              ref={continueRef}
              className="start-button"
              type="button"
              initial={{ opacity: reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : .15 }}
              onClick={handleContinue}
            >CONTINUAR</Motion.button>
          )}
          <p id="reveal-hint" className="hint">La eliminación se confirma al continuar.</p>
        </div>
      </section>
    </Motion.div>
  )
}
