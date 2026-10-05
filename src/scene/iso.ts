// Isometric helpers in the Habbo room style (2:1 tiles).
export type Pt = [number, number]

export interface Iso {
  /** Screen point for tile coords (x, y) at height z. */
  at: (x: number, y: number, z?: number) => Pt
  poly: (fill: string, ...p: Pt[]) => string
  /** Box on (x, y), footprint w × d tiles, from height z0 to z1. Top, front-left, front-right colours. */
  box: (x: number, y: number, w: number, d: number, z0: number, z1: number, top: string, left: string, right: string) => string
  /** Flat diamond on the floor. */
  tile: (x: number, y: number, w: number, d: number, fill: string, extra?: string) => string
}

export const iso = (ox: number, oy: number, tw = 32, th = 16): Iso => {
  const at = (x: number, y: number, z = 0): Pt => [ox + (x - y) * (tw / 2), oy + (x + y) * (th / 2) - z]
  const pts = (p: Pt[]) => p.map(([a, b]) => `${+a.toFixed(2)},${+b.toFixed(2)}`).join(' ')
  const poly = (fill: string, ...p: Pt[]) => `<polygon points="${pts(p)}" fill="${fill}"/>`
  return {
    at,
    poly,
    box: (x, y, w, d, z0, z1, top, left, right) =>
      poly(left, at(x, y + d, z0), at(x + w, y + d, z0), at(x + w, y + d, z1), at(x, y + d, z1)) +
      poly(right, at(x + w, y, z0), at(x + w, y + d, z0), at(x + w, y + d, z1), at(x + w, y, z1)) +
      poly(top, at(x, y, z1), at(x + w, y, z1), at(x + w, y + d, z1), at(x, y + d, z1)),
    tile: (x, y, w, d, fill, extra = '') =>
      `<polygon points="${pts([at(x, y), at(x + w, y), at(x + w, y + d), at(x, y + d)])}" fill="${fill}" ${extra}/>`,
  }
}

/** Deterministic pseudo-random numbers so the scene looks the same every visit. */
export const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}
