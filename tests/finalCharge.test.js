import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createHoldChargeController as createFinalChargeController, HOLD_CHARGE_DURATION as FINAL_CHARGE_DURATION } from '../src/shared/hooks/holdChargeController.js'

function harness() {
  let time = 0
  let nextId = 0
  const frames = new Map()
  const selected = []
  const progress = []
  let cancellations = 0
  const controller = createFinalChargeController({
    now: () => time,
    schedule: (callback) => { frames.set(++nextId, callback); return nextId },
    unschedule: (id) => frames.delete(id),
    onProgress: (id, value) => progress.push({ id, value }),
    onCancel: () => { cancellations++ },
    onComplete: (id) => selected.push(id),
  })
  return { controller, selected, progress, frames, get cancellations() { return cancellations },
    advance(ms) {
      time += ms
      const pending = [...frames.values()]
      frames.clear()
      pending.forEach((callback) => callback())
    },
  }
}

const pointer = { type: 'pointer', id: 1 }

test('a quick click or 0.5 second hold cancels without selecting, and can restart', () => {
  for (const duration of [30, 500]) {
    const h = harness()
    h.controller.start('left', pointer)
    h.advance(duration)
    assert.ok(h.progress.at(-1).value < 1)
    h.controller.cancel(pointer)
    h.advance(FINAL_CHARGE_DURATION)
    assert.deepEqual(h.selected, [])
    assert.equal(h.cancellations, 1)
    assert.equal(h.controller.start('right', pointer), true)
    h.advance(FINAL_CHARGE_DURATION)
    assert.deepEqual(h.selected, ['right'])
  }
})

for (const side of ['left', 'right']) {
  test(`${side}: completes at 1.5 seconds and locks before the callback can reenter`, () => {
    const h = harness()
    assert.equal(h.controller.start(side, pointer), true)
    h.advance(FINAL_CHARGE_DURATION - 1)
    assert.deepEqual(h.selected, [])
    h.advance(1)
    assert.equal(h.progress.at(-1).value, 1)
    assert.deepEqual(h.selected, [side])
    assert.equal(h.controller.start('other', pointer), false)
    h.controller.cancel()
    h.advance(FINAL_CHARGE_DURATION * 2)
    assert.deepEqual(h.selected, [side])
  })
}

test('only one input owns the charge, unrelated releases do not cancel it', () => {
  const h = harness()
  h.controller.start('left', pointer)
  assert.equal(h.controller.start('right', { type: 'pointer', id: 2 }), false)
  assert.equal(h.controller.start('right', { type: 'keyboard', id: 'Enter' }), false)
  h.controller.cancel({ type: 'pointer', id: 2 })
  h.controller.cancel({ type: 'keyboard', id: 'Enter' })
  assert.equal(h.cancellations, 0)
  h.advance(FINAL_CHARGE_DURATION)
  assert.deepEqual(h.selected, ['left'])
})

for (const key of [' ', 'Enter']) {
  test(`keyboard ${JSON.stringify(key)} supports cancellation and full charge`, () => {
    const h = harness()
    const source = { type: 'keyboard', id: key }
    h.controller.start('left', source)
    h.advance(500)
    h.controller.cancel(source)
    h.advance(FINAL_CHARGE_DURATION)
    assert.deepEqual(h.selected, [])
    h.controller.start('right', source)
    h.advance(FINAL_CHARGE_DURATION)
    assert.deepEqual(h.selected, ['right'])
  })
}

test('loss of input or unmount clears the pending animation frame', () => {
  for (const stop of ['cancel', 'dispose']) {
    const h = harness()
    h.controller.start('left', pointer)
    h.advance(400)
    h.controller[stop]()
    assert.equal(h.frames.size, 0)
    h.advance(FINAL_CHARGE_DURATION)
    assert.deepEqual(h.selected, [])
  }
})

test('synchronous reentry from selection callback cannot select again', () => {
  let tick
  let reentry
  const controller = createFinalChargeController({
    now: () => tick ? FINAL_CHARGE_DURATION : 0,
    schedule: (callback) => { tick = callback; return 1 },
    unschedule: () => {},
    onProgress: () => {},
    onCancel: () => {},
    onComplete: () => { reentry = controller.start('right', pointer) },
  })
  controller.start('left', pointer)
  tick()
  assert.equal(reentry, false)
})
