import assert from 'node:assert/strict'
import { test } from 'node:test'
import { addTextCandidates, imageOption, optionLabel } from '../src/features/elimination/utils/gameOptions.js'
import { inertiaStep, releaseVelocity, MAX_VELOCITY, STOP_VELOCITY } from '../src/features/elimination/utils/rouletteInertia.js'

test('text normalization keeps order, trims names and ignores case-insensitive duplicates', () => {
  const initial = addTextCandidates([], [' Akuma ', '', 'Terry', 'AKUMA'])
  const options = addTextCandidates(initial, ['terry', 'Mai'])
  assert.deepEqual(options.map(optionLabel), ['Akuma', 'Terry', 'Mai'])
  assert.equal(new Set(options.map((option) => option.id)).size, 3)
  assert.ok(options.every((option) => option.type === 'text'))
})

test('images retain source URLs and distinguish files with the same display label', () => {
  const first = imageOption('/library/one/mi_carta.PNG', '/assets/card-123.png')
  const second = imageOption('/library/two/mi_carta.jpg', '/assets/card-456.jpg')
  assert.equal(first.label, 'mi carta')
  assert.equal(first.type, 'image')
  assert.equal(first.imageSrc, '/assets/card-123.png')
  assert.notEqual(first.id, second.id)
})

test('inertia decays smoothly in either direction and comes to rest within two seconds', () => {
  for (const direction of [-1, 1]) {
    let velocity = MAX_VELOCITY * direction
    let travel = 0
    for (let frame = 0; frame < 120; frame++) {
      const step = inertiaStep(velocity, 1 / 60)
      assert.equal(Math.sign(step.delta), direction)
      assert.ok(Math.abs(step.velocity) < Math.abs(velocity))
      velocity = step.velocity
      travel += step.delta
    }
    assert.ok(Math.abs(velocity) < STOP_VELOCITY)
    assert.ok(Math.abs(travel) < 1, 'bounded, controlled travel')
  }
})

test('travel is independent of frame rate; stationary releases do not spin', () => {
  function travelAt(rate) {
    let velocity = 3
    let travel = 0
    for (let frame = 0; frame < rate; frame++) {
      const step = inertiaStep(velocity, 1 / rate)
      velocity = step.velocity
      travel += step.delta
    }
    return travel
  }
  assert.ok(Math.abs(travelAt(30) - travelAt(144)) < 1e-10)
  assert.equal(releaseVelocity(3, 200), 0)
  assert.equal(releaseVelocity(20, 0), MAX_VELOCITY)
  assert.equal(releaseVelocity(-20, 0), -MAX_VELOCITY)
})
