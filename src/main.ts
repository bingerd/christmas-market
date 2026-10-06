import './styles.css'
import { FORM_FIELDS, FORM_TYPE_LABELS, FORM_URL, NO_DELIVERY_LABEL } from './config.ts'
import { buildFormUrl } from './formLink.ts'
import { needsDelivery } from './pick.ts'
import { installParallax } from './scene/parallax.ts'
import { santaSvg } from './scene/santa.ts'
import { installDance } from './scene/village.ts'
import { skylineSvg, starsSvg } from './scene/skyline.ts'
import { PAL, SANTA_HAT } from './sprites.ts'
import { sprite } from './pixel.ts'
import { type State, load, reset, save } from './state.ts'
import * as pages from './views/pages.ts'
import { installPhotoPixelator } from './views/ui.ts'

const app = document.querySelector<HTMLElement>('#app')!
const pill = document.querySelector<HTMLElement>('#pick-pill')!
document.querySelector('#sky-stars')!.innerHTML = starsSvg()
document.querySelector('#sky-line')!.innerHTML = skylineSvg()
document.querySelector('#sky-santa .sleigh')!.innerHTML = santaSvg()
document.querySelector('.santa-hat')!.innerHTML = sprite(SANTA_HAT, PAL)

let state: State = load()
let rendered = ''

const route = () => location.hash.replace(/^#\/?/, '').split('/')

const formUrl = () => {
  if (!FORM_URL) return null
  try {
    return buildFormUrl(
      { url: FORM_URL, fields: FORM_FIELDS, typeLabels: FORM_TYPE_LABELS, noDeliveryLabel: NO_DELIVERY_LABEL },
      state,
      state.pick,
    )
  } catch {
    return null
  }
}

const detailsComplete = () => !!state.serviceLine && (!needsDelivery(state.pick) || !!state.location)

const redirect = (path: string) => {
  queueMicrotask(() => location.replace(`#${path}`))
  return ''
}

const view = ([page, id]: string[]): string => {
  switch (page) {
    case '':
    case 'choose':
      return pages.home()
    case 'market':
      return pages.market(state)
    case 'stall':
      return pages.stall(state, id ?? '') ?? pages.notFound()
    case 'donate':
      return pages.donate(state)
    case 'details':
      return pages.details(state) ?? redirect('/choose')
    case 'review':
      if (!detailsComplete()) return redirect('/details')
      return pages.review(state, formUrl()) ?? redirect('/choose')
    default:
      return pages.notFound()
  }
}

const pageName = (page: string) => (page === 'choose' || !page ? 'home' : page)

const render = (animate = true) => {
  const [page, id] = route()
  const name = pageName(page)
  const key = `${name}/${id ?? ''}`
  pill.innerHTML = pages.pickPill(state)

  // "/" and "/choose" are the same page: just scroll instead of re-rendering
  if (key === rendered && name === 'home') {
    scrollToTarget(page)
    return
  }

  const swap = () => {
    // keep keyboard focus on the same control across in-place re-renders
    const active = document.activeElement as HTMLElement | null
    const focusSel = key === rendered && active?.dataset.action ? `[data-action="${active.dataset.action}"][data-id="${active.dataset.id}"]` : null
    document.body.dataset.page = name
    app.innerHTML = view([page, id])
    if (focusSel) app.querySelector<HTMLElement>(focusSel)?.focus({ preventScroll: true })
    // on phones the market square is wider than the screen: start on the tree
    const map = app.querySelector<HTMLElement>('.market-map')
    if (map) map.scrollLeft = (map.scrollWidth - map.clientWidth) / 2
    const fresh = key !== rendered
    rendered = key
    if (fresh) scrollToTarget(page)
  }

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (animate && !calm && key !== rendered && document.startViewTransition) document.startViewTransition(swap)
  else swap()
}

const scrollToTarget = (page: string) => {
  if (page === 'choose') document.getElementById('paths')?.scrollIntoView({ behavior: 'smooth' })
  else window.scrollTo({ top: 0 })
}

const update = (next: State, go?: string) => {
  state = next
  save(state)
  if (go && location.hash !== go) location.hash = go
  else render(false)
}

app.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-action]')
  if (!el) return
  const id = el.dataset.id ?? ''
  switch (el.dataset.action) {
    case 'pick-present':
      return update({ ...state, pick: { kind: 'present', id } }, '#/details')
    case 'pick-donate':
      return update({ ...state, pick: { kind: 'donate', id } }, '#/details')
    case 'reset':
      state = reset()
      location.hash = '#/'
      return
  }
})

app.addEventListener('submit', (e) => {
  const form = e.target as HTMLFormElement
  if (form.dataset.form !== 'details') return
  e.preventDefault()
  const data = new FormData(form)
  const serviceLine = String(data.get('serviceLine') ?? '')
  const location_ = data.get('location')
  state = { ...state, serviceLine, location: location_ === null ? state.location : String(location_) }
  save(state)
  const error = form.querySelector<HTMLElement>('.error')!
  if (!detailsComplete()) {
    error.hidden = false
    error.textContent = !serviceLine ? 'Pick your service line.' : 'Pick a drop-off location.'
    return
  }
  location.hash = '#/review'
})

installPhotoPixelator(app)
installParallax(document.documentElement)
installDance(app)
window.addEventListener('hashchange', () => render())
render(false)
