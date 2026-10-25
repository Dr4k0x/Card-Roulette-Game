import { useId } from 'react'

export function PackFoilArtwork({ id }) {
  return (
    <g>
      <rect width="100" height="160" fill={`url(#${id}-foil)`} />
      <rect x="1" y="1" width="98" height="158" fill="none" stroke={`url(#${id}-rgb)`} strokeWidth="2" />
      <rect x="3" y="3" width="94" height="10" fill={`url(#${id}-crimp)`} />
      <rect x="3" y="148" width="94" height="10" fill={`url(#${id}-crimp)`} />
      <path d="M8 34 L92 34 L92 141 L8 141 Z M11 36 L35 139 M70 36 L91 112" fill="none" stroke="#79a9ff" strokeOpacity=".24" strokeWidth=".5" />
      <path d="M0 18 Q45 12 100 19 M0 31 Q60 37 100 30" fill="none" stroke="#e0e7f0" strokeOpacity=".18" strokeWidth=".6" />
      <text x="50" y="43" textAnchor="middle" fill="#a6afbf" fontSize="3.5" letterSpacing=".8">THE CHOICE COLLECTION</text>
      <path d="M50 53 L72 78 L50 103 L28 78 Z" fill="none" stroke="#79a9ff" strokeWidth="1.3" />
      <text x="50" y="86" textAnchor="middle" fill="#79a9ff" fontSize="25">✦</text>
      <text x="50" y="117" textAnchor="middle" fill="#f7f7f8" fontWeight="800" fontSize="9" letterSpacing="1">PACK</text>
      <text x="50" y="128" textAnchor="middle" fill="#f7f7f8" fontWeight="800" fontSize="7" letterSpacing=".7">ELIMINATION</text>
      <text x="50" y="140" textAnchor="middle" fill="#a6afbf" fontSize="3.3" letterSpacing=".5">UNA OPCIÓN · UN DESTINO</text>
      <rect width="100" height="160" fill={`url(#${id}-shine)`} />
    </g>
  )
}

export function PackFoilDefinitions({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-foil`} x2="1" y2=".35">
        <stop stopColor="#080b10" /><stop offset=".24" stopColor="#273241" /><stop offset=".43" stopColor="#10151e" /><stop offset=".52" stopColor="#536071" /><stop offset=".59" stopColor="#1b2431" /><stop offset="1" stopColor="#080b10" />
      </linearGradient>
      <linearGradient id={`${id}-rgb`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ee5263" /><stop offset=".18" stopColor="#ee9852" /><stop offset=".35" stopColor="#62d790" /><stop offset=".52" stopColor="#55dce1" /><stop offset=".7" stopColor="#5488ef" /><stop offset=".86" stopColor="#ad70e6" /><stop offset="1" stopColor="#ee5263" /></linearGradient>
      <linearGradient id={`${id}-shine`} x1="0" y1="1" x2="1" y2="0"><stop offset=".35" stopColor="#ffffff" stopOpacity="0" /><stop offset=".5" stopColor="#ffffff" stopOpacity=".13" /><stop offset=".6" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
      <pattern id={`${id}-crimp`} width="2" height="10" patternUnits="userSpaceOnUse"><rect width="1" height="10" fill="#596477" /><rect x="1" width="1" height="10" fill="#111620" /></pattern>
    </defs>
  )
}

export default function PackArtwork() {
  const id = `closed-foil-${useId().replaceAll(':', '')}`
  return (
    <svg className="pack-artwork" viewBox="0 0 100 160" aria-hidden="true">
      <PackFoilDefinitions id={id} />
      <PackFoilArtwork id={id} />
    </svg>
  )
}
