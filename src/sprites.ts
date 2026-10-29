import { type Grid, type Palette, rects, svg } from './pixel.ts'

export const PAL: Palette = {
  k: '#1b1028', // outline
  w: '#ffffff',
  s: '#f3e9dc', // snow
  S: '#c9d6e8', // snow shade
  p: '#6c1d7f', // xebia purple
  P: '#9b3fb5', // light purple
  m: '#e5007d', // magenta
  r: '#c8102e',
  R: '#8b0a1f',
  g: '#2e7d4f',
  G: '#1d5234',
  y: '#ffd23f',
  Y: '#d9a400',
  o: '#c98a00',
  b: '#7b4a2d', // wood / chocolate
  B: '#4e2c18',
  c: '#5b3216', // dark chocolate
  f: '#f5c7a1', // skin
  F: '#d99a74',
  h: '#3b2416', // hair
  v: '#5e0f2e', // wine
  V: '#8e1e46',
  l: '#bfe3ff', // glass
  n: '#2b2b44', // trousers
}

const pal = (over: Palette = {}) => ({ ...PAL, ...over })

// --- Products ---------------------------------------------------------------

export const CHEESE: Grid = [
  '......kkk...',
  '....kkyyyk..',
  '..kkyyyyyyk.',
  'kkyyyyyyyyyk',
  'kyyyyyyyyyyk',
  'kyyYyyyyyyok',
  'kyyyyyyYyyok',
  'kyYyyyyyyyok',
  'kyyyyyYyyyok',
  'kooooooooook',
  '.kkkkkkkkkk.',
]

export const WINE: Grid = [
  '..kk.....',
  '..kk.....',
  '..vk.....',
  '.kvVk....',
  'kvvvVk.kk',
  'kvwwVkklk',
  'kvwwVkklk',
  'kvwwVk.kk',
  'kvvvVk..k',
  'kvvvVk..k',
  '.kkkk..kk',
]

export const CHOCOLATE: Grid = [
  'kkkkkkkkkk',
  'kbcbcbcbck',
  'kcccccccck',
  'kbcbcbcbck',
  'kcccccccck',
  'kmmmmmmmmk',
  'kmyyyyyymk',
  'kmmmmmmmmk',
  'kmmmmmmmmk',
  'kkkkkkkkkk',
]

export const BEER: Grid = [
  '.kkkkkkkk...',
  'kwwwswwwwk..',
  'kwwwwwwswk..',
  'kyyyyyyyykkk',
  'kyywyyyyyk.k',
  'kyyyyyyYyk.k',
  'kyyyyyyyyk.k',
  'kyyyywyyYk.k',
  'kyyyyyyyykkk',
  'kYyyyyyyYk..',
  'kYYYYYYYYk..',
  '.kkkkkkkk...',
]

export const POT: Grid = [
  '.....kk.....',
  '....kRRk....',
  '..kkkkkkkk..',
  '.krrwrrrrrk.',
  'kkkkkkkkkkkk',
  'k.krrrrrRk.k',
  'kkkrwrrrRkkk',
  '..krrrrrRk..',
  '..kRRRRRRk..',
  '...kkkkkk...',
]

/** Badge on photos you can enlarge. */
export const MAGNIFIER: Grid = [
  '..kkkk......',
  '.kwwllk.....',
  'kwlllllk....',
  'kllllllk....',
  'kllllllk....',
  'kllllllk....',
  '.kllllkk....',
  '..kkkkbbk...',
  '......kbbk..',
  '.......kbbk.',
  '........kbbk',
  '.........kk.',
]

export const HEART: Grid = [
  '.kkk...kkk.',
  'kmmmk.kmmmk',
  'kmwmmkmmmmk',
  'kmmmmmmmmmk',
  'kmmmmmmmmmk',
  '.kmmmmmmmk.',
  '..kmmmmmk..',
  '...kmmmk...',
  '....kmk....',
  '.....k.....',
]

