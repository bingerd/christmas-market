// The market square: an isometric Habbo-style room with stalls, the tree,
// the Xebia café and an LED sign. Used as hero backdrop and as the
// interactive market map.
import { charities, suppliers } from '../catalog.ts'
import { rects, type Grid } from '../pixel.ts'
import { AVATAR, PAL, productFor } from '../sprites.ts'
import { pixelText, textWidth } from './font.ts'
import { playJingle } from './music.ts'
import { iso, rng } from './iso.ts'

const N = 12
const TW = 32
const TH = 16
const PAD_TOP = 120
const OX = (N * TW) / 2 + 24
const OY = PAD_TOP
export const VILLAGE_W = OX * 2
export const VILLAGE_H = OY + N * TH + 24

const I = iso(OX, OY, TW, TH)
const { at, poly, box } = I

const SNOW = '#eef3ff'
const SNOW_SIDE = '#c9d3ee'
const WOOD = '#7b4a2d'
const WOOD_DARK = '#5b3216'
const WOOD_DEEP = '#3d2010'

interface Item {
  depth: number
  svg: string
}

// --- floor -------------------------------------------------------------------

const COBBLE = ['#9c8fb4', '#8f82a8', '#a597bb']
const SNOW_TILES = ['#f2f5ff', '#eaf0fc', '#e3e9f8']

const floor = () => {
  let out = ''
  // slab edges give the room its Habbo "floating platform" depth
  out += poly('#2b2160', at(0, N), at(N, N), at(N, N, -10), at(0, N, -10))
  out += poly('#1f1748', at(N, 0), at(N, N), at(N, N, -10), at(N, 0, -10))
  // snow along the slab rim
  out += poly(SNOW_SIDE, at(0, N), at(N, N), at(N, N, -3), at(0, N, -3))
  out += poly('#b4bfdc', at(N, 0), at(N, N), at(N, N, -3), at(N, 0, -3))
  const r = rng(3)
  let detail = ''
  for (let x = 0; x < N; x++)
    for (let y = 0; y < N; y++) {
      const path = x === 5 || x === 6 || y === 5 || y === 6
      const n = r()
      // the paths are swept cobblestones with the odd patch of fresh snow
      if (path && n > 0.25) {
        out += I.tile(x, y, 1, 1, COBBLE[Math.floor(r() * 3)], 'stroke="#7d7096" stroke-width=".5"')
        for (const [sx, sy] of [[0.3, 0.35], [0.65, 0.6]]) {
          const [a, b] = at(x + sx, y + sy)
          detail += `<rect x="${Math.round(a) - 2}" y="${Math.round(b)}" width="4" height="1" fill="#6f6390"/>`
        }
      } else {
        out += I.tile(x, y, 1, 1, SNOW_TILES[Math.floor(n * 3)], 'stroke="#dbe2f3" stroke-width=".3"')
        if (r() < 0.14) {
          const [a, b] = at(x + 0.5, y + 0.5)
          detail += `<rect class="sparkle" x="${Math.round(a)}" y="${Math.round(b)}" width="1" height="1" style="animation-delay:${(r() * 3).toFixed(1)}s"/>`
        }
      }
    }
  out += detail + footprints([[3.2, 11.8], [8.1, 10.1]]) + footprints([[11.8, 4.4], [10.2, 8]])
  // faint light trail running along the path, the digital layer of the square
  const trail = [at(5.5, 0), at(5.5, N)].map(([a, b]) => `${a},${b}`).join(' ')
  const trail2 = [at(0, 5.5), at(N, 5.5)].map(([a, b]) => `${a},${b}`).join(' ')
  out += `<g class="floor-trails"><polyline points="${trail}" pathLength="100"/><polyline points="${trail2}" pathLength="100" style="animation-delay:-3s"/></g>`
  return out
}

/** A line of boot prints in the snow, from one tile point to another. */
const footprints = ([[x0, y0], [x1, y1]]: [number, number][]) => {
  const steps = Math.round(Math.hypot(x1 - x0, y1 - y0) / 0.42)
  let out = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const side = i % 2 ? 0.08 : -0.08
    const [a, b] = at(x0 + (x1 - x0) * t + side, y0 + (y1 - y0) * t - side)
    out += `<rect x="${Math.round(a) - 1}" y="${Math.round(b)}" width="3" height="1" fill="#c3cbe6"/>`
  }
  return out
}

/** Warm light pool on the snow in front of a light source. */
const pool = (x: number, y: number, rx = 46, ry = 18, color = 'warm') => {
  const [cx, cy] = at(x, y)
  return `<ellipse class="pool pool-${color}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#pool-${color})"/>`
}

// --- shopkeepers ------------------------------------------------------------------

