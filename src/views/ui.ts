import { PIXELATE_PHOTOS_TO } from '../config.ts'

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c])

/** Glass panel with pixel-notched corners. */
export const panel = (body: string, cls = '') => `<section class="panel ${cls}">${body}</section>`

export const STEPS = ['Path', 'Pick', 'Details', 'Confirm'] as const

export const steps = (current: number) => `
  <ol class="steps" aria-label="Progress">
    ${STEPS.map((s, i) => `<li class="${i < current ? 'done' : i === current ? 'now' : ''}" ${i === current ? 'aria-current="step"' : ''}><span></span>${s}</li>`).join('')}
  </ol>`

// Real photos get downscaled so they sit nicely between the pixel art.
const pixelated = new Map<string, string>()

export const photo = (src: string, alt: string, cls = '') => {
  const cached = pixelated.get(src)
  return `<img class="photo ${cls}" src="${esc(cached ?? src)}" data-src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`
}

export const installPhotoPixelator = (root: HTMLElement) => {
  if (!PIXELATE_PHOTOS_TO) return
  root.addEventListener(
    'load',
    (e) => {
      const img = e.target
      if (!(img instanceof HTMLImageElement) || !img.classList.contains('photo')) return
      const src = img.dataset.src ?? ''
      if (pixelated.has(src) || /\.svg($|\?)/i.test(src) || img.naturalWidth <= PIXELATE_PHOTOS_TO) return
      const w = PIXELATE_PHOTOS_TO
      const h = Math.round((img.naturalHeight / img.naturalWidth) * w)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, w, h)
      try {
        const url = canvas.toDataURL('image/png')
        pixelated.set(src, url)
        img.src = url
      } catch {
        pixelated.set(src, src) // cross-origin image, leave as is
      }
    },
    true,
  )
}
