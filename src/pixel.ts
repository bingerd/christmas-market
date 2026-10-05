// Tiny pixel-art helper: turns a character grid into crisp SVG rects.

export type Palette = Record<string, string>
export type Grid = string[]

export interface Layer {
  grid: Grid
  x?: number
  y?: number
}

/** Rects for a grid, merging horizontal runs of the same colour. */
export const rects = (grid: Grid, palette: Palette, ox = 0, oy = 0) => {
  let out = ''
  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      let run = 1
      while (row[x + run] === ch) run++
      const fill = palette[ch]
      if (fill) out += `<rect x="${ox + x}" y="${oy + y}" width="${run}" height="1" fill="${fill}"/>`
      x += run
    }
  })
  return out
}

export const svg = (w: number, h: number, body: string, attrs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" ${attrs}>${body}</svg>`

export const sprite = (grid: Grid, palette: Palette, attrs = '') =>
  svg(Math.max(...grid.map((r) => r.length)), grid.length, rects(grid, palette), attrs)
