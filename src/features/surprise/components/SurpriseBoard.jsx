import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion as Motion, useReducedMotion } from 'motion/react'
import { snakePosition } from '../utils/snakePositions.js'
import SurpriseCard from './SurpriseCard.jsx'
import SurpriseReveal from './SurpriseReveal.jsx'
import './Surprise.css'

export default function SurpriseBoard({ game }) {
  const gridRef = useRef(null)
  const [columns, setColumns] = useState(4)
  const reduced = useReducedMotion()
  useEffect(() => {
    const grid = gridRef.current
    const observer = new ResizeObserver(() => setColumns(Number(getComputedStyle(grid).getPropertyValue('--columns'))))
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])
  const complete = game.count === game.cards.length
  return <main className="surprise-board">
    <header><p className="eyebrow">REVELACIÓN SORPRESA</p><h1>{complete ? 'Colección descubierta.' : 'Cada carta, una sorpresa.'}</h1><p>Elige cualquier carta. El recorrido es solo una guía.</p><p className="surprise-counter" aria-live="polite">Cartas reveladas: {game.count} / {game.cards.length}</p></header>
    <LayoutGroup>
      <div className="surprise-grid" ref={gridRef}>
        {game.cards.map((card, index) => <Motion.button key={card.id} layoutId={`surprise-${card.id}`} layout={!reduced} transition={{ duration: reduced ? 0 : .35 }} type="button" className="surprise-tile" style={{ ...snakePosition(index, columns), visibility: game.selectedId === card.id ? 'hidden' : 'visible' }} onClick={() => game.select(card.id)} aria-label={card.revealed ? `Abrir carta ${index + 1}: ${card.label}` : `Abrir carta ${index + 1} oculta`}>
          <SurpriseCard card={card} number={index + 1} />
        </Motion.button>)}
      </div>
      <AnimatePresence>{game.selectedCard && <SurpriseReveal key={game.selectedId} card={game.selectedCard} number={game.cards.findIndex((card) => card.id === game.selectedId) + 1} onReveal={game.reveal} onClose={game.close} />}</AnimatePresence>
    </LayoutGroup>
    {complete && <Motion.footer initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }}><p>Todas las cartas están a la vista. Puedes volver a abrirlas.</p><button type="button" className="start-button" onClick={game.exit}>SALIR</button></Motion.footer>}
  </main>
}
