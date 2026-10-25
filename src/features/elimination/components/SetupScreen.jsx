import { useState } from 'react'
import SetupBackground from './SetupBackground.jsx'
import ImageLibrary, { ImagePreview } from '../../../shared/components/ImageLibrary.jsx'
import ImageCard from '../../../shared/components/ImageCard.jsx'
import { MIN_OPTIONS } from '../constants/gameStates.js'
import '../../../shared/components/SetupLayout.css'
import './SetupScreen.css'

export default function SetupScreen({ options, mode, setMode, addImage, addOption, addOptions, removeOption, startGame }) {
  const [optionText, setOptionText] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [preview, setPreview] = useState(null)
  const imageMode = mode === 'image'
  const canStart = options.length >= MIN_OPTIONS

  function handleAddOption(event) {
    event.preventDefault()
    addOption(optionText)
    setOptionText('')
  }

  function handleAddOptions(event) {
    event.preventDefault()
    addOptions(bulkText)
    setBulkText('')
  }

  return (
    <main className="setup-screen">
      <SetupBackground />
      <section className="panel" aria-labelledby="setup-title">
        <div className="setup-column setup-entry">
          <header>
            <p className="eyebrow">PREPARACIÓN DE PARTIDA</p>
            <h1 id="setup-title">Pack Elimination</h1>
            <p>{imageMode ? 'Elige imágenes de tu biblioteca local para la próxima partida.' : 'Añade las opciones que participarán en tu próxima partida.'}</p>
            <div className="mode-selector" role="group" aria-label="Modo de juego">
              <button type="button" aria-pressed={!imageMode} onClick={() => { setPreview(null); setMode('text') }}>Jugar con texto</button>
              <button type="button" aria-pressed={imageMode} onClick={() => { setPreview(null); setMode('image') }}>Jugar con imágenes</button>
            </div>
          </header>

          {imageMode ? <ImageLibrary options={options} addImage={addImage} /> : <div className="setup-fields">
            <form onSubmit={handleAddOption}>
              <label htmlFor="option">Una opción</label>
              <div className="input-row">
                <input id="option" value={optionText} onChange={(event) => setOptionText(event.target.value)} placeholder="Ej. Akuma" />
                <button type="submit">Añadir</button>
              </div>
            </form>

            <form onSubmit={handleAddOptions}>
              <label htmlFor="bulk-options">Varias opciones</label>
              <textarea id="bulk-options" rows={4} value={bulkText} onChange={(event) => setBulkText(event.target.value)} placeholder={'Akuma\nTerry\nMai'} aria-describedby="options-help" />
              <p id="options-help" className="hint">Una opción por línea. Las líneas vacías y los duplicados se ignoran.</p>
              <button type="submit">Añadir opciones</button>
            </form>
          </div>}

        </div>

        <div className="setup-column setup-options">
          <section className="options-section" aria-labelledby="options-title">
            <h2 id="options-title">Tus opciones <span className="count" aria-live="polite">{options.length}</span></h2>
            {options.length === 0 ? <p className="empty-state">Todavía no has añadido opciones.</p> : (
              <ul className={`options-list${imageMode ? ' selected-images' : ''}`}>
                {options.map((option) => (
                  <li key={option.id}>
                    {imageMode ? <button className="image-preview-button" type="button" onClick={() => setPreview(option)} aria-label={`Ampliar ${option.label}`}><ImageCard option={option} compact /></button> : <span>{option.label}</span>}
                    {imageMode && <span className="image-option-label">{option.label}</span>}
                    <button className="remove-button" type="button" onClick={() => removeOption(option)} aria-label={`Eliminar ${option.label}`}>Eliminar</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <footer>
            <p id="start-help" className="hint" aria-live="polite">
              {canStart ? 'Todo listo para preparar la partida.' : `Necesitas al menos ${MIN_OPTIONS} opciones para comenzar.`}
            </p>
            <button className="start-button" type="button" onClick={startGame} disabled={!canStart} aria-describedby="start-help">COMENZAR</button>
          </footer>
        </div>
      </section>
      {preview && <ImagePreview option={preview} onClose={() => setPreview(null)} />}
    </main>
  )
}
