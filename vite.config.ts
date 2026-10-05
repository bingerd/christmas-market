import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
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
