import assert from 'node:assert/strict'
import { test } from 'node:test'
import { initialSurpriseState, surpriseReducer, revealedCount } from '../src/features/surprise/utils/surpriseState.js'
import { snakePosition } from '../src/features/surprise/utils/snakePositions.js'

const reduce = surpriseReducer
const card = (id, type = 'text') => ({ id, type, label: `Carta ${id}`, ...(type === 'image' ? { imageSrc: `/library/${id}.png` } : {}), description: 'Uno\nDos\nTres\nCuatro' })

test('requires one card, preserves separate drafts and refuses setup mutations during a session', () => {
  let state = initialSurpriseState()
  assert.equal(reduce(state, { type: 'start' }), state)
  state = reduce(state, { type: 'add', card: card('a') })
  state = reduce(state, { type: 'mode', mode: 'image' })
  state = reduce(state, { type: 'add', card: card('img', 'image') })
  assert.equal(reduce(state, { type: 'add', card: card('img', 'image') }), state)
  state = reduce(state, { type: 'start' })
  assert.equal(state.cards.length, 1)
  assert.equal(state.cards[0].imageSrc, '/library/img.png')
  assert.equal(state.cards[0].revealed, false)
  for (const action of [{ type: 'mode', mode: 'text' }, { type: 'add', card: card('b') }, { type: 'describe', id: 'img', description: 'changed' }, { type: 'remove', id: 'img' }, { type: 'start' }, { type: 'exit' }]) assert.equal(reduce(state, action), state)
  assert.equal(state.drafts.text.length, 1)
})

for (const count of [1, 6, 12, 120]) {
  test(`${count} cards reveal independently in arbitrary order; reopen, exit and replay preserve identities and preparation`, () => {
    let state = initialSurpriseState()
    for (let index = 0; index < count; index++) state = reduce(state, { type: 'add', card: card(String(index)) })
    state = reduce(state, { type: 'start' })
    const ids = state.cards.map((item) => item.id)
    const drafts = state.drafts
    assert.equal(reduce(state, { type: 'reveal', id: '0' }), state)
    assert.equal(reduce(state, { type: 'select', id: 'invalid' }), state)
    state = reduce(state, { type: 'select', id: '0' })
    state = reduce(state, { type: 'close' })
    assert.equal(revealedCount(state.cards), 0, 'closing before completion does not reveal')
    for (const id of [...ids].reverse()) {
      state = reduce(state, { type: 'select', id })
      const wrong = ids.find((candidate) => candidate !== id)
      if (wrong) assert.equal(reduce(state, { type: 'reveal', id: wrong }), state)
      state = reduce(state, { type: 'reveal', id })
      const revealed = revealedCount(state.cards)
      state = reduce(state, { type: 'reveal', id })
      assert.equal(revealedCount(state.cards), revealed, 'double completion is idempotent')
      state = reduce(state, { type: 'close' })
      assert.deepEqual(state.cards.map((item) => item.id), ids)
      state = reduce(state, { type: 'select', id })
      assert.ok(state.cards.find((item) => item.id === id).revealed)
      state = reduce(state, { type: 'close' })
    }
    assert.equal(revealedCount(state.cards), count)
    assert.equal(state.drafts, drafts)
    state = reduce(state, { type: 'exit' })
    assert.equal(state.phase, 'setup')
    state = reduce(state, { type: 'start' })
    assert.equal(revealedCount(state.cards), 0)
    assert.deepEqual(state.cards.map((item) => item.id), ids)
    assert.equal(state.cards[0].description, 'Uno\nDos\nTres\nCuatro')
  })
}

test('snake changes direction on alternate rows, including incomplete rows and smaller screens', () => {
  assert.deepEqual(Array.from({ length: 12 }, (_, i) => snakePosition(i, 4).gridColumn), [1, 2, 3, 4, 4, 3, 2, 1, 1, 2, 3, 4])
  assert.deepEqual(snakePosition(5, 4), { gridRow: 2, gridColumn: 3 })
  assert.deepEqual(snakePosition(3, 2), { gridRow: 2, gridColumn: 1 })
  assert.deepEqual(snakePosition(2, 1), { gridRow: 3, gridColumn: 1 })
})
