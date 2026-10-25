import { motion as Motion, useReducedMotion } from 'motion/react'

const DECORATIONS = [
  { x: '5%', y: '9%', angle: -18, tone: 'blue', duration: 28, delay: -4, size: 64, sway: 24 },
  { x: '17%', y: '25%', angle: 12, tone: 'gray', duration: 34, delay: -19, size: 48, sway: -18 },
  { x: '28%', y: '4%', angle: -12, tone: 'red', duration: 31, delay: -9, size: 76, sway: 30 },
  { x: '42%', y: '14%', angle: 22, tone: 'blue', duration: 37, delay: -26, size: 54, sway: -26 },
  { x: '56%', y: '6%', angle: 14, tone: 'gray', duration: 30, delay: -15, size: 62, sway: 20 },
  { x: '71%', y: '18%', angle: -16, tone: 'red', duration: 35, delay: -3, size: 70, sway: -24 },
  { x: '86%', y: '39%', angle: -9, tone: 'blue', duration: 29, delay: -22, size: 58, sway: 16 },
  { x: '95%', y: '73%', angle: 11, tone: 'gray', duration: 38, delay: -12, size: 44, sway: -18 },
  { x: '8%', y: '65%', angle: 20, tone: 'red', duration: 33, delay: -28, size: 72, sway: 28 },
  { x: '21%', y: '85%', angle: -21, tone: 'blue', duration: 36, delay: -7, size: 52, sway: -22 },
  { x: '37%', y: '91%', angle: 8, tone: 'gray', duration: 32, delay: -24, size: 60, sway: 18 },
  { x: '64%', y: '89%', angle: -14, tone: 'red', duration: 39, delay: -17, size: 46, sway: -30 },
  { x: '79%', y: '68%', angle: 17, tone: 'blue', duration: 30, delay: -11, size: 78, sway: 24 },
  { x: '92%', y: '12%', angle: -24, tone: 'red', duration: 34, delay: -30, size: 56, sway: -16 },
]

export default function SetupBackground() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="setup-background" aria-hidden="true">
      {DECORATIONS.map(({ x, y, angle, tone, duration, delay, size, sway }, index) => (
        <Motion.span
          key={index}
          className={`setup-decoration decoration-${tone}`}
          style={{ left: x, top: reducedMotion ? y : 0, width: `clamp(34px, ${size / 14}vw, ${size}px)` }}
          initial={reducedMotion ? false : { x: 0, y: '-25vh', rotate: angle }}
          animate={reducedMotion ? { x: 0, y: 0, rotate: angle } : {
            x: [0, sway, -sway / 2, 0], y: ['-25vh', '125vh'], rotate: [angle, angle + 35, angle - 15, angle + 60],
          }}
          transition={reducedMotion ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: 'linear' }}
        ><span>◇</span></Motion.span>
      ))}
    </div>
  )
}
