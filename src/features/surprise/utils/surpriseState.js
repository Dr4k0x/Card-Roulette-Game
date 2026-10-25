import { MIN_CARDS, SURPRISE_STATES } from '../constants/surpriseStates.js'
import { OPTION_MODES } from '../../../shared/constants/optionModes.js'

export function initialSurpriseState() {
  return { phase: SURPRISE_STATES.SETUP, mode: OPTION_MODES.TEXT, drafts: { text: [], image: [] }, cards: [], selectedId: null }
}

export function revealedCount(cards) {
  return cards.filter((card) => card.revealed).length
}

export function surpriseReducer(state, action) {
  if (state.phase === SURPRISE_STATES.SETUP) {
    const draft = state.drafts[state.mode]
    switch (action.type) {
      case 'mode':
        return Object.values(OPTION_MODES).includes(action.mode) ? { ...state, mode: action.mode } : state
      case 'add':
        if (action.card.type !== state.mode || !action.card.label.trim() || draft.some((card) => card.id === action.card.id)) return state
        return { ...state, drafts: { ...state.drafts, [state.mode]: [...draft, { ...action.card, description: action.card.description ?? '' }] } }
      case 'remove':
        return { ...state, drafts: { ...state.drafts, [state.mode]: draft.filter((card) => card.id !== action.id) } }
      case 'describe':
        return { ...state, drafts: { ...state.drafts, [state.mode]: draft.map((card) => card.id === action.id ? { ...card, description: action.description } : card) } }
      case 'start':
        return draft.length >= MIN_CARDS ? { ...state, phase: SURPRISE_STATES.PLAYING, selectedId: null, cards: draft.map((card) => ({ ...card, revealed: false })) } : state
      default:
        return state
    }
  }
  switch (action.type) {
    case 'select':
      return state.selectedId === null && state.cards.some((card) => card.id === action.id) ? { ...state, selectedId: action.id } : state
    case 'reveal':
      return state.selectedId === action.id ? { ...state, cards: state.cards.map((card) => card.id === action.id && !card.revealed ? { ...card, revealed: true } : card) } : state
    case 'close':
      return { ...state, selectedId: null }
    case 'exit':
      return revealedCount(state.cards) === state.cards.length ? { ...state, phase: SURPRISE_STATES.SETUP, cards: [], selectedId: null } : state
    default:
      return state
  }
}
