import { useEffect, useRef } from 'react'
import { motion as Motion, useReducedMotion } from 'motion/react'
import { useHoldCharge } from '../../../shared/hooks/useHoldCharge.js'
import SurpriseCard from './SurpriseCard.jsx'

export default function SurpriseReveal({ card, number, onReveal, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  const reduced = useReducedMotion()
  const { charge, completedId, interactionProps } = useHoldCharge(onReveal, card.revealed)
  const progress = charge?.progress ?? (completedId ? 1 : 0)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  useEffect(() => {
    const dialog = dialogRef.current
    const previous = document.activeElement
    dialog.showModal()
    const closeOnEscape = (event) => { event.preventDefault(); closeRef.current() }
    dialog.addEventListener('cancel', closeOnEscape)
    return () => { dialog.removeEventListener('cancel', closeOnEscape); dialog.close(); previous?.focus() }
  }, [])

  return <Motion.dialog ref={dialogRef} className="surprise-dialog" exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }} aria-label={`Carta ${number}${card.revealed ? `: ${card.label}` : ' oculta'}`}>
    <Motion.div className="surprise-expanded" layoutId={`surprise-${card.id}`} transition={{ duration: reduced ? 0 : .35 }}>
      <Motion.div className="surprise-flip" initial={{ rotateY: card.revealed ? 180 : 0 }} animate={{ rotateY: card.revealed ? 180 : 0 }} transition={{ duration: reduced ? 0 : .65 }} style={{ '--charge': progress }}>
        <div className="surprise-face surprise-face-back" aria-hidden={card.revealed} inert={card.revealed}>
          <button type="button" className="surprise-hold" autoFocus {...interactionProps(card.id)} disabled={card.revealed} aria-label={`Mantén presionado para revelar carta ${number}`}>
            <SurpriseCard card={{ ...card, revealed: false }} number={number} expanded />
          </button>
        </div>
        {card.revealed && <div className={`surprise-face surprise-face-front${completedId ? ' just-revealed' : ''}`}><SurpriseCard card={card} number={number} expanded /></div>}
      </Motion.div>
    </Motion.div>
    {!card.revealed && <div className="surprise-charge-status"><p>Mantén presionado · Espacio o Enter</p><progress value={progress} max={1} aria-label="Carga de revelación" /></div>}
    {card.revealed && <p className="surprise-discovered" role="status">Carta revelada</p>}
    <button type="button" className="surprise-close" onClick={onClose}>Cerrar vista</button>
  </Motion.dialog>
}