export const PANDA: Grid = [
  '.kkk....kkk.',
  'kkkkkkkkkkkk',
  'kkwwwwwwwwkk',
  'kwwwwwwwwwwk',
  'kwkkkwwkkkwk',
  'kwkwkwwkwkwk',
  'kwkkwwwwkkwk',
  'kwwwwkkwwwwk',
  'kSwwwwwwwwSk',
  '.kSwwkkwwSk.',
  '..kkkkkkkk..',
]

export const TEDDY: Grid = [
  '.kkk.....kkk.',
  'kFfFkkkkkFfFk',
  'kFFFFFFFFFFFk',
  '.kFFFFFFFFFk.',
  'kFFkFFFFFkFFk',
  'kFFFFfffFFFFk',
  'kFFFFfkfFFFFk',
  '.kFFFfffFFFk.',
  '..kFFFFFFFk..',
  '...kkkkkkk...',
]

/** Habbo-ish avatar, 10x20. `t` is the shirt colour. */
// Sits on the top-right arm of the Xebia X in the header.
export const SANTA_HAT: Grid = [
  '.....kkkk......',
  '....krrrrkkk...',
  '...krrrrrrrRk..',
  '...krrrrrkkRRk.',
  '..krrrrrRk.kwwk',
  '..krrrrrRk.kwsk',
  '.krrrrrrRk..kk.',
  '.krrrrrrRk.....',
  'kwwwwwwwwwwk...',
  'kwswwswwswwk...',
  'kSSSSSSSSSSk...',
  '.kkkkkkkkkk....',
]

export const AVATAR: Grid = [
  '..hhhhhh..',
  '.hhhhhhhh.',
  '.hffffffh.',
  '.fkffffkf.',
  '.ffffffff.',
  '..fFmmFf..',
  '...ffff...',
  '.tttttttt.',
  'tttwttwttt',
  'tttttttttt',
  'fttttttttf',
  'fttttttttf',
  '.tttttttt.',
  '.nnnnnnnn.',
  '.nnn..nnn.',
  '.nnn..nnn.',
  '.nnn..nnn.',
  '.kkk..kkk.',
  'kkkk..kkkk',
  '..........',
]

export const avatar = (shirt: string, hair = PAL.h, attrs = '') =>
  svg(10, 20, rects(AVATAR, pal({ t: shirt, h: hair })), attrs)

export const productFor: Record<string, Grid> = {
  'de-magistraat': BEER,
  balthazar: POT,
  alexanderhoeve: CHEESE,
  'olala-chocola': CHOCOLATE,
  gastrovino: WINE,
  wwf: PANDA,
  'het-vergeten-kind': TEDDY,
}

const width = (g: Grid) => Math.max(...g.map((r) => r.length))


// --- Scenes used as placeholder "photos" -----------------------------------

const snowflakes = (w: number, h: number, seed: number) => {
  let out = ''
  let s = seed
  for (let i = 0; i < 14; i++) {
    s = (s * 9301 + 49297) % 233280
    const x = s % w
    s = (s * 9301 + 49297) % 233280
    const y = s % h
    out += `<rect x="${x}" y="${y}" width="1" height="1" fill="#fff" opacity=".8"/>`
  }
  return out
}

