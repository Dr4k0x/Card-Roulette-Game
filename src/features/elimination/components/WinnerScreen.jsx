import { useEffect, useRef } from 'react'
import { motion as Motion, useReducedMotion } from 'motion/react'
import RevealPack from './RevealPack.jsx'
import ImageCard from '../../../shared/components/ImageCard.jsx'
import { optionLabel } from '../utils/gameOptions.js'
import EliminationHistory from './EliminationHistory.jsx'
import './RevealModal.css'
import './FinalRound.css'

export default function WinnerScreen({ winner, activePacks, finalSelectedPack, eliminatedOptions = [], onReset }) {
  const reducedMotion = useReducedMotion()
  const titleRef = useRef(null)
  const runnerUp = activePacks.find((pack) => pack.id !== finalSelectedPack.id)

  useEffect(() => { titleRef.current?.focus() }, [])

  return (
    <main className="winner-screen">
      <Motion.section className="winner-result" initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <header>
          <p className="eyebrow">PACK ELIMINATION · PARTIDA COMPLETADA</p>
          <h1 tabIndex={-1} ref={titleRef}>GANADOR</h1>
          <p className="winner-name reveal-announcement">{optionLabel(winner)}</p>
        </header>
        <RevealPack option={winner} stage="result" reducedMotion mode="winner" />
        <div className="winner-controls">
          <button className="start-button" type="button" onClick={onReset}>NUEVA PARTIDA</button>
          <p className="hint">Tus opciones estarán listas para volver a jugar.</p>
        </div>
      </Motion.section>
      <aside className="winner-summary" aria-label="Resumen de la partida">
        {runnerUp && (
          <section className="runner-up" aria-labelledby="runner-up-title">
            <h2 id="runner-up-title">SEGUNDO LUGAR</h2>
            <div className={`runner-up-card${runnerUp.option.type === 'image' ? ' runner-up-image' : ''}`}>
              {runnerUp.option.type === 'image' ? <ImageCard option={runnerUp.option} compact /> : <span className="runner-up-symbol" aria-hidden="true">◇</span>}
              <p>{optionLabel(runnerUp.option)}</p>
              <span className="runner-up-label">FINALISTA</span>
            </div>
          </section>
        )}
        <EliminationHistory eliminatedOptions={eliminatedOptions} summary />
      </aside>
    </main>
  )
}
