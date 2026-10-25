import PackArtwork from './PackArtwork.jsx'
import './PackAppearance.css'

export default function Pack({ id, position, number, onSelect, disabled = false, describedBy = 'board-help', interactionProps = {} }) {
  return (
    <div
      className="pack-position"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${position.scale})`,
        zIndex: position.zIndex,
      }}
    >
      <button {...interactionProps} className="pack" type="button" onClick={() => onSelect?.(id)} disabled={disabled} aria-label={`Sobre cerrado ${number}`} aria-describedby={describedBy}>
        <PackArtwork />
      </button>
    </div>
  )
}
