import { useState } from 'react'
import { FINAL_PACK_COUNT, GAME_STATES, MIN_OPTIONS } from '../constants/gameStates.js'
import { addTextCandidates, OPTION_MODES } from '../utils/gameOptions.js'
import { shuffle } from '../utils/shuffle.js'

export function useEliminationGame() {
  const [game, setGame] = useState({
    options: [],
    mode: OPTION_MODES.TEXT,
    drafts: { text: [], image: [] },
    gameState: GAME_STATES.SETUP,
    activePacks: [],
    eliminatedOptions: [],
    selectedPack: null,
    finalSelectedPack: null,
  })

  function addCandidates(candidates) {
    setGame((current) => current.gameState === GAME_STATES.SETUP && current.mode === OPTION_MODES.TEXT
      ? { ...current, options: addTextCandidates(current.options, candidates) }
      : current)
  }

  function addOption(option) {
    addCandidates([option])
  }

  function addOptions(text) {
    addCandidates(text.split(/\r\n|\n|\r/))
  }

  function removeOption(option) {
    setGame((current) => current.gameState === GAME_STATES.SETUP
      ? { ...current, options: current.options.filter((item) => item.id !== option.id) }
      : current)
  }

  function setMode(mode) {
    setGame((current) => current.gameState === GAME_STATES.SETUP && Object.values(OPTION_MODES).includes(mode) && mode !== current.mode
      ? { ...current, mode, drafts: { ...current.drafts, [current.mode]: current.options }, options: current.drafts[mode] }
      : current)
  }

  function addImage(option) {
    setGame((current) => current.gameState === GAME_STATES.SETUP && current.mode === OPTION_MODES.IMAGE && option.type === OPTION_MODES.IMAGE && !current.options.some((item) => item.id === option.id)
      ? { ...current, options: [...current.options, option] }
      : current)
  }

  function startGame() {
    if (game.gameState !== GAME_STATES.SETUP || game.options.length < MIN_OPTIONS) return

    // Keep random generation outside React's state updater (replayed in StrictMode).
    const activePacks = shuffle(game.options).map((option) => ({
      id: crypto.randomUUID(),
      option,
    }))

    setGame((current) => current.gameState === GAME_STATES.SETUP
      ? { ...current, activePacks, eliminatedOptions: [], selectedPack: null, finalSelectedPack: null, gameState: GAME_STATES.PLAYING }
      : current)
  }

  function selectPack(packId) {
    setGame((current) => {
      if (current.gameState !== GAME_STATES.PLAYING || current.activePacks.length <= FINAL_PACK_COUNT) return current

      const selectedPack = current.activePacks.find((pack) => pack.id === packId)
      if (!selectedPack) return current

      return { ...current, selectedPack, gameState: GAME_STATES.REVEAL }
    })
  }

  function continueAfterReveal() {
    setGame((current) => {
      if (current.gameState !== GAME_STATES.REVEAL || !current.selectedPack) return current
      if (current.activePacks.length <= FINAL_PACK_COUNT) return current

      const selectedPack = current.activePacks.find((pack) => pack.id === current.selectedPack.id)
      if (!selectedPack) return current

      const activePacks = current.activePacks.filter((pack) => pack.id !== selectedPack.id)

      return {
        ...current,
        activePacks,
        eliminatedOptions: [...current.eliminatedOptions, selectedPack.option],
        selectedPack: null,
        gameState: activePacks.length === FINAL_PACK_COUNT ? GAME_STATES.FINAL : GAME_STATES.PLAYING,
      }
    })
  }

  function selectFinalPack(packId) {
    setGame((current) => {
      if (current.gameState !== GAME_STATES.FINAL || current.activePacks.length !== FINAL_PACK_COUNT || current.finalSelectedPack) return current

      const finalSelectedPack = current.activePacks.find((pack) => pack.id === packId)
      if (!finalSelectedPack) return current

      return { ...current, finalSelectedPack }
    })
  }

  function confirmWinner() {
    setGame((current) => current.gameState === GAME_STATES.FINAL && current.finalSelectedPack
      ? { ...current, gameState: GAME_STATES.WINNER }
      : current)
  }

  function resetGame() {
    setGame((current) => current.gameState === GAME_STATES.WINNER
      ? { ...current, gameState: GAME_STATES.SETUP, activePacks: [], eliminatedOptions: [], selectedPack: null, finalSelectedPack: null }
      : current)
  }

  // One source of truth: the chosen finalist determines the winner.
  const winner = game.finalSelectedPack?.option ?? null

  return { ...game, winner, setMode, addImage, addOption, addOptions, removeOption, startGame, selectPack, continueAfterReveal, selectFinalPack, confirmWinner, resetGame }
}