/** A market stall with a striped awning in `color` and its product on the counter. */
export const stallSvg = (color: string, product: Grid, seed = 1) => {
  const W = 64
  const H = 48
  let b = `<rect width="${W}" height="${H}" fill="#1c1640"/>`
  b += snowflakes(W, 20, seed)
  // back wall + shelves
  b += `<rect x="8" y="14" width="48" height="22" fill="#4e2c18"/>`
  b += `<rect x="10" y="22" width="44" height="2" fill="#7b4a2d"/>`
  b += `<rect x="10" y="29" width="44" height="2" fill="#7b4a2d"/>`
  // little product copies on the shelves
  for (let i = 0; i < 4; i++) b += `<rect x="${13 + i * 11}" y="18" width="5" height="4" fill="${color}"/>`
  for (let i = 0; i < 5; i++) b += `<rect x="${12 + i * 9}" y="26" width="4" height="3" fill="#ffd23f" opacity=".7"/>`
  // shopkeeper
  b += `<g transform="translate(43 16)">${rects(AVATAR.slice(0, 13), pal({ t: '#6c1d7f' }))}</g>`
  // posts
  b += `<rect x="6" y="8" width="2" height="36" fill="#4e2c18"/><rect x="56" y="8" width="2" height="36" fill="#4e2c18"/>`
  // awning stripes with scalloped edge
  for (let i = 0; i < 8; i++) {
    const fill = i % 2 ? '#ffffff' : color
    b += `<rect x="${4 + i * 7}" y="5" width="7" height="8" fill="${fill}"/>`
    b += `<rect x="${5 + i * 7}" y="13" width="5" height="2" fill="${fill}"/>`
  }
  b += `<rect x="3" y="3" width="58" height="3" fill="#1b1028"/>`
  // snow on the roof
  b += `<rect x="3" y="1" width="58" height="2" fill="#f3e9dc"/>`
  // string lights
  for (let i = 0; i < 10; i++)
    b += `<rect x="${6 + i * 6}" y="${16 + (i % 2)}" width="2" height="2" fill="${['#ffd23f', '#e5007d', '#2fd27a', '#5ab4ff'][i % 4]}"/>`
  // counter
  b += `<rect x="4" y="36" width="56" height="10" fill="#7b4a2d"/>`
  b += `<rect x="4" y="36" width="56" height="2" fill="#a06a3f"/>`
  b += `<rect x="4" y="45" width="56" height="1" fill="#1b1028"/>`
  // product on the counter
  b += `<g transform="translate(${32 - Math.floor(width(product) / 2)} ${36 - product.length + 2})">${rects(product, PAL)}</g>`
  // snowy ground
  b += `<rect x="0" y="46" width="${W}" height="2" fill="#f3e9dc"/>`
  return svg(W, H, b, 'width="640" height="480"')
}

/** Goods lined up on a counter, used as package placeholder. */
export const packageSvg = (color: string, goods: Grid[]) => {
  const W = 64
  const H = 48
  let b = `<rect width="${W}" height="${H}" fill="#3d3175"/>`
  b += `<rect x="0" y="34" width="${W}" height="14" fill="#7b4a2d"/>`
  b += `<rect x="0" y="34" width="${W}" height="2" fill="#a06a3f"/>`
  // ribbon backdrop
  b += `<rect x="0" y="8" width="${W}" height="3" fill="${color}" opacity=".6"/>`
  b += snowflakes(W, 30, goods.length + 4)
  const gap = 2
  const totalW = goods.reduce((sum, g) => sum + width(g), 0) + (goods.length - 1) * gap
  // a few goods get drawn bigger so they fill the frame
  const scale = Math.max(1, Math.floor(56 / totalW))
  let x = Math.floor((W - totalW * scale) / 2)
  for (const g of goods) {
    b += `<g transform="translate(${x} ${36 - g.length * scale}) scale(${scale})">${rects(g, PAL)}</g>`
    x += (width(g) + gap) * scale
  }
  return svg(W, H, b, 'width="640" height="480"')
}

export const charitySvg = (color: string, product: Grid) => {
  const W = 64
  const H = 48
  let b = `<rect width="${W}" height="${H}" fill="${color}"/>`
  b += snowflakes(W, H, 7)
  const scale = 2
  const pw = width(product) * scale
  const ph = product.length * scale
  b += `<g transform="translate(${(W - pw) / 2} ${(H - ph) / 2}) scale(${scale})">${rects(product, PAL)}</g>`
  return svg(W, H, b, 'width="640" height="480"')
}
