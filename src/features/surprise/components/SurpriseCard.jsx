import ImageCard from '../../../shared/components/ImageCard.jsx'
import { OPTION_MODES } from '../../../shared/constants/optionModes.js'

export default function SurpriseCard({ card, number, expanded = false }) {
  return <span className={`surprise-card-content${card.revealed ? ' is-revealed' : ''}${expanded ? ' is-expanded' : ''}`}>
    {card.revealed ? <>
      <span className="surprise-main-content">{card.type === OPTION_MODES.IMAGE ? <ImageCard option={card} compact={!expanded} /> : <strong>{card.label}</strong>}</span>
    </> : <span className="surprise-back" aria-hidden="true">
      <span className="surprise-sigil">✦</span>
      <span className="surprise-back-copy">
        <span className="surprise-back-caption">LO INESPERADO</span>
        {card.description && <span className="surprise-back-hint">{card.description}</span>}
      </span>
    </span>}
    <span className="surprise-number">{String(number).padStart(2, '0')}</span>
  </span>
}
