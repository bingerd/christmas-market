import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

// Photos are stored at full resolution. `?photo` turns one into a ladder of
// widths up to the original (never upscaled), so every screen downloads only
// the size it needs and big or zoomed-in screens still get every pixel.
const LADDER = [480, 800, 1200, 1600, 2400, 3200]

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: async (url, metadata) => {
        if (!url.searchParams.has('photo')) return new URLSearchParams()
        const { width = 0 } = await metadata()
        const widths = [...LADDER.filter((w) => w < width), width]
        return new URLSearchParams({ w: widths.join(';'), quality: '82', progressive: '', as: 'img' })
      },
    }),
    {
      // GitHub Pages serves 404.html for unknown paths; make it the app.
      name: 'pages-404',
      closeBundle() {
        const dist = resolve(import.meta.dirname, 'dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
})
