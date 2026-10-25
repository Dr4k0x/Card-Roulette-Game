import { useState } from 'react'
import './ImageCard.css'

export default function ImageCard({ option, compact = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={`image-card${compact ? ' image-card-compact' : ''}`}>
      <span className="image-card-art">
        {failed ? <span className="image-card-error">Imagen no disponible: {option.label}</span>
          : <img src={option.imageSrc} alt={option.label} loading={compact ? 'lazy' : 'eager'} draggable={false} onError={() => setFailed(true)} />}
      </span>
      <span className="image-card-base" aria-hidden="true"><span>◇</span></span>
    </span>
  )
}
