// Background layer: Amsterdam-style canal houses with warm windows, a church
// tower, and a faint network of light nodes on the rooftops (the Xebia touch).
import { rng } from './iso.ts'

const W = 480
const H = 150
const HOUSE = ['#251c4a', '#2c2257', '#211843', '#30245c']
const WINDOW_ON = '#ffcf6b'
const WINDOW_OFF = '#3b2f6b'

/** Stepped gable as stacked rects, the most pixel-friendly roof there is. */
const gable = (x: number, w: number, top: number, fill: string, kind: number) => {
  let out = ''
  if (kind === 0) {
    // stepped gable
    const steps = 3
    for (let i = 0; i < steps; i++) {
      const inset = (i + 1) * Math.floor(w / 8)
      out += `<rect x="${x + inset}" y="${top - (i + 1) * 5}" width="${w - inset * 2}" height="5" fill="${fill}"/>`
    }
  } else if (kind === 1) {
    // bell gable
    out += `<rect x="${x + 2}" y="${top - 5}" width="${w - 4}" height="5" fill="${fill}"/>`
    out += `<rect x="${x + 4}" y="${top - 12}" width="${w - 8}" height="7" fill="${fill}"/>`
    out += `<rect x="${x + w / 2 - 2}" y="${top - 15}" width="4" height="3" fill="${fill}"/>`
  } else {
    // neck gable
    out += `<rect x="${x + w / 4}" y="${top - 12}" width="${w / 2}" height="12" fill="${fill}"/>`
    out += `<rect x="${x + w / 4 - 2}" y="${top - 4}" width="${w / 2 + 4}" height="4" fill="${fill}"/>`
  }
  return out
}

export const skylineSvg = () => {
  const r = rng(42)
  let houses = ''
  let windows = ''
  const nodes: Array<[number, number]> = []
  let x = -4
  let i = 0
  while (x < W) {
    const w = 18 + Math.floor(r() * 4) * 4
    const h = 46 + Math.floor(r() * 7) * 6
    const top = H - h
    const fill = HOUSE[i % HOUSE.length]
    if (i === 7) {
      // church tower
      const tw = 22
      houses += `<rect x="${x}" y="${H - 112}" width="${tw}" height="112" fill="#1e1640"/>`
      houses += `<rect x="${x + 4}" y="${H - 128}" width="${tw - 8}" height="16" fill="#1e1640"/>`
      houses += `<rect x="${x + 8}" y="${H - 146}" width="${tw - 16}" height="18" fill="#1e1640"/>`
      houses += `<rect x="${x + 10}" y="${H - 150}" width="2" height="4" fill="#1e1640"/>`
      windows += `<rect x="${x + 7}" y="${H - 104}" width="8" height="8" fill="#ffe7a8" class="clock"/>`
      windows += `<rect x="${x + 10}" y="${H - 103}" width="1" height="4" fill="#1e1640"/><rect x="${x + 10}" y="${H - 100}" width="3" height="1" fill="#1e1640"/>`
      nodes.push([x + 11, H - 151])
      x += tw + 2
      i++
      continue
    }
    houses += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${fill}"/>`
    houses += gable(x, w, top, fill, i % 3)
    // hoist beam
    houses += `<rect x="${x + w / 2 - 1}" y="${top - 2}" width="2" height="4" fill="#160f33"/>`
    nodes.push([x + w / 2, top - (i % 3 === 0 ? 15 : i % 3 === 1 ? 15 : 12)])
    // windows
    const cols = Math.max(2, Math.floor((w - 4) / 6))
    const rows = Math.floor((h - 14) / 10)
    const gap = (w - cols * 3) / (cols + 1)
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++) {
        const lit = r() < 0.55
        const wx = Math.round(x + gap + col * (3 + gap))
        const wy = top + 6 + row * 10
        windows += `<rect x="${wx}" y="${wy}" width="3" height="5" fill="${lit ? WINDOW_ON : WINDOW_OFF}"${lit && r() < 0.15 ? ' class="flicker"' : ''}/>`
      }
    // door
    houses += `<rect x="${x + w / 2 - 2}" y="${H - 7}" width="4" height="7" fill="#160f33"/>`
    x += w + (r() < 0.3 ? 2 : 0)
    i++
  }

  // rooftop network: a thin line hopping between gables, with a light running along it
  const path = nodes.map(([a, b], n) => `${n ? 'L' : 'M'}${a} ${b}`).join(' ')
  const net = `<g class="net">
      <path d="${path}" fill="none" stroke="#7fe7ff" stroke-opacity=".18" stroke-width=".6"/>
      <path d="${path}" fill="none" stroke="#7fe7ff" stroke-width="1" class="trail" pathLength="100"/>
      ${nodes.map(([a, b], n) => `<rect x="${a - 1}" y="${b - 1}" width="2" height="2" fill="#7fe7ff" class="node" style="animation-delay:${(n % 5) * 0.7}s"/>`).join('')}
    </g>`

  return `<svg class="skyline" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" aria-hidden="true">
    <g class="windows-glow">${windows}</g>${houses}${windows}${net}
  </svg>`
}

/** Pixel stars and a moon, for the sky layer. */
export const starsSvg = () => {
  const r = rng(7)
  let stars = ''
  for (let i = 0; i < 90; i++) {
    const s = r() < 0.15 ? 2 : 1
    stars += `<rect x="${Math.floor(r() * 480)}" y="${Math.floor(r() * 150)}" width="${s}" height="${s}" fill="#fff" class="star" style="animation-delay:${(r() * 4).toFixed(1)}s;opacity:${(0.3 + r() * 0.6).toFixed(2)}"/>`
  }
  const moon = `<g transform="translate(392 22)">
    <rect x="3" y="0" width="8" height="14" fill="#fff4d6"/><rect x="0" y="3" width="14" height="8" fill="#fff4d6"/>
    <rect x="1" y="1" width="12" height="12" fill="#fff4d6"/><rect x="4" y="4" width="2" height="2" fill="#f0dfb0"/>
    <rect x="8" y="8" width="3" height="2" fill="#f0dfb0"/></g>`
  return `<svg class="stars" viewBox="0 0 480 150" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" aria-hidden="true">
    <defs><radialGradient id="moonglow"><stop offset="0" stop-color="#fff4d6" stop-opacity=".35"/><stop offset="1" stop-color="#fff4d6" stop-opacity="0"/></radialGradient></defs>
    ${stars}<circle cx="399" cy="29" r="28" fill="url(#moonglow)"/>${moon}</svg>`
}