type Job = 'slice' | 'pour' | 'stir' | 'pack' | 'wave' | 'wipe'

const JOBS: Record<string, Job> = { alexanderhoeve: 'slice', 'weldam-wijn': 'pour', 'olala-chocola': 'stir', oldenhof: 'pack' }

const LOOKS: Record<Job, { shirt: string; hair: string }> = {
  slice: { shirt: '#2e7d4f', hair: '#e8c170' },
  pour: { shirt: '#5e0f2e', hair: '#1b1028' },
  stir: { shirt: '#7b4a2d', hair: '#3b2416' },
  pack: { shirt: '#2b6cb0', hair: '#7a3b12' },
  wave: { shirt: '#e5007d', hair: '#3b2416' },
  wipe: { shirt: '#6c1d7f', hair: '#e8c170' },
}

// the avatar with an apron (the white shirt dots become its straps)
const KEEPER: Grid = AVATAR.map((row, y) => (y >= 9 && y <= 12 ? row.slice(0, 3) + 'aaaa' + row.slice(7) : row))

const px = (x: number, y: number, w: number, h: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`

/** Two-frame loop, swapped in CSS. */
const frames = (a: string, b: string, speed: number) =>
  `<g class="kf ka" style="--kf:${speed}s">${a}</g><g class="kf kb" style="--kf:${speed}s">${b}</g>`

const heart = (x: number, y: number, delay: number) =>
  `<g class="heart" style="animation-delay:${delay}s">${px(x, y, 1, 1, '#e5007d')}${px(x + 2, y, 1, 1, '#e5007d')}${px(x, y + 1, 3, 1, '#e5007d')}${px(x + 1, y + 2, 1, 1, '#e5007d')}</g>`

/** Props per job; a is the keeper's centre, c the counter top. */
const PROPS: Record<Job, (a: number, c: number) => string> = {
  slice: (a, c) =>
    px(a - 9, c - 4, 8, 4, '#ffd23f') +
    px(a - 9, c - 1, 8, 1, '#c98a00') +
    frames(
      px(a + 2, c - 13, 1, 2, WOOD_DEEP) + px(a + 2, c - 11, 1, 6, '#d6dbe8'),
      px(a + 2, c - 8, 1, 2, WOOD_DEEP) + px(a + 2, c - 6, 1, 6, '#d6dbe8') + px(a + 4, c - 3, 3, 3, '#ffd23f'),
      0.7,
    ),
  pour: (a, c) =>
    px(a + 4, c - 2, 1, 2, '#bfe3ff') +
    px(a + 3, c, 3, 1, '#bfe3ff') +
    frames(
      px(a + 3, c - 5, 3, 3, '#bfe3ff') + px(a - 6, c - 9, 3, 8, '#5e0f2e') + px(a - 5, c - 11, 1, 2, '#5e0f2e'),
      px(a + 3, c - 5, 3, 3, '#8e1e46') +
        px(a - 2, c - 10, 3, 3, '#5e0f2e') +
        px(a + 1, c - 11, 2, 2, '#5e0f2e') +
        px(a + 3, c - 12, 1, 1, '#5e0f2e') +
        px(a + 4, c - 10, 1, 5, '#8e1e46'),
      1.6,
    ),
  stir: (a, c) =>
    px(a - 4, c - 4, 8, 4, '#544b70') +
    px(a - 5, c - 5, 10, 1, '#6b6286') +
    px(a - 3, c - 5, 6, 1, '#7b4a2d') +
    frames(px(a - 2, c - 11, 1, 6, WOOD), px(a + 1, c - 11, 1, 6, WOOD), 0.6) +
    `<g class="steam">${[0, 1].map((i) => `<rect x="${a - 1 + i * 2}" y="${c - 9}" width="2" height="2" style="animation-delay:${i * 1.1}s"/>`).join('')}</g>`,
  pack: (a, c) =>
    px(a + 1, c - 4, 7, 4, '#a06a3f') +
    px(a + 1, c - 3, 7, 1, WOOD) +
    px(a + 2, c - 8, 5, 1, WOOD) +
    px(a + 2, c - 7, 1, 3, WOOD) +
    px(a + 6, c - 7, 1, 3, WOOD) +
    frames(
      px(a - 7, c - 7, 2, 2, '#c8102e') + px(a - 4, c - 5, 3, 2, '#c98a00'),
      px(a + 3, c - 6, 2, 2, '#c8102e') + px(a + 5, c - 5, 3, 1, '#c98a00'),
      1.2,
    ),
  wave: (a, c) =>
    frames(
      px(a - 8, c - 18, 1, 6, LOOKS.wave.shirt) + px(a - 9, c - 21, 2, 3, '#f5c7a1'),
      px(a - 10, c - 16, 2, 2, LOOKS.wave.shirt) + px(a - 12, c - 19, 2, 3, '#f5c7a1'),
      0.5,
    ) + [0, 1, 2].map((i) => heart(a + 4 + i * 2, c - 16, i)).join(''),
  wipe: (a, c) => frames(px(a - 6, c - 1, 4, 1, '#fff'), px(a - 1, c - 1, 4, 1, '#fff'), 0.9),
}

/** Shopkeeper behind the counter (drawn before it) plus the props of their job (drawn after it). */
const keeper = (job: Job, x: number, y: number) => {
  // right behind the counter: further back and the awning hides the head
  const [a, b] = at(x + 1, y + 0.6).map(Math.round)
  const c = Math.round(at(x + 1, y + 0.82, 12)[1])
  const { shirt, hair } = LOOKS[job]
  const sprite = rects(KEEPER, { ...PAL, t: shirt, h: hair, a: '#fff4e6' })
  return {
    body: `<g class="person keeper"><g class="dancer" style="transform-origin:${a}px ${b}px"><g transform="translate(${a - 6} ${b - 25}) scale(1.25)">${sprite}</g></g></g>`,
    props: PROPS[job](a, c),
  }
}

// --- stalls --------------------------------------------------------------------

const bulbs = (x: number, y: number, w: number, z: number, n: number) => {
  let out = ''
  for (let i = 0; i <= n; i++) {
    const [a, b] = at(x + (i * w) / n, y, z - (i % 2))
    out += `<rect class="bulb b${i % 4}" x="${a - 1}" y="${b - 1}" width="2" height="2"/>`
  }
  return out
}

const hangingSign = (x: number, y: number, z: number, icon: Grid, color: string) => {
  const [cx, cy] = at(x, y, z)
  const iw = Math.max(...icon.map((r) => r.length))
  const ih = icon.length
  const bw = iw + 6
  const bh = ih + 6
  const left = Math.round(cx - bw / 2)
  const top = Math.round(cy - bh)
  return `<g class="sign">
    <rect x="${left + 2}" y="${top - 6}" width="1" height="6" fill="${WOOD_DEEP}"/>
    <rect x="${left + bw - 3}" y="${top - 6}" width="1" height="6" fill="${WOOD_DEEP}"/>
    <rect x="${left}" y="${top}" width="${bw}" height="${bh}" fill="#1b1028"/>
    <rect x="${left + 1}" y="${top + 1}" width="${bw - 2}" height="${bh - 2}" fill="${color}"/>
    <rect x="${left + 2}" y="${top + 2}" width="${bw - 4}" height="${bh - 4}" fill="#2a1f4f"/>
    <g transform="translate(${left + 3} ${top + 3})">${rects(icon, PAL)}</g>
  </g>`
}

/** Name tag that appears on hover / focus. */
const nameTag = (x: number, y: number, z: number, name: string) => {
  const [cx, cy] = at(x, y, z)
  const w = textWidth(name) + 8
  const left = Math.round(cx - w / 2)
  const top = Math.round(cy - 13)
  return `<g class="tag">
    <rect x="${left}" y="${top}" width="${w}" height="11" fill="#1b1028"/>
    <rect x="${left + 1}" y="${top + 1}" width="${w - 2}" height="9" fill="#fff4d6"/>
    <rect x="${Math.round(cx) - 1}" y="${top + 11}" width="3" height="2" fill="#1b1028"/>
    ${pixelText(name, left + 4, top + 3, '#1b1028')}
  </g>`
}

interface StallOpts {
  x: number
  y: number
  color: string
  icon: Grid
  name: string
  href?: string
  goods?: string[]
  /** Which way the open side faces: +y (front-left) or +x (front-right). */
  facing?: 'y' | 'x'
  extra?: (x: number, y: number) => string
  /** Shopkeeper standing behind the counter, doing their job. */
  keeper?: Job
}

/**
 * A 2×1 market stall. Drawn facing +y; a stall facing +x is the same drawing
 * on swapped tile coordinates, mirrored around the room's centre line.
 */
const stall = ({ x: tx, y: ty, color, icon, name, href, goods = [color], facing = 'y', extra, keeper: job }: StallOpts) => {
  const mirrored = facing === 'x'
  const [x, y] = mirrored ? [ty, tx] : [tx, ty]
  let g = ''
  // back wall with warm lit interior
  g += box(x, y, 2, 0.15, 0, 30, WOOD_DARK, 'url(#interior)', WOOD_DEEP)
  // shelves with goods
  for (const z of [12, 21]) {
    const [a0, b0] = at(x + 0.1, y + 0.15, z)
    const [a1, b1] = at(x + 1.9, y + 0.15, z)
    g += `<polygon points="${a0},${b0} ${a1},${b1} ${a1},${b1 + 1.5} ${a0},${b0 + 1.5}" fill="${WOOD}"/>`
    for (let i = 0; i < 5; i++) {
      const [ga, gb] = at(x + 0.25 + i * 0.36, y + 0.15, z + 1)
      g += `<rect x="${ga - 2}" y="${gb - 4}" width="4" height="4" fill="${goods[i % goods.length]}"/>`
    }
  }
  const kept = job ? keeper(job, x, y) : undefined
  g += kept?.body ?? ''
  // counter
  g += box(x, y + 0.65, 2, 0.35, 0, 12, '#a06a3f', WOOD, WOOD_DARK)
  // plank lines on the counter front
  for (const z of [4, 8]) {
    const [a0, b0] = at(x, y + 1, z)
    const [a1, b1] = at(x + 2, y + 1, z)
    g += `<line x1="${a0}" y1="${b0}" x2="${a1}" y2="${b1}" stroke="${WOOD_DARK}" stroke-width=".8"/>`
  }
  // goods on the counter, unless a shopkeeper is working there
  if (!job)
    for (let i = 0; i < 3; i++)
      g += box(x + 0.2 + i * 0.6, y + 0.72, 0.3, 0.22, 12, 15, goods[i % goods.length], '#1b1028', '#1b1028')
  g += kept?.props ?? ''
  // posts
  for (const [px, py] of [[x, y + 1], [x + 2, y + 1]] as const) {
    const [a, b] = at(px, py, 12)
    g += `<rect x="${a - 1}" y="${b - 20}" width="2" height="20" fill="${WOOD_DEEP}"/>`
  }
  // roof: awning, stripes, snow
  g += box(x - 0.1, y - 0.05, 2.2, 1.2, 32, 39, color, color, color)
  for (let i = 0; i < 4; i++) {
    const a = x - 0.1 + i * 0.55 + 0.27
    g += poly('rgba(255,255,255,.92)', at(a, y + 1.15, 32), at(a + 0.27, y + 1.15, 32), at(a + 0.27, y + 1.15, 39), at(a, y + 1.15, 39))
  }
  // scalloped edge
  for (let i = 0; i < 8; i++) {
    const [a, b] = at(x - 0.1 + i * 0.275 + 0.07, y + 1.15, 32)
    g += `<rect x="${a - 1}" y="${b}" width="3" height="2" fill="${i % 2 ? '#fff' : color}"/>`
  }
  g += box(x - 0.1, y - 0.05, 2.2, 1.2, 39, 41, SNOW, SNOW_SIDE, '#aab6da')
  g += bulbs(x, y + 1.15, 2, 30, 6)
  g += hangingSign(x + 1, y + 0.55, 56, icon, color)
  g += extra?.(x, y) ?? ''
  if (mirrored) g = `<g transform="translate(${OX * 2} 0) scale(-1 1)">${g}</g>`

  const [cx, cy] = mirrored ? [tx + 0.55, ty + 1] : [tx + 1, ty + 0.55]
  const body = `<g class="stall-body">${g}</g>${nameTag(cx, cy, 76, name)}`
  return href
    ? `<a href="${href}" class="hotspot" style="--glow:${color}" aria-label="${name}"><title>${name}</title>${body}</a>`
    : `<g class="hotspot static" style="--glow:${color}">${body}</g>`
}

// --- tree ------------------------------------------------------------------------

const tree = (x: number, y: number) => {
  const [cx, cy] = at(x, y)
  let g = ''
  // snow mound + trunk
  g += `<ellipse cx="${cx}" cy="${cy}" rx="22" ry="9" fill="${SNOW_SIDE}"/>`
  g += `<ellipse cx="${cx}" cy="${cy - 1}" rx="20" ry="7" fill="${SNOW}"/>`
  g += `<rect x="${cx - 4}" y="${cy - 16}" width="8" height="14" fill="${WOOD_DARK}"/>`
  // stepped pixel tiers
  const tiers = [
    [60, 30],
    [48, 26],
    [36, 22],
    [24, 18],
  ]
  let base = cy - 14
  const r = rng(11)
  const lights: string[] = []
  for (const [w, h] of tiers) {
    for (let row = 0; row < h; row += 2) {
      const rw = Math.max(2, Math.round((w * (h - row)) / h / 2) * 2)
      const yy = base - row
      g += `<rect x="${cx - rw / 2}" y="${yy - 2}" width="${rw / 2}" height="2" fill="#2f8a57"/>`
      g += `<rect x="${cx}" y="${yy - 2}" width="${rw / 2}" height="2" fill="#1f6340"/>`
      if (row % 6 === 2 && rw > 8) {
        const lx = cx - rw / 2 + 2 + Math.floor(r() * (rw - 4))
        lights.push(`<rect class="bulb b${lights.length % 4}" x="${lx}" y="${yy - 3}" width="3" height="3"/>`)
      }
    }
    // snow on the tier edge
    g += `<rect x="${cx - w / 2}" y="${base - 2}" width="${w}" height="2" fill="${SNOW}" opacity=".85"/>`
    base -= h - 10
  }
  // garland
  g += `<path d="M${cx - 24} ${cy - 30} Q${cx} ${cy - 22} ${cx + 22} ${cy - 40} M${cx - 16} ${cy - 54} Q${cx} ${cy - 46} ${cx + 15} ${cy - 62}" stroke="#ffcf6b" stroke-width="1.2" fill="none" stroke-dasharray="2 2" class="garland"/>`
  g += lights.join('')
  // star with halo
  const sy = base - 8
  g += `<circle cx="${cx}" cy="${sy}" r="20" fill="url(#halo)" class="star-halo"/>`
  g += `<rect x="${cx - 1}" y="${sy - 7}" width="3" height="15" fill="#ffd23f"/><rect x="${cx - 7}" y="${sy - 1}" width="15" height="3" fill="#ffd23f"/>`
  g += `<rect x="${cx - 3}" y="${sy - 3}" width="7" height="7" fill="#ffe680"/>`
  return g
}

// --- café ------------------------------------------------------------------------

const steam = (x: number, y: number, z: number) => {
  const [a, b] = at(x, y, z)
  return `<g class="steam">${[0, 1, 2]
    .map((i) => `<rect x="${a - 1 + (i % 2) * 2}" y="${b - 4}" width="2" height="2" style="animation-delay:${i * 0.8}s"/>`)
    .join('')}</g>`
}

const cafe = (x: number, y: number, facing: 'x' | 'y') => {
  const extra = (sx: number, sy: number) => {
    let out = ''
    for (let i = 0; i < 3; i++) {
      const cx = sx + 0.3 + i * 0.6
      const [a, b] = at(cx, sy + 0.83, 15)
      out += `<rect x="${a - 2}" y="${b - 4}" width="4" height="4" fill="#fff"/><rect x="${a + 2}" y="${b - 3}" width="1" height="2" fill="#fff"/>`
      out += steam(cx, sy + 0.83, 19)
    }
    return out
  }
  return stall({ x, y, facing, color: '#6c1d7f', icon: CUP, name: 'Xebia Cafe', goods: ['#fff4d6', '#c98a00'], extra, keeper: 'wipe' })
}

const CUP: Grid = [
  '.k.k.k..',
  'k.k.k...',
  '........',
  'kkkkkk..',
  'kwwwwkkk',
  'kwwwwk.k',
  'kwwwwkkk',
  'kwwwwk..',
  '.kkkk...',
]

// --- LED sign --------------------------------------------------------------------

const ledSign = (x: number, y: number, message: string) => {
  const [cx, cy] = at(x, y)
  const w = 132
  const h = 15
  const left = Math.round(cx - w / 2)
  const top = Math.round(cy - 96)
  const text = `${message}   *   `
  const tw = textWidth(text) + 1
  return `<g class="led">
    <rect x="${left + 10}" y="${top + h}" width="3" height="${cy - top - h}" fill="#1b1028"/>
    <rect x="${left + w - 13}" y="${top + h}" width="3" height="${cy - top - h}" fill="#1b1028"/>
    <rect x="${left - 2}" y="${top - 2}" width="${w + 4}" height="${h + 4}" fill="#1b1028"/>
    <rect x="${left}" y="${top}" width="${w}" height="${h}" fill="#140b26"/>
    <rect x="${left - 2}" y="${top - 4}" width="${w + 4}" height="2" fill="${SNOW}"/>
    <clipPath id="led-clip"><rect x="${left + 2}" y="${top}" width="${w - 4}" height="${h}"/></clipPath>
    <g clip-path="url(#led-clip)"><g class="led-text" style="--tw:-${tw}px">
      ${pixelText(text, left + 4, top + 5, '#ffb347')}${pixelText(text, left + 4 + tw, top + 5, '#ffb347')}
    </g></g>
  </g>`
}

// --- people ----------------------------------------------------------------------

const NOTE: Grid = ['..kk', '..kk', '..k.', '..k.', 'kkk.', 'kkk.']

const person = (x: number, y: number, shirt: string, hair: string, cls: string, flip = false) => {
  const [a, b] = at(x, y)
  const body = rects(AVATAR, { ...PAL, t: shirt, h: hair })
  const notes = `<g class="notes">${rects(NOTE, { k: '#ffd23f' }, a - 9, b - 40)}${rects(NOTE, { k: '#ff7ab8' }, a + 5, b - 44)}</g>`
  // transform-origin in user units: fill-box on a <g> isn't reliable, and the
  // dance flip has to pivot on the person's feet
  return `<g class="person ${cls}"><g class="dancer" style="transform-origin:${a}px ${b}px"><g transform="translate(${a - 7} ${b - 29}) scale(1.5)${flip ? ' translate(10 0) scale(-1 1)' : ''}">${body}</g></g>${notes}</g>`
}

const lamp = (x: number, y: number) => {
  const [a, b] = at(x, y)
  return `<rect x="${a - 1}" y="${b - 46}" width="2" height="46" fill="#1b1028"/>
    <rect x="${a - 4}" y="${b - 54}" width="8" height="8" fill="#1b1028"/>
    <rect x="${a - 3}" y="${b - 53}" width="6" height="6" fill="#ffcf6b" class="lamp-light"/>
    <circle cx="${a}" cy="${b - 50}" r="16" fill="url(#halo)"/>`
}

// --- fire pit, snowman, drifts ---------------------------------------------------

const FIRE_PAL = { r: '#e8461e', o: '#ff8a2a', y: '#ffd25e', w: '#fff3c4' }
const FLAME: Grid = [
  '.....r......',
  '....rr......',
  '....rr...r..',
  '...rro..rr..',
  '...roo..ro..',
  '..rrooorro..',
  '..rooyoooor.',
  '.rrooyyooor.',
  '.rooyyyyoorr',
  '.rooyywyyoor',
  'rrooywwwyoor',
  'rooyywwwyyor',
  'rooyywwwyyor',
  '.rooyyyyyoor',
  '.rrooooooorr',
  '..rrrrrrrr..',
]
const FLAME_B = FLAME.map((row) => [...row].reverse().join(''))

const firePit = (x: number, y: number) => {
  const [cx, cy] = at(x, y)
  const stones = Array.from({ length: 12 }, (_, i) => {
    const t = (i / 12) * Math.PI * 2
    return [Math.round(cx + Math.cos(t) * 15), Math.round(cy + Math.sin(t) * 7), Math.sin(t)] as const
  })
  const stone = ([a, b]: readonly [number, number, number], i: number) =>
    `<rect x="${a - 3}" y="${b - 3}" width="6" height="4" fill="${i % 2 ? '#6b6286' : '#544b70'}"/><rect x="${a - 3}" y="${b - 4}" width="6" height="1" fill="${SNOW}"/>`
  let g = `<circle class="fire-glow" cx="${cx}" cy="${cy - 14}" r="54" fill="url(#fire-halo)"/>`
  g += stones.filter((s) => s[2] < 0).map(stone).join('')
  g += `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="5" fill="#2a120c"/>`
  g += `<rect x="${cx - 7}" y="${cy - 1}" width="2" height="1" fill="#ff7a2e"/><rect x="${cx + 4}" y="${cy}" width="2" height="1" fill="#ff7a2e"/>`
  // two crossed logs
  g += `<rect x="${cx - 11}" y="${cy - 3}" width="22" height="3" fill="${WOOD}"/><rect x="${cx - 11}" y="${cy - 3}" width="2" height="3" fill="#c98a5a"/>`
  g += `<rect x="${cx - 6}" y="${cy - 5}" width="12" height="3" fill="${WOOD_DARK}"/><rect x="${cx + 4}" y="${cy - 5}" width="2" height="3" fill="#c98a5a"/>`
  // flames: two frames swapped in CSS, sparks drifting up
  const fx = cx - 9
  const fy = cy - 27
  g += `<g class="flame fa" transform="translate(${fx} ${fy}) scale(1.5)">${rects(FLAME, FIRE_PAL)}</g>`
  g += `<g class="flame fb" transform="translate(${fx} ${fy}) scale(1.5)">${rects(FLAME_B, FIRE_PAL)}</g>`
  g += [-5, 2, 6, -1]
    .map((dx, i) => `<rect class="spark" x="${cx + dx}" y="${cy - 26}" width="2" height="2" style="animation-delay:${i * 0.55}s"/>`)
    .join('')
  g += stones.filter((s) => s[2] >= 0).map(stone).join('')
  return g
}

/** Log bench with a cap of snow, footprint w × d tiles. */
const bench = (x: number, y: number, w: number, d: number) => box(x, y, w, d, 0, 5, '#a06a3f', WOOD, WOOD_DARK) + box(x + 0.05, y + 0.05, w - 0.1, d - 0.1, 5, 6, SNOW, SNOW, SNOW_SIDE)

const SNOWMAN: Grid = [
  '....kkkk....',
  '....kkkk....',
  '...kkkkkk...',
  '...wwwwww...',
  '..wwkwwkwS..',
  '..wwwwwooo..',
  '..wwwwwwwS..',
  '...wwwwwS...',
  '..rrrrrrrr..',
  '.wwwwrrwwwS.',
  '.wwwwrkwwwS.',
  'wwwwwwwwwwwS',
  'wwwwwkwwwwwS',
  'wwwwwwwwwwSS',
  '.wwwwwwwwwS.',
  '..SSSSSSSS..',
]

const snowman = (x: number, y: number) => {
  const [a, b] = at(x, y)
  const pal = { k: '#1b1028', w: '#f4f7ff', S: SNOW_SIDE, r: '#c8102e', o: '#ff8a2a' }
  return `<rect x="${a - 15}" y="${b - 15}" width="7" height="1" fill="${WOOD_DEEP}"/><rect x="${a + 8}" y="${b - 17}" width="7" height="1" fill="${WOOD_DEEP}"/>
    <g transform="translate(${a - 9} ${b - 24}) scale(1.5)">${rects(SNOWMAN, pal)}</g>`
}

/** Stepped pixel snow drift. */
const drift = (x: number, y: number, w = 22) => {
  const [a, b] = at(x, y)
  let out = ''
  for (let i = 0; i < 3; i++) {
    const rw = w - i * 8
    out += `<rect x="${Math.round(a - rw / 2)}" y="${Math.round(b - (i + 1) * 3)}" width="${rw}" height="3" fill="${i ? SNOW : SNOW_SIDE}"/>`
  }
  return out
}

// --- dog -------------------------------------------------------------------------

const DOG: Grid = ['........bb..', 'b......bbkb.', '.b.....brbbk', '.bbbbbbbbb..', '.bbbbbbbbb..']
const DOG_LEGS_A = ['.b.b...b.b..', '.b.b...b.b..']
const DOG_LEGS_B = ['..bb....bb..', '..bb....bb..']
const DOG_PAL = { b: '#c98a5a', k: '#1b1028', r: '#c8102e' }
const flipGrid = (g: Grid) => g.map((row) => [...row].reverse().join(''))

/** A dog trotting down the path and back; the run itself is CSS. */
const dog = (x: number, y: number) => {
  const [a, b] = at(x, y).map(Math.round)
  const pose = (legs: Grid, flip: boolean) => rects(flip ? flipGrid([...DOG, ...legs]) : [...DOG, ...legs], DOG_PAL, a - 6, b - 7)
  return `<g class="dog"><g class="dog-l">${frames(pose(DOG_LEGS_A, true), pose(DOG_LEGS_B, true), 0.3)}</g><g class="dog-r">${frames(pose(DOG_LEGS_A, false), pose(DOG_LEGS_B, false), 0.3)}</g></g>`
}

// --- composition -----------------------------------------------------------------

const DEFS = `<defs>
  <radialGradient id="pool-warm"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".7"/><stop offset=".4" stop-color="#ffcf6b" stop-opacity=".25"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
  <radialGradient id="pool-fire"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".6"/><stop offset="1" stop-color="#ff7a2e" stop-opacity="0"/></radialGradient>
  <radialGradient id="fire-halo"><stop offset="0" stop-color="#ffb45e" stop-opacity=".55"/><stop offset=".45" stop-color="#ff7a2e" stop-opacity=".18"/><stop offset="1" stop-color="#ff7a2e" stop-opacity="0"/></radialGradient>
  <linearGradient id="interior" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#8a4a1c"/></linearGradient>
</defs>`

export interface VillageOpts {
  /** Make the supplier stalls clickable links into the market. */
  interactive?: boolean
}

// Stalls line the two back edges of the square like furniture along Habbo
// room walls, leaving the middle and front open for the tree and people.
const STALL_SPOTS: Array<{ x: number; y: number; facing: 'x' | 'y' }> = [
  { x: 2.2, y: 0.4, facing: 'y' },
  { x: 0.4, y: 2.2, facing: 'x' },
  { x: 5.6, y: 0.4, facing: 'y' },
  { x: 0.4, y: 5.6, facing: 'x' },
]

/** Light pool in front of a stall's open side. */
const stallPool = (x: number, y: number, facing: 'x' | 'y', rx = 40, ry = 16) =>
  facing === 'y' ? pool(x + 1, y + 1.7, rx, ry) : pool(x + 1.7, y + 1, rx, ry)

export const villageSvg = ({ interactive = false }: VillageOpts = {}) => {
  const items: Item[] = []
  const pools: string[] = []

  suppliers.slice(0, STALL_SPOTS.length).forEach((s, i) => {
    const { x, y, facing } = STALL_SPOTS[i]
    pools.push(stallPool(x, y, facing))
    items.push({
      depth: x + y + 2,
      svg: stall({
        x,
        y,
        facing,
        color: s.color,
        icon: productFor[s.id],
        keeper: JOBS[s.id],
        name: s.name,
        href: interactive ? `#/stall/${s.id}` : undefined,
      }),
    })
  })

  // the giving booth: in the market it leads to the charities
  pools.push(stallPool(9, 0.4, 'y'))
  items.push({
    depth: 11.4,
    svg: stall({
      x: 9,
      y: 0.4,
      color: '#e5007d',
      icon: productFor[charities[0]?.id] ?? productFor['free-a-girl'],
      name: 'Giving booth',
      keeper: 'wave',
      href: interactive ? '#/donate' : undefined,
      goods: ['#e5007d', '#ffd23f'],
    }),
  })

  pools.push(stallPool(0.4, 9, 'x'))
  items.push({ depth: 11.4, svg: cafe(0.4, 9, 'x') })

  pools.push(pool(6.5, 6.5, 64, 28))
  items.push({ depth: 13, svg: tree(6.5, 6.5) })
  items.push({ depth: 1, svg: ledSign(0.9, 0.9, 'XEBIA CHRISTMAS MARKET   *   ONE GIFT EACH   *   2026') })
  items.push({ depth: 13.2, svg: lamp(3.4, 9.8) })
  items.push({ depth: 13.2, svg: lamp(9.8, 3.4) })
  pools.push(pool(3.4, 9.8, 24, 10), pool(9.8, 3.4, 24, 10))

  items.push({ depth: 9.6, svg: person(5.4, 4.2, '#6c1d7f', '#3b2416', 'walker w1') })
  items.push({ depth: 12.6, svg: person(4.2, 8.4, '#c8102e', '#e8c170', 'walker w2', true) })
  // the fire pit in the open front of the square, with people warming up
  pools.push(pool(9.2, 9.2, 96, 42, 'fire'))
  items.push({ depth: 18.4, svg: firePit(9.2, 9.2) })
  items.push({ depth: 17, svg: person(8.1, 8.9, '#2b6cb0', '#1b1028', 'warm') })
  items.push({ depth: 17.1, svg: person(9.1, 7.9, '#2e7d4f', '#e8c170', 'warm', true) })
  items.push({ depth: 20.4, svg: bench(8.4, 10.4, 1.6, 0.35) })
  items.push({ depth: 20.4, svg: bench(10.4, 8.4, 0.35, 1.6) })

  // shoppers browsing and a dog on the path
  // (beside the stalls: in front of a counter they'd hide the shopkeeper)
  items.push({ depth: 6, svg: person(4.5, 1.5, '#ffd23f', '#1b1028', 'shopper') })
  items.push({ depth: 9.9, svg: person(8.3, 1.6, '#2e7d4f', '#7a3b12', 'shopper', true) })
  items.push({ depth: 15.6, svg: dog(5.6, 8) })

  items.push({ depth: 19.7, svg: snowman(11.4, 8.3) })
  for (const [x, y, w] of [[11.4, 2.4, 22], [2.4, 11.4, 22], [0.8, 8.3, 16], [8.3, 0.8, 16], [11.3, 11.2, 26]] as const)
    items.push({ depth: x + y, svg: drift(x, y, w) })
  items.push({ depth: 13.8, svg: person(9.6, 4.2, '#e5007d', '#7a3b12', 'walker w4', true) })

  items.sort((a, b) => a.depth - b.depth)
  return `<svg class="village ${interactive ? 'is-interactive' : ''}" viewBox="0 0 ${VILLAGE_W} ${VILLAGE_H}" shape-rendering="crispEdges" role="${interactive ? 'group' : 'img'}" aria-label="Pixel-art Christmas market square">
    ${DEFS}${floor()}<g class="pools">${pools.join('')}</g>${items.map((i) => i.svg).join('')}
  </svg>`
}

/**
 * Clicking the open square (not a stall) gets everyone dancing to a little
 * Jingle Bells. One delegated listener covers the hero and the market map.
 */
export const installDance = (root: HTMLElement) => {
  const timers = new WeakMap<Element, number>()
  root.addEventListener('click', (e) => {
    const target = e.target as Element
    const village = target.closest('.village')
    if (!village || target.closest('.hotspot[href]')) return
    village.classList.add('dancing')
    clearTimeout(timers.get(village))
    timers.set(village, window.setTimeout(() => village.classList.remove('dancing'), playJingle() || 4500))
  })
}
