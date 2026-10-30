const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c])

/** Glass panel with pixel-notched corners. */
export const panel = (body: string, cls = '') => `<section class="panel ${cls}">${body}</section>`

export const STEPS = ['Path', 'Pick', 'Details', 'Confirm'] as const

export const steps = (current: number) => `
  <ol class="steps" aria-label="Progress">
    ${STEPS.map((s, i) => `<li class="${i < current ? 'done' : i === current ? 'now' : ''}" ${i === current ? 'aria-current="step"' : ''}><span></span>${s}</li>`).join('')}
  </ol>`

// Every picture in src/images, keyed by its path inside that folder. Photos come
// with a srcset of widths up to the original (see vite.config.ts).
const PHOTOS = import.meta.glob<{ src: string; srcset?: string; w: number; h: number }>('../images/**/*.{jpg,png}', { eager: true, query: '?photo', import: 'default' })
const ART = import.meta.glob<string>('../images/**/*.svg', { eager: true, query: '?url', import: 'default' })

/** `path` is relative to src/images, as used in the catalogue. */
export const photo = (path: string, alt: string, cls = '') => {
  const key = `../images/${path}`
  const p = PHOTOS[key]
  const src = p ? `src="${esc(p.src)}"${p.srcset ? ` srcset="${esc(p.srcset)}" sizes="(max-width: 559px) 100vw, 400px"` : ''}` : `src="${esc(ART[key] ?? '')}"`
  return `<img class="photo ${cls}" ${src} alt="${esc(alt)}" loading="lazy" decoding="async">`
}

let lightbox: HTMLDialogElement | undefined

/** The uncropped picture behind a card photo: full/<same name> next to it, if there is one. */
const fullPicture = (path: string) => PHOTOS[`../images/${path.replace(/[^/]+$/, 'full/$&')}`] ?? PHOTOS[`../images/${path}`]

/** Show the whole picture as large as the screen allows, framed in its stall's colour. */
export const enlarge = (from: HTMLImageElement, path: string) => {
  const full = fullPicture(path)
  if (!full) return
  if (!lightbox) {
    lightbox = document.createElement('dialog')
    lightbox.className = 'lightbox'
    lightbox.innerHTML = '<figure><img alt=""><figcaption><span></span><button class="link">Close</button></figcaption></figure>'
    // a click anywhere closes it, like Esc
    lightbox.addEventListener('click', () => lightbox?.close())
    document.body.append(lightbox)
  }
  const img = lightbox.querySelector('img')!
  img.removeAttribute('srcset')
  img.removeAttribute('src')
  img.alt = from.alt
  // the frame takes the picture's shape before it loads, so it can be sized for this screen
  img.style.setProperty('--ar', `${full.w} / ${full.h}`)
  lightbox.querySelector('figcaption span')!.textContent = from.alt
  lightbox.style.setProperty('--glow', getComputedStyle(from).getPropertyValue('--glow'))
  lightbox.showModal()
  img.sizes = `${Math.ceil(img.getBoundingClientRect().width * 1.25)}px`
  if (full.srcset) img.srcset = full.srcset
  img.src = full.src
}

/**
 * Point each photo's srcset at 1.25x its laid-out width. Chrome draws a photo
 * softest when the file is only a little bigger than its box (measured against
 * the originals: ~0.75 of a perfect resize at 1.0-1.2x, ~0.85 from 1.25x up),
 * so never let it pick a file that is just big enough. Call after rendering.
 */
export const sizePhotos = (root: ParentNode) => {
  for (const img of root.querySelectorAll<HTMLImageElement>('img.photo[srcset]')) {
    const w = img.getBoundingClientRect().width
    if (w) img.sizes = `${Math.ceil(w * 1.25)}px`
  }
}
