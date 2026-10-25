import { useEffect, useRef } from 'react'
import { calculatePackPositions } from '../utils/calculatePackPositions.js'
import Pack from './Pack.jsx'
import { useRouletteRotation } from '../hooks/useRouletteRotation.js'
import EliminationHistory from './EliminationHistory.jsx'
import './GameBoard.css'

export default function GameBoard({
  activePacks,
  eliminatedOptions,
  onSelect,
  disabled = false,
  title = 'Elige un sobre',
  help = 'Todas las opciones permanecen ocultas. Elige un sobre para revelar la opción que será eliminada.',
}) {
  const { rotation, dragging, interactionProps } = useRouletteRotation(disabled)
  const positions = calculatePackPositions(activePacks.length, rotation)
  const titleRef = useRef(null)

  useEffect(() => {
    if (!disabled) titleRef.current?.focus()
  }, [disabled])

  return (
    <main className="game-board" aria-labelledby="board-title">
      <header className="board-header">
        <div>
          <p className="eyebrow">PACK ELIMINATION</p>
          <h1 id="board-title" tabIndex={-1} ref={titleRef}>{title}</h1>
        </div>
        <p className="board-counter" aria-live="polite">
          <strong>{activePacks.length}</strong> sobres restantes
        </p>
      </header>

      <div className="board-layout">
      <section className={`board-arena${dragging ? ' is-dragging' : ''}`} aria-label="Tablero de sobres cerrados. Usa las flechas para girar." aria-describedby="board-help" tabIndex={disabled ? -1 : 0}
        {...interactionProps}>
        <div className="board-table" aria-hidden="true">
          <span className="table-emblem">◇</span>
          <span className="table-caption">PACK ELIMINATION</span>
        </div>
        {activePacks.map((pack, index) => (
          <Pack key={pack.id} id={pack.id} position={positions[index]} number={index + 1} onSelect={onSelect} disabled={disabled} />
        ))}
      </section>
      <EliminationHistory eliminatedOptions={eliminatedOptions} side="right" />
      </div>

      <p id="board-help" className="board-help">{help}<br /><span>Arrastra hacia los lados para girar · Flechas ← → con el tablero enfocado</span></p>
    </main>
  )
}
