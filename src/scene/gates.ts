// Little night scenes for the two "which way" cards on the home page: a
// market lane and the giving booth. Front-on pixel art, 96×64. Kept calm on
// purpose: one slow movement per scene, no lights or snowfall of their own
// (the page around them already twinkles and snows).
import { type Grid, rects } from '../pixel.ts'
import { AVATAR, CHEESE, HEART, PAL, WINE } from '../sprites.ts'
import { pixelText, textWidth } from './font.ts'
import { rng } from './iso.ts'

const W = 96
const H = 64
const GROUND = 50

const px = (x: number, y: number, w: number, h: number, fill: string, cls = '') =>
  `<rect${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`

const width = (g: Grid) => Math.max(...g.map((r) => r.length))
const BULBS = ['#ffd23f', '#e5007d', '#2fd27a', '#5ab4ff']

/** Sky, stars, skyline and snowy ground. */
const backdrop = (seed: number) => {
  const r = rng(seed)
  let out = px(0, 0, W, 16, '#15103a') + px(0, 16, W, 16, '#1c1640') + px(0, 32, W, 18, '#241b52')
  for (let i = 0; i < 12; i++) out += px(Math.floor(r() * W), Math.floor(r() * 26), 1, 1, 'rgb(255 255 255 / .6)')
  // skyline with a few lit windows
  let x = 0
  while (x < W) {
    const w = 8 + Math.floor(r() * 3) * 2
    const h = 10 + Math.floor(r() * 5) * 2
    out += px(x, GROUND - h, w, h, '#2c2257') + px(x + w / 2 - 2, GROUND - h - 3, 4, 3, '#2c2257')
    for (let wy = GROUND - h + 3; wy < GROUND - 3; wy += 4)
      for (let wx = x + 2; wx < x + w - 2; wx += 3) if (r() < 0.4) out += px(wx, wy, 1, 2, '#ffcf6b')
    x += w
  }
  // snowy ground with drifts
  out += px(0, GROUND, W, H - GROUND, '#eef3ff') + px(0, GROUND, W, 1, '#c9d3ee')
  for (let i = 0; i < 10; i++) out += px(Math.floor(r() * W), GROUND + 3 + Math.floor(r() * 10), 3, 1, '#d9e0f3')
  return out
}

/** Front-on stall with a lit interior, a shopkeeper and a product on the counter. */
const stall = (x: number, w: number, top: number, color: string, product: Grid, shirt: string) => {
  const counter = GROUND - 11
  let out = `<ellipse cx="${x + w / 2}" cy="${GROUND + 2}" rx="${w * 0.75}" ry="5" fill="url(#ga-pool)"/>`
  out += px(x + 2, top + 9, w - 4, counter - top - 9, '#8a4a1c') + px(x + 2, top + 9, w - 4, 8, '#c97a35')
  out += px(x + 4, top + 19, w - 8, 1, '#5b3216')
  for (let i = 0; i < Math.floor((w - 8) / 5); i++) out += px(x + 5 + i * 5, top + 16, 3, 3, i % 2 ? color : '#fff4d6')
  out += `<g transform="translate(${x + w - 14} ${counter - 12})">${rects(AVATAR.slice(0, 13), { ...PAL, t: shirt })}</g>`
  out += px(x, top + 3, 1, GROUND - top - 3, '#3d2010') + px(x + w - 1, top + 3, 1, GROUND - top - 3, '#3d2010')
  for (let i = 0; i * 4 < w; i++) {
    const fill = i % 2 ? '#fff' : color
    out += px(x + i * 4, top + 2, Math.min(4, w - i * 4), 7, fill) + px(x + i * 4 + 1, top + 9, Math.min(2, w - i * 4 - 1), 2, fill)
  }
  out += px(x - 1, top, w + 2, 2, '#eef3ff')
  out += px(x, counter, w, GROUND - counter, '#7b4a2d') + px(x, counter, w, 2, '#a06a3f') + px(x, counter + 5, w, 1, '#5b3216')
  out += `<g transform="translate(${x + 4} ${counter - product.length + 2})">${rects(product, PAL)}</g>`
  return out
}

const tree = (cx: number) => {
  let out = `<circle cx="${cx}" cy="18" r="10" fill="url(#ga-halo)" class="ga-glow"/>`
  out += px(cx - 2, GROUND - 5, 4, 5, '#5b3216')
  const tiers: Array<[number, number, number]> = [
    [20, 6, GROUND - 5],
    [16, 6, GROUND - 11],
    [12, 6, GROUND - 17],
    [8, 6, GROUND - 23],
  ]
  for (const [w, h, base] of tiers)
    for (let row = 0; row < h; row++) {
      const rw = Math.max(2, Math.round((w * (h - row)) / h / 2) * 2)
      out += px(cx - rw / 2, base - row - 1, rw / 2, 1, '#2f8a57') + px(cx, base - row - 1, rw / 2, 1, '#1f6340')
    }
  ;[
    [-6, GROUND - 7],
    [4, GROUND - 9],
    [-3, GROUND - 14],
    [3, GROUND - 19],
    [-2, GROUND - 24],
  ].forEach(([dx, y], i) => (out += px(cx + dx, y, 1, 1, BULBS[i % 4])))
  out += px(cx - 1, 16, 3, 5, '#ffd23f') + px(cx - 2, 17, 5, 3, '#ffd23f') + px(cx, 18, 1, 1, '#fff4d6')
  return out
}

