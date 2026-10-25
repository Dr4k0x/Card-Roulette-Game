import { useId } from 'react'
import { motion as Motion } from 'motion/react'
import { PackFoilArtwork, PackFoilDefinitions } from './PackArtwork.jsx'
import './PackAppearance.css'

// One contour in one coordinate system; neither piece invents its own edge.
const TEAR_EDGE = 'M0 27 L4 25 L7 28 L12 23 L15 25 L19 24 L22 29 L25 26 L31 27 L34 22 L38 25 L43 24 L46 28 L48 26 L54 29 L59 23 L62 26 L68 24 L71 28 L75 25 L81 27 L84 22 L87 26 L92 24 L96 28 L100 25'
const BODY_PATH = `${TEAR_EDGE} L100 160 L0 160 Z`
const TOP_PATH = `${TEAR_EDGE} L100 0 L0 0 Z`

export default function TornPack({ stage, reducedMotion, children }) {
  const id = `foil-${useId().replaceAll(':', '')}`
  const torn = !['entering', 'tearing'].includes(stage)
  const tearing = stage === 'tearing'

  return (
    <Motion.div className={`torn-pack${torn ? ' is-torn' : ''}`}
      initial={reducedMotion ? false : { opacity: 0, y: 24, scale: .94 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: tearing && !reducedMotion ? [0, -1.2, .8, -.5, 0] : 0 }}
      transition={{ duration: reducedMotion ? 0 : tearing ? .45 : .5 }}>
      <svg className="foil-definitions" width="0" height="0">
        <PackFoilDefinitions id={id} />
        <defs>
          <clipPath id={`${id}-body`}><path d={BODY_PATH} /></clipPath>
          <clipPath id={`${id}-top`}><path d={TOP_PATH} /></clipPath>
        </defs>
      </svg>
      <svg className="foil-interior" viewBox="0 0 100 160" preserveAspectRatio="none">
        <path d={BODY_PATH} fill="#05070d" />
        {torn && <path d={TEAR_EDGE} fill="none" stroke="#8d9bad" strokeWidth="2.3" />}
      </svg>
      {children}
      <svg className="foil-front" viewBox="0 0 100 160" preserveAspectRatio="none">
        <g clipPath={`url(#${id}-body)`}><PackFoilArtwork id={id} /></g>
        {torn && <><path d={TEAR_EDGE} fill="none" stroke="#03050a" strokeWidth="2.2" /><path d={TEAR_EDGE} fill="none" stroke="#ccd6e4" strokeWidth=".65" /></>}
      </svg>
      <Motion.svg className="foil-top" viewBox="0 0 100 160" preserveAspectRatio="none"
        initial={false} style={{ originX: .16, originY: .16 }}
        animate={{ y: torn ? '-29%' : 0, x: torn ? '8%' : 0, rotate: torn ? -13 : tearing ? -1 : 0, opacity: torn ? 0 : 1 }}
        transition={{ duration: reducedMotion ? 0 : .6, opacity: { delay: reducedMotion ? 0 : torn ? .3 : 0, duration: reducedMotion ? 0 : .3 }, ease: [.22, .7, .3, 1] }}>
        <g clipPath={`url(#${id}-top)`}><PackFoilArtwork id={id} /></g>
        {torn && <path d={TEAR_EDGE} fill="none" stroke="#ccd6e4" strokeWidth=".7" />}
      </Motion.svg>
      {tearing && <svg className="foil-tear-glint" viewBox="0 0 100 160" preserveAspectRatio="none">
        <Motion.path d={TEAR_EDGE} fill="none" stroke="#e2eeff" strokeWidth="1.1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : .43, ease: 'linear' }} />
      </svg>}
    </Motion.div>
  )
}
