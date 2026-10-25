import { useState } from 'react'
import { motion as Motion, useReducedMotion } from 'motion/react'
import ModalitySelector from './ModalitySelector.jsx'
import SurpriseSetup from '../features/surprise/components/SurpriseSetup.jsx'
import SurpriseBoard from '../features/surprise/components/SurpriseBoard.jsx'
import { useSurpriseGame } from '../features/surprise/hooks/useSurpriseGame.js'
import { SURPRISE_STATES } from '../features/surprise/constants/surpriseStates.js'
import GameBoard from '../features/elimination/components/GameBoard.jsx'
import FinalRound from '../features/elimination/components/FinalRound.jsx'
import RevealModal from '../features/elimination/components/RevealModal.jsx'
import SetupScreen from '../features/elimination/components/SetupScreen.jsx'
import WinnerScreen from '../features/elimination/components/WinnerScreen.jsx'
import StageBackground from '../features/elimination/components/StageBackground.jsx'
import { GAME_STATES } from '../features/elimination/constants/gameStates.js'
import { useEliminationGame } from '../features/elimination/hooks/useEliminationGame.js'
export default function App() {
  const game = useEliminationGame()
  const surpriseGame = useSurpriseGame()
  const [surprise, setSurprise] = useState(false)
  const reduced = useReducedMotion()
  const isSetup = surprise ? surpriseGame.phase === SURPRISE_STATES.SETUP : game.gameState === GAME_STATES.SETUP

  if (isSetup) return <Motion.div key={surprise ? 'surprise' : 'elimination'} className="modality-transition" initial={{ opacity: reduced ? 1 : .5, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .3 }}>
    <ModalitySelector surprise={surprise} onChange={() => setSurprise((current) => !current)} />
    {surprise ? <SurpriseSetup game={surpriseGame} /> : <SetupScreen {...game} />}
  </Motion.div>
  if (surprise) return <SurpriseBoard game={surpriseGame} />

  let screen
  switch (game.gameState) {
    case GAME_STATES.PLAYING:
    case GAME_STATES.REVEAL:
      screen = (
        <>
          <div inert={game.gameState === GAME_STATES.REVEAL} aria-hidden={game.gameState === GAME_STATES.REVEAL ? true : undefined}>
            <GameBoard activePacks={game.activePacks} eliminatedOptions={game.eliminatedOptions} onSelect={game.selectPack} disabled={game.gameState === GAME_STATES.REVEAL} />
          </div>
          {game.gameState === GAME_STATES.REVEAL && <RevealModal key={game.selectedPack.id} selectedPack={game.selectedPack} onContinue={game.continueAfterReveal} />}
        </>
      )
      break
    case GAME_STATES.FINAL:
      return <div className="game-experience"><FinalRound activePacks={game.activePacks} eliminatedOptions={game.eliminatedOptions} finalSelectedPack={game.finalSelectedPack} onSelect={game.selectFinalPack} onConfirm={game.confirmWinner} /></div>
    case GAME_STATES.WINNER:
      screen = <WinnerScreen winner={game.winner} activePacks={game.activePacks} finalSelectedPack={game.finalSelectedPack} eliminatedOptions={game.eliminatedOptions} onReset={game.resetGame} />
      break
    default:
      return null
  }
  return <div className="game-experience"><StageBackground count={game.activePacks.length} />{screen}</div>
}
