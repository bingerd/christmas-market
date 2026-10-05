// Regenerates the pixel-art placeholder images in public/images.
// Run with: node scripts/make-placeholders.ts
// Existing files are kept, so real photos you dropped in are never overwritten
// (pass --force to overwrite anyway).
import { existsSync, writeFileSync } from 'node:fs'
import { charities, suppliers } from '../src/catalog.ts'
import { charitySvg, packageSvg, productFor, stallSvg } from '../src/sprites.ts'

const force = process.argv.includes('--force')
const write = (path: string, content: string) => {
  const file = `public${path}`
  if (!force && existsSync(file)) return
  writeFileSync(file, content)
  console.log('wrote', file)
}

suppliers.forEach((s, i) => {
  write(s.image, stallSvg(s.color, productFor[s.id], i + 3))
  s.packages.forEach((p, j) => write(p.image, packageSvg(s.color, productFor[s.id], Math.min(j + 1, 4))))
})
charities.forEach((c, i) =>
  write(c.image, charitySvg(['#6c1d7f', '#8b0a1f'][i % 2], productFor[c.id])),
)
