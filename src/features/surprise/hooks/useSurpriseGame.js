import { useReducer } from 'react'
import { OPTION_MODES } from '../../../shared/constants/optionModes.js'
import { initialSurpriseState, revealedCount, surpriseReducer } from '../utils/surpriseState.js'

export function useSurpriseGame() {
  const [state, dispatch] = useReducer(surpriseReducer, undefined, initialSurpriseState)
  return {
    ...state,
    options: state.drafts[state.mode],
    count: revealedCount(state.cards),
    selectedCard: state.cards.find((card) => card.id === state.selectedId) ?? null,
    setMode: (mode) => dispatch({ type: 'mode', mode }),
    addText: (label, description) => dispatch({ type: 'add', card: { id: crypto.randomUUID(), type: OPTION_MODES.TEXT, label: label.trim(), description: description.trim() } }),
    addImage: (card) => dispatch({ type: 'add', card }),
    describe: (id, description) => dispatch({ type: 'describe', id, description }),
    remove: (id) => dispatch({ type: 'remove', id }),
    start: () => dispatch({ type: 'start' }),
    select: (id) => dispatch({ type: 'select', id }),
    reveal: (id) => dispatch({ type: 'reveal', id }),
    close: () => dispatch({ type: 'close' }),
    exit: () => dispatch({ type: 'exit' }),
  }
}
