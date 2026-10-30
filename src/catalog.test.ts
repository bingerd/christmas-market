import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { charities, suppliers } from './catalog.ts'
import { productFor } from './sprites.ts'

const packages = suppliers.flatMap((s) => s.packages.map((p) => ({ supplier: s, pkg: p })))
const animals = charities.flatMap((c) => (c.animals ?? []).map((a) => ({ charity: c, animal: a })))

describe('catalog', () => {
  it('has unique ids', () => {
    const ids = [...suppliers.map((s) => s.id), ...packages.map(({ pkg }) => pkg.id), ...charities.map((c) => c.id), ...animals.map(({ animal }) => animal.id)]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("prefixes package ids with their supplier's id", () => {
    // the market uses this to mark the stall you picked from
    for (const { supplier, pkg } of packages) expect(pkg.id.startsWith(`${supplier.id}-`)).toBe(true)
    for (const { charity, animal } of animals) expect(animal.id.startsWith(`${charity.id}-`)).toBe(true)
  })

  it('has an image file for everything', () => {
    const images = [...suppliers, ...packages.map(({ pkg }) => pkg), ...charities, ...animals.map(({ animal }) => animal)].map((x) => x.image)
    const missing = images.filter((path) => !existsSync(new URL(`./images/${path}`, import.meta.url)))
    expect(missing).toEqual([])
  })

  it('has a pixel-art icon for every stall and charity', () => {
    for (const { id } of [...suppliers, ...charities]) expect(productFor[id], id).toBeDefined()
  })
})
