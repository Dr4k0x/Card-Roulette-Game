import { useEffect, useRef, useState } from 'react'
import { createHoldChargeController } from './holdChargeController.js'

const HOLD_KEYS = [' ', 'Enter']

export function useHoldCharge(onSelect, disabled) {
  const [charge, setCharge] = useState(null)
  const [completedId, setCompletedId] = useState(null)
  const onSelectRef = useRef(onSelect)
  const controllerRef = useRef(null)

  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])
  useEffect(() => { if (disabled) controllerRef.current?.cancel() }, [disabled])
  useEffect(() => {
    const controller = createHoldChargeController({
      onProgress: (id, progress) => setCharge({ id, progress }),
      onCancel: () => setCharge(null),
      onComplete: (id) => {
        setCompletedId(id)
        setCharge(null)
        onSelectRef.current(id)
      },
    })
    controllerRef.current = controller
    const cancel = () => controller.cancel()
    const pointerEnd = (event) => controller.cancel({ type: 'pointer', id: event.pointerId })
    const keyEnd = (event) => controller.cancel({ type: 'keyboard', id: event.key })
    const visibility = () => { if (document.hidden) cancel() }
    window.addEventListener('blur', cancel)
    window.addEventListener('pointerup', pointerEnd)
    window.addEventListener('pointercancel', pointerEnd)
    window.addEventListener('keyup', keyEnd)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      controller.dispose()
      controllerRef.current = null
      window.removeEventListener('blur', cancel)
      window.removeEventListener('pointerup', pointerEnd)
      window.removeEventListener('pointercancel', pointerEnd)
      window.removeEventListener('keyup', keyEnd)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  function interactionProps(id) {
    return {
      onPointerDown: (event) => {
        if (disabled || !event.isPrimary || event.button !== 0) return
        event.preventDefault()
        event.currentTarget.focus()
        controllerRef.current?.start(id, { type: 'pointer', id: event.pointerId })
      },
      onPointerUp: (event) => controllerRef.current?.cancel({ type: 'pointer', id: event.pointerId }),
      onPointerCancel: (event) => controllerRef.current?.cancel({ type: 'pointer', id: event.pointerId }),
      onLostPointerCapture: (event) => controllerRef.current?.cancel({ type: 'pointer', id: event.pointerId }),
      onPointerLeave: (event) => controllerRef.current?.cancel({ type: 'pointer', id: event.pointerId }),
      onBlur: () => controllerRef.current?.cancel(),
      onKeyDown: (event) => {
        if (!HOLD_KEYS.includes(event.key)) return
        event.preventDefault()
        if (!disabled && !event.repeat) controllerRef.current?.start(id, { type: 'keyboard', id: event.key })
      },
      onKeyUp: (event) => {
        if (!HOLD_KEYS.includes(event.key)) return
        event.preventDefault()
        controllerRef.current?.cancel({ type: 'keyboard', id: event.key })
      },
      onContextMenu: (event) => event.preventDefault(),
    }
  }

  return { charge, completedId, interactionProps }
}
