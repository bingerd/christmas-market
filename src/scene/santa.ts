// Santa's sleigh for the sky layer: flies across now and then (timing in CSS).
import { type Grid, rects } from '../pixel.ts'

const PAL = {
  k: '#1b1028',
  w: '#fff4f0',
  R: '#c8102e',
  D: '#8b0a1f',
  y: '#ffd23f',
  f: '#f5c7a1',
  c: '#7b4a2d',
  b: '#8a5a34',
  B: '#4e2c18',
  n: '#ff3b3b',
}

const SLEIGH: Grid = [
  '.........RRw..........',
  '........RRRR..........',
  '.......RRRRR..........',
  '.......wwwww..........',
  '.......ffkff..........',
  '......wwwwwww.........',
  '..cc..wwwwwwwRRf......',
  '.cccc.RRwwwRR.........',
  'ccccccRRRRRRR.........',
  'yDDDDDDDDDDDDDDDDDy..y',
  '.yDDDDDDDDDDDDDDDDy..y',
  '..yDDDDDDDDDDDDDDy..y.',
  '...yyyyyyyyyyyyyyyyy..',
]

const HEAD = ['...........B..B.', '...........BBBB.', '............BB..', '...........bbbb.']
const BODY = ['..........bbbb..', '.bbbbbbbbbbbb...', 'bbbbbbbbbbbbb...', '.bbbbbbbbbbb....']
// two gallop frames: legs stretched out, legs tucked under
const LEGS_OUT = ['.b.b.....b.b....', 'b...b...b...b...']
const LEGS_IN = ['..bb.....bb.....', '..b.b....b.b....']

const reindeer = (nose: string, legs: Grid): Grid => [...HEAD, `...........bkbb${nose}`, ...BODY, ...legs]

/** One reindeer at (x, y); `phase` offsets its gallop so the team doesn't move in lockstep. */
const deer = (x: number, y: number, nose: string, phase: number) => {
  const delay = `style="animation-delay:${-phase * 0.15}s"`
  return `<g class="legs la" ${delay}>${rects(reindeer(nose, LEGS_OUT), PAL, x, y)}</g><g class="legs lb" ${delay}>${rects(reindeer(nose, LEGS_IN), PAL, x, y)}</g>`
}

export const santaSvg = () => {
  const dust = [0, 1, 2, 3, 4]
    .map((i) => `<rect class="dust" x="${-3 - i * 3}" y="${10 + (i % 2) * 2}" width="1" height="1" style="animation-delay:${i * 0.3}s"/>`)
    .join('')
  // four reindeer in pairs ahead of the sleigh, Rudolph in front
  const team = [deer(26, -1, 'B', 0), deer(44, -2, 'B', 1), deer(62, -2, 'B', 0), deer(80, -3, 'n', 1)].join('')
  return `<svg viewBox="-18 -4 116 19" shape-rendering="crispEdges" aria-hidden="true">
    ${dust}
    <path d="M15 6.5 L28 5 L46 4 L64 4 L82 3" stroke="#c98a00" stroke-width=".6" fill="none"/>
    ${rects(SLEIGH, PAL)}${team}
  </svg>`
}
