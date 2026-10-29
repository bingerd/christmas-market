// Regenerates the pixel-art placeholder images (the .svg ones) in src/images.
// Run with: node scripts/make-placeholders.ts
// Existing files are kept, so tweaked art is never overwritten
// (pass --force to overwrite anyway). Photos are never touched.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { basename, dirname } from 'node:path'
import { charities, suppliers } from '../src/catalog.ts'
import { charitySvg, goodsFor, packageSvg, productFor, stallSvg } from '../src/sprites.ts'

const force = process.argv.includes('--force')
const write = (path: string, content: () => string) => {
  const file = `src/images/${path}`
  if (!path.endsWith('.svg') || (!force && existsSync(file))) return
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content())
  console.log('wrote', file)
}

suppliers.forEach((s, i) => {
  write(s.image, () => stallSvg(s.color, productFor[s.id], i + 3))
  s.packages.forEach((p, j) =>
    write(p.image, () => packageSvg(s.color, goodsFor[basename(p.image, '.svg')] ?? Array(Math.min(j + 1, 4)).fill(productFor[s.id]))),
  )
})
charities.forEach((c, i) =>
  write(c.image, () => charitySvg(['#2e7d4f', '#6c1d7f'][i % 2], productFor[c.id])),
)
