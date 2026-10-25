import { motion as Motion } from 'motion/react'
import TornPack from './TornPack.jsx'
import ImageCard from '../../../shared/components/ImageCard.jsx'
import { optionLabel } from '../utils/gameOptions.js'

export default function RevealPack({ option, stage, reducedMotion, mode = 'elimination' }) {
  const isWinner = mode === 'winner'
  const emerged = ['emerging', 'revealing', 'result', 'retiring', 'ready'].includes(stage)
  const revealed = ['revealing', 'result', 'retiring', 'ready'].includes(stage)
  // The sequence still gates confirmation; its last phases keep the result on display.
  const result = ['result', 'retiring', 'ready'].includes(stage)
  const label = optionLabel(option)
  const imageMode = option.type === 'image'
  const nameSize = label.length > 40 ? 'long' : label.length > 22 ? 'medium' : 'short'
  const transition = { duration: reducedMotion ? 0 : .85, ease: [.22, .7, .3, 1] }

  return (
    <div className={`reveal-stage reveal-phase-${stage}${isWinner ? ' reveal-stage-winner' : ''}`} aria-hidden="true">
      <TornPack stage={stage} reducedMotion={reducedMotion}>
        <div className={`card-extraction-channel${revealed ? ' is-clear' : ''}`}>
          <Motion.div
            className="reveal-card-slot"
            initial={false}
            animate={{
              opacity: 1,
              y: result ? '-58%' : emerged ? '-95%' : '0%',
              scale: result ? 2 : revealed ? 1.12 : 1,
            }}
            transition={{ ...transition, opacity: { duration: reducedMotion ? .2 : .4 }, scale: { duration: reducedMotion ? 0 : .7 } }}
          >
            <Motion.div
              className="reveal-card"
              initial={false}
              animate={{ rotateY: revealed ? 180 : 0 }}
              transition={{ ...transition, duration: reducedMotion ? 0 : .7, ease: 'easeInOut' }}
            >
              <div className="reveal-card-face reveal-card-back">
                <span className="card-collection">THE CHOICE COLLECTION</span>
                <span className="card-emblem">◇<span>✦</span></span>
                <span className="card-back-label">PACK ELIMINATION</span>
              </div>
              <div className={`reveal-card-face reveal-card-front card-name-${nameSize}${imageMode ? ' reveal-image-front' : ''}`}>
                {imageMode ? <ImageCard option={option} /> : <>
                <span className="card-kicker">{isWinner ? 'LA OPCIÓN ELEGIDA' : 'OPCIÓN REVELADA'}</span>
                <span className="card-front-symbol">✦</span>
                <div className="card-name-area"><p className="card-option">{label}</p></div>
                <span className="card-footer">THE CHOICE COLLECTION · REVEALED</span>
                </>}
              </div>
            </Motion.div>
          </Motion.div>
        </div>
      </TornPack>
      {result && (
        <div className="reveal-stamp-position">
          <Motion.div
            className="reveal-stamp"
            initial={reducedMotion ? false : { opacity: 0, scale: 1.5, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: isWinner || reducedMotion ? 0 : -7 }}
            transition={{ duration: reducedMotion ? 0 : .25 }}
          >{isWinner ? 'GANADOR' : 'ELIMINADA'}</Motion.div>
        </div>
      )}
    </div>
  )
}
