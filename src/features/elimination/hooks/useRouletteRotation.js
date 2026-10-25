import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { DRAG_THRESHOLD, RADIANS_PER_PIXEL, KEY_ROTATION, FULL_TURN, STOP_VELOCITY, inertiaStep, releaseVelocity } from '../utils/rouletteInertia.js'
import { MAX_FRAME_SECONDS, VELOCITY_SAMPLE_WEIGHT, VELOCITY_HISTORY_WEIGHT } from '../config/roulettePhysics.js'

export function useRouletteRotation(disabled) {
  const [rotation, setRotation] = useState(0)
  const [dragging, setDragging] = useState(false)
  const rotationRef = useRef(0)
  const gestureRef = useRef(null)
  const frameRef = useRef(null)
  const suppressClickRef = useRef(false)
  const reducedMotion = useReducedMotion()

  function stopInertia() {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = null
  }

  useEffect(() => {
    if (disabled || reducedMotion) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      gestureRef.current = null
    }
    return () => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      gestureRef.current = null
    }
  }, [disabled, reducedMotion])

  function rotate(offset) {
    rotationRef.current = offset % FULL_TURN
    setRotation(rotationRef.current)
  }

  function startInertia(initialVelocity) {
    if (reducedMotion || Math.abs(initialVelocity) < STOP_VELOCITY) return
    let velocity = initialVelocity
    let previousTime = performance.now()
    function frame(time) {
      const step = inertiaStep(velocity, Math.min((time - previousTime) / 1000, MAX_FRAME_SECONDS))
      previousTime = time
      velocity = step.velocity
      rotate(rotationRef.current + step.delta)
      frameRef.current = Math.abs(velocity) >= STOP_VELOCITY ? requestAnimationFrame(frame) : null
    }
    frameRef.current = requestAnimationFrame(frame)
  }

  function onPointerDown(event) {
    if (disabled || !event.isPrimary || event.button !== 0) return
    stopInertia()
    suppressClickRef.current = false
    setDragging(false)
    gestureRef.current = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      offset: rotationRef.current, dragging: false,
      lastX: event.clientX, lastTime: performance.now(), velocity: 0,
    }
  }

  function onPointerMove(event) {
    const gesture = gestureRef.current
    if (disabled || !gesture || gesture.id !== event.pointerId) return
    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y
    if (!gesture.dragging && Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      gesture.dragging = true
      suppressClickRef.current = true
      setDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const time = performance.now()
    const elapsed = time - gesture.lastTime
    if (gesture.dragging) {
      if (elapsed > 0 && event.clientX !== gesture.lastX) {
        const velocity = -(event.clientX - gesture.lastX) * RADIANS_PER_PIXEL / (elapsed / 1000)
        gesture.velocity = gesture.velocity * VELOCITY_HISTORY_WEIGHT + velocity * VELOCITY_SAMPLE_WEIGHT
        gesture.lastX = event.clientX
        gesture.lastTime = time
      }
      rotate(gesture.offset - dx * RADIANS_PER_PIXEL)
    }
  }

  function endGesture(event) {
    const gesture = gestureRef.current
    if (gesture?.id !== event.pointerId) return
    gestureRef.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!disabled && gesture.dragging && event.type === 'pointerup') {
      startInertia(releaseVelocity(gesture.velocity, performance.now() - gesture.lastTime))
    }
  }

  function onClickCapture(event) {
    if (disabled) return
    if (suppressClickRef.current && event.detail !== 0) {
      event.preventDefault()
      event.stopPropagation()
      suppressClickRef.current = false
    } else stopInertia()
  }

  function onKeyDown(event) {
    if (disabled || event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    stopInertia()
    rotate(rotationRef.current + (event.key === 'ArrowLeft' ? -KEY_ROTATION : KEY_ROTATION))
  }

  return {
    rotation, dragging: dragging && !disabled,
    interactionProps: { onPointerDown, onPointerMove, onPointerUp: endGesture, onPointerCancel: endGesture, onLostPointerCapture: endGesture, onClickCapture, onKeyDown },
  }
}
