import { useEffect, useRef, useState } from 'react'
import { motion as Motion, useReducedMotion } from 'motion/react'
import FinalReveal from './FinalReveal.jsx'
import Pack from './Pack.jsx'
import EliminationHistory from './EliminationHistory.jsx'
import StageBackground from './StageBackground.jsx'
import { useHoldCharge } from '../../../shared/hooks/useHoldCharge.js'
import './GameBoard.css'
import './FinalRound.css'

const CENTER_POSITION = { x: 50, y: 50, scale: 1, zIndex: 1 }
const FINAL_SIDES = ['27%', '73%']
const DOUBT_PHRASES = ['¿Estás seguro?', '¿Será esta la opción correcta?', '¿Y si el ganador está en el otro sobre?', '¿Confías en tu elección?', '¿Te atreves a abrir este sobre?']

export default function FinalRound({ activePacks, eliminatedOptions = [], finalSelectedPack, onSelect, onConfirm }) {
  const reducedMotion = useReducedMotion()
  const titleRef = useRef(null)
  const hasSelection = Boolean(finalSelectedPack)
  const [hoveredId, setHoveredId] = useState(null)
  const [phrase, setPhrase] = useState('')
  const phraseIndexRef = useRef(0)
  const activeHoverRef = useRef(null)
  const { charge, completedId, interactionProps } = useHoldCharge(onSelect, hasSelection)
  const selectionLocked = hasSelection || completedId !== null
  const consideredId = charge?.id ?? hoveredId
  const selectedId = finalSelectedPack?.id ?? completedId

  function enterContender(id) {
    if (selectionLocked || activeHoverRef.current === id) return
    activeHoverRef.current = id
    setHoveredId(id)
    setPhrase(DOUBT_PHRASES[phraseIndexRef.current % DOUBT_PHRASES.length])
    phraseIndexRef.current += 1
  }

  function leaveContender(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return
    activeHoverRef.current = null
    setHoveredId(null)
  }

  useEffect(() => { titleRef.current?.focus() }, [])

  return (
    <main className="final-round">
      <div className="final-layout">
        <section className="final-scene" aria-labelledby="final-title">
          <StageBackground count={activePacks.length} />
          <div className={`final-energy${reducedMotion ? ' energy-reduced' : ''}`} aria-hidden="true">
            {activePacks.map(({ id }, index) => {
              const charging = charge?.id === id
              const selected = selectedId === id
              const considered = consideredId === id
              return <Motion.div key={id} className={`final-beam beam-${index === 0 ? 'blue' : 'red'}`}
                initial={false}
                animate={{ scaleX: selected ? 1.22 : charging ? .12 + charge.progress * .88 : considered ? .42 : .06,
                  opacity: selected ? .95 : selectionLocked ? .08 : charging ? .85 : considered ? .65 : .2 }}
                transition={{ duration: reducedMotion ? 0 : charging ? 0 : .35, ease: 'easeOut' }} />
            })}
            {selectionLocked && <Motion.div className={`final-impact impact-${activePacks[0]?.id === selectedId ? 'blue' : 'red'}`}
              initial={{ opacity: reducedMotion ? .2 : 0, scale: reducedMotion ? 1 : .7 }}
              animate={{ opacity: reducedMotion ? [.2, 0] : [0, .65, 0], scale: reducedMotion ? 1 : [ .7, 1.15, 1.4 ] }}
              transition={{ duration: reducedMotion ? .3 : .65 }} />}
          </div>
          <header className="final-header">
            <p className="eyebrow">PACK ELIMINATION · EL ÚLTIMO DESTINO</p>
            <h1 id="final-title" tabIndex={-1} ref={titleRef}>RONDA FINAL</h1>
            <p id="final-help">{selectionLocked ? 'Tu elección es definitiva. Este sobre contiene al ganador.' : 'Mantén presionado un sobre durante 1,5 segundos · También con Espacio o Enter'}</p>
          </header>
          <div className="final-arena">
            <div className="final-orbit" aria-hidden="true" />
            {activePacks.map(({ id }, index) => {
              const chosen = selectedId === id
              const charging = charge?.id === id
              return (
                <Motion.div
                  key={id}
                  className={`final-contender contender-${index === 0 ? 'blue' : 'red'}${charging ? ' is-charging' : ''}`}
                  onPointerEnter={() => enterContender(id)}
                  onPointerLeave={leaveContender}
                  onFocus={() => enterContender(id)}
                  onBlur={leaveContender}
                  style={{ x: '-50%', y: '-50%' }}
                  initial={false}
                  animate={{
                    left: chosen ? '50%' : FINAL_SIDES[index],
                    scale: reducedMotion ? 1 : selectionLocked ? chosen ? 1.12 : .85 : charging ? 1.04 + charge.progress * .08 : consideredId === id ? 1.04 : 1,
                    filter: selectionLocked && !chosen || !selectionLocked && consideredId && consideredId !== id ? 'brightness(.55) saturate(.6)' : 'brightness(1)',
                    opacity: selectionLocked ? reducedMotion ? 0 : chosen ? [1, 1, 0] : [.3, .3, 0] : 1,
                  }}
                  transition={{ duration: reducedMotion ? 0 : .9, scale: { duration: charging ? 0 : .3 }, opacity: { duration: reducedMotion ? 0 : chosen ? .9 : 1.5, times: [0, .7, 1] } }}
                >
                  <Pack id={id} number={index + 1} position={CENTER_POSITION} disabled={selectionLocked} describedBy="final-help" interactionProps={interactionProps(id)} />
                </Motion.div>
              )
            })}
            {hasSelection && <FinalReveal key={finalSelectedPack.id} option={finalSelectedPack.option} onConfirm={onConfirm} />}
            {!selectionLocked && <p className="final-doubt" role="status" aria-live="polite">{charge ? 'Mantén presionado… tu elección se está cargando.' : hoveredId ? phrase : '\u00a0'}</p>}
          </div>
          {!selectionLocked && <p className="final-instruction">Dos sobres. Una elección. Mantén para elegir · Suelta para cancelar.</p>}
        </section>
        <EliminationHistory eliminatedOptions={eliminatedOptions} side="right" />
      </div>
    </main>
  )
}
