import { useId } from 'react'
import ImageCard from '../../../shared/components/ImageCard.jsx'
import { optionLabel } from '../utils/gameOptions.js'
import './EliminationHistory.css'

export default function EliminationHistory({ eliminatedOptions, side, summary = false }) {
  const titleId = useId()
  const entries = eliminatedOptions.map((option, index) => ({ option, number: index + 1 }))

  return (
    <section className={`elimination-history${side ? ` history-${side}` : ''}${summary ? ' history-summary' : ''}`} aria-labelledby={titleId}>
      <h2 id={titleId}>{summary ? 'La partida, paso a paso' : 'Eliminados'} <span>{entries.length}</span></h2>
      {entries.length === 0 ? <p className="history-empty">{eliminatedOptions.length === 0 ? 'Cada elección deja una historia.' : 'Las próximas eliminaciones aparecerán aquí.'}</p> : (
        <ol tabIndex={0} aria-label="Todas las eliminaciones en orden">
          {entries.map(({ option, number }) => (
            <li className={`history-row${option.type === 'image' ? ' history-image-row' : ''}`} key={number}>
              <span className="history-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
              {option.type === 'image' && <ImageCard option={option} compact />}
              <span>{optionLabel(option)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
