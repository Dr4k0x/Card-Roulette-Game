import assert from 'node:assert/strict'
import { test } from 'node:test'
import { scheduleRevealSequence, RESULT_HOLD_MS } from '../src/features/elimination/hooks/revealSequence.js'

function harness(options = {}) {
  let now = 0
  let id = 0
  const pending = new Map()
  const stages = []
  const dispose = scheduleRevealSequence({
    ...options,
    onStage: stage => stages.push({ stage, at: now }),
    schedule: (callback, delay) => { pending.set(++id, { callback, at: delay }); return id },
    cancel: key => pending.delete(key),
  })
  return {
    stages, pending, dispose,
    advance(to) {
      const due = [...pending].filter(([, timer]) => timer.at <= to).sort((a, b) => a[1].at - b[1].at)
      for (const [key, timer] of due) { now = timer.at; pending.delete(key); timer.callback() }
      now = to
    },
  }
}

test('normal and final presentation hold the fully flipped result for three seconds, then fade before ready', () => {
  for (const delay of [0, 700]) {
    const h = harness({ delay })
    h.advance(3400 + delay)
    assert.equal(h.stages.at(-1).stage, 'result')
    h.advance(3400 + delay + RESULT_HOLD_MS - 1)
    assert.equal(h.stages.at(-1).stage, 'result')
    h.advance(3400 + delay + RESULT_HOLD_MS)
    assert.equal(h.stages.at(-1).stage, 'retiring')
    h.advance(6850 + delay)
    assert.equal(h.stages.at(-1).stage, 'ready')
    assert.deepEqual(h.stages.map(item => item.stage), ['entering', 'tearing', 'opening', 'emerging', 'revealing', 'result', 'retiring', 'ready'])
  }
})

test('reduced motion skips physical animation and retains the reading interval', () => {
  const h = harness({ reducedMotion: true, delay: 700 })
  h.advance(RESULT_HOLD_MS - 1)
  assert.deepEqual(h.stages, [])
  h.advance(RESULT_HOLD_MS + 200)
  assert.deepEqual(h.stages.map(item => item.stage), ['retiring', 'ready'])
})

test('unmount or preference change cancels every pending presentation update', () => {
  for (const reducedMotion of [false, true]) {
    const h = harness({ reducedMotion })
    h.advance(800)
    const before = [...h.stages]
    h.dispose()
    assert.equal(h.pending.size, 0)
    h.advance(20000)
    assert.deepEqual(h.stages, before)
  }
})
