// Mouse-reactive parallax: sets --mx / --my (-1…1) on the root; layers move
// by their own --depth in CSS. Off for touch and reduced motion.
export const installParallax = (root: HTMLElement) => {
  const fine = matchMedia('(pointer: fine)')
  const calm = matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let mx = 0
  let my = 0
  addEventListener(
    'pointermove',
    (e) => {
      if (!fine.matches || calm.matches) return
      mx = (e.clientX / innerWidth) * 2 - 1
      my = (e.clientY / innerHeight) * 2 - 1
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        root.style.setProperty('--mx', mx.toFixed(3))
        root.style.setProperty('--my', my.toFixed(3))
      })
    },
    { passive: true },
  )
}
