import { useEffect, useRef, useState } from 'react'
import { IMAGE_LIBRARY } from '../constants/imageLibrary.js'
import ImageCard from './ImageCard.jsx'
import './ImageLibrary.css'

export function ImagePreview({ option, onClose }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return (
    <dialog className="image-preview" ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }} aria-label={`Vista ampliada: ${option.label}`}>
      <ImageCard option={option} />
      <p>{option.label}</p>
      <button type="button" autoFocus onClick={onClose}>Cerrar vista</button>
    </dialog>
  )
}

export default function ImageLibrary({ options, addImage }) {
  const [preview, setPreview] = useState(null)
  const selectedIds = new Set(options.map((option) => option.id))
  return (
    <section className="image-library" aria-label="Biblioteca local de imágenes">
      <p className="hint">Elige tus cartas. Puedes ampliarlas antes de añadirlas.</p>
      {IMAGE_LIBRARY.length === 0 ? <p className="empty-state">La biblioteca está vacía. Coloca imágenes en <code>src/assets/image-mode-library/</code> y reinicia Vite para descubrirlas.</p> : (
        <div className="image-library-grid">
          {IMAGE_LIBRARY.map((option) => (
            <div className="image-library-item" key={option.id}>
              <button type="button" className="image-preview-button" onClick={() => setPreview(option)} aria-label={`Ampliar ${option.label}`}><ImageCard option={option} compact /></button>
              <span className="image-option-label">{option.label}</span>
              <button type="button" disabled={selectedIds.has(option.id)} onClick={() => addImage(option)} aria-label={`Añadir ${option.label}`}>{selectedIds.has(option.id) ? 'Añadida ✓' : 'Añadir'}</button>
            </div>
          ))}
        </div>
      )}
      {preview && <ImagePreview option={preview} onClose={() => setPreview(null)} />}
    </section>
  )
}
