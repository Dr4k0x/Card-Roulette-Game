import { useState } from 'react'
import ImageLibrary, { ImagePreview } from '../../../shared/components/ImageLibrary.jsx'
import ImageCard from '../../../shared/components/ImageCard.jsx'
import { OPTION_MODES } from '../../../shared/constants/optionModes.js'
import '../../../shared/components/SetupLayout.css'
import './Surprise.css'

export default function SurpriseSetup({ game }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState(null)
  const imageMode = game.mode === OPTION_MODES.IMAGE

  function add(event) {
    event.preventDefault()
    if (!title.trim()) return
    game.addText(title, description)
    setTitle('')
    setDescription('')
  }

  return <main className="setup-screen surprise-setup">
    <section className="panel" aria-labelledby="surprise-setup-title">
      <div className="setup-column setup-entry">
        <header>
          <p className="eyebrow">REVELACIÓN SORPRESA</p>
          <h1 id="surprise-setup-title">Prepara lo inesperado.</h1>
          <p>Una colección oculta. Tú eliges qué descubrir y cuándo.</p>
          <div className="mode-selector" role="group" aria-label="Contenido de las cartas">
            <button type="button" aria-pressed={!imageMode} onClick={() => game.setMode(OPTION_MODES.TEXT)}>Jugar con texto</button>
            <button type="button" aria-pressed={imageMode} onClick={() => game.setMode(OPTION_MODES.IMAGE)}>Jugar con imágenes</button>
          </div>
        </header>
        {imageMode ? <ImageLibrary options={game.options} addImage={game.addImage} /> : <form className="setup-fields" onSubmit={add}>
          <div><label htmlFor="surprise-title">Título de la carta</label><input id="surprise-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="¿Qué se esconde aquí?" required /></div>
          <div><label htmlFor="surprise-description">Descripción opcional</label><textarea id="surprise-description" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Añade un detalle para el momento de descubrirla." /></div>
          <button type="submit">Añadir carta</button>
        </form>}
      </div>
      <div className="setup-column setup-options">
        <h2>Tus cartas <span className="count" aria-live="polite">{game.options.length}</span></h2>
        {game.options.length === 0 ? <p className="empty-state">Prepara al menos una carta para comenzar.</p> : <ul className="surprise-drafts">
          {game.options.map((card) => <li key={card.id}>
            <div className="surprise-draft-heading">
              {imageMode && <button type="button" className="image-preview-button" aria-label={`Ampliar ${card.label}`} onClick={() => setPreview(card)}><ImageCard option={card} compact /></button>}
              <strong>{card.label}</strong>
              <button type="button" className="remove-button" aria-label={`Eliminar ${card.label}`} onClick={() => game.remove(card.id)}>Eliminar</button>
            </div>
            <label htmlFor={`description-${card.id}`}>Descripción opcional</label>
            <textarea id={`description-${card.id}`} rows={3} value={card.description} onChange={(event) => game.describe(card.id, event.target.value)} />
          </li>)}
        </ul>}
        <footer><p className="hint">Las cartas se revelan libremente. No hay eliminados ni ganador.</p><button type="button" className="start-button" disabled={!game.options.length} onClick={game.start}>COMENZAR</button></footer>
      </div>
    </section>
    {preview && <ImagePreview option={preview} onClose={() => setPreview(null)} />}
  </main>
}