/** Boot prints in the snow, from (x0, y0) to (x1, y1). */
const footprints = (x0: number, y0: number, x1: number, y1: number) => {
  const steps = Math.round(Math.hypot(x1 - x0, y1 - y0) / 4)
  let out = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    out += px(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t) + (i % 2), 2, 1, '#c3cbe6')
  }
  return out
}

const sled = (x: number, y: number) =>
  px(x + 1, y, 14, 2, '#c8102e') + px(x + 1, y, 14, 1, '#e8463a') +
  px(x + 3, y + 2, 1, 2, '#5b3216') + px(x + 12, y + 2, 1, 2, '#5b3216') +
  px(x, y + 4, 16, 1, '#5b3216') + px(x + 15, y + 2, 1, 2, '#5b3216') +
  px(x - 6, y - 1, 7, 1, '#7b4a2d') // tow rope

// outlined in shade blue, or it vanishes into the snow
const SNOWMAN: Grid = [
  '...kkk...',
  '..kkkkk..',
  '..SwwwS..',
  '.SwkwkwS.',
  '.SwwoowS.',
  '..SwwwS..',
  '..rrrrr..',
  '.SwwkwwS.',
  'SwwwwwwwS',
  'SwwwkwwwS',
  '.SSwwwSS.',
]

const snowman = (x: number, y: number) =>
  px(x, y + 11, 9, 1, '#c9d3ee') + px(x - 3, y + 7, 3, 1, '#5b3216') + px(x + 9, y + 6, 3, 1, '#5b3216') +
  rects(SNOWMAN, { k: '#1b1028', w: '#ffffff', S: '#aab6da', r: '#c8102e', o: '#ff8a2a' }, x, y)

/** Person with feet on the ground at x; optional extra drawing (bag, waving arm) in sprite coords. */
const person = (x: number, shirt: string, hair: string, extra = '') =>
  `<g transform="translate(${x} ${GROUND - 19})">${rects(AVATAR, { ...PAL, t: shirt, h: hair })}${extra}</g>`

const defs = `<defs>
  <radialGradient id="ga-pool"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
  <radialGradient id="ga-halo"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
  <radialGradient id="ga-love"><stop offset="0" stop-color="#ff7ab8" stop-opacity=".6"/><stop offset="1" stop-color="#e5007d" stop-opacity="0"/></radialGradient>
</defs>`

const scene = (body: string) =>
  `<svg class="gate-scene" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" width="640" height="427">${body}</svg>`

/** The market lane: two stalls, a glowing tree and a shopper heading home with a gift. */
export const marketScene = () => {
  const bag = px(10, 10, 5, 5, '#e5007d') + px(12, 10, 1, 5, '#ffd23f') + px(11, 8, 1, 2, '#1b1028') + px(13, 8, 1, 2, '#1b1028')
  return scene(
    defs +
      backdrop(1) +
      stall(3, 30, 18, '#f2c94c', CHEESE, '#2e7d4f') +
      stall(63, 30, 18, '#c8102e', WINE, '#5e0f2e') +
      tree(48) +
      footprints(38, 53, 4, 62) +
      sled(70, 56) +
      person(36, '#2b6cb0', '#7a3b12', bag),
  )
}

/** The giving booth: a glowing heart, a volunteer and a coin dropping into the jar now and then. */
export const givingScene = () => {
  const x = 22
  const w = 52
  const counter = GROUND - 11
  const jarX = 36
  const wave = px(-1, 6, 1, 4, '#e5007d') + px(-2, 3, 2, 3, '#f5c7a1')
  let body = defs + backdrop(2)
  // glowing heart sign above the booth
  body += `<circle cx="48" cy="11" r="12" fill="url(#ga-love)"/>`
  body += px(44, 15, 1, 4, '#3d2010') + px(52, 15, 1, 4, '#3d2010')
  body += `<g transform="translate(${48 - width(HEART) / 2 | 0} 5)">${rects(HEART, PAL)}</g>`
  body += stall(x, w, 18, '#e5007d', [], '#e5007d')
  body += `<g transform="translate(${x + w - 14} ${counter - 12})">${wave}</g>`
  // donation jar with coins, one dropping in
  body += px(jarX, counter - 9, 9, 9, '#bfe3ff') + px(jarX + 1, counter - 8, 7, 8, '#2a1f4f') + px(jarX + 1, counter - 4, 7, 4, '#ffd23f') + px(jarX + 2, counter - 5, 2, 1, '#ffd23f') + px(jarX + 5, counter - 5, 2, 1, '#d9a400')
  body += px(jarX - 1, counter - 10, 11, 1, '#8fa3c8')
  body += `<g class="ga-coin">${px(jarX + 3, counter - 17, 3, 3, '#ffd23f')}${px(jarX + 4, counter - 16, 1, 1, '#fff4d6')}</g>`
  const text = 'THANK YOU'
  body += pixelText(text, x + (w - textWidth(text)) / 2, counter + 4, '#ffd23f')
  // a visitor walking up, coin in hand
  body += footprints(10, 53, 2, 61) + snowman(80, 49)
  body += person(8, '#2e7d4f', '#e8c170', px(10, 9, 2, 2, '#ffd23f'))
  return scene(body)
}
