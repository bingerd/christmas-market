// Mouse-reactive parallax: every .layer shifts by its own --depth. The offset is
// written onto the layers themselves, not as a variable on the root, so a mouse
// move doesn't restyle the whole page. Off for touch and reduced motion.
export const installParallax = () => {
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
        for (const layer of document.querySelectorAll<HTMLElement>('.layer')) {
          const depth = Number(layer.style.getPropertyValue('--depth')) || 0
          layer.style.translate = `${(-mx * depth).toFixed(2)}px ${(-my * depth * 0.6).toFixed(2)}px`
        }
      })
    },
    { passive: true },
  )
}
