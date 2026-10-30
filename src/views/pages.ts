import { type Package, charities, suppliers } from '../catalog.ts'
import { FORM_URL, LOCATIONS } from '../config.ts'
import { type Grid, sprite } from '../pixel.ts'
import { type Pick, type Resolved, label, needsDelivery, resolve } from '../pick.ts'
import { givingScene, marketScene } from '../scene/gates.ts'
import { villageSvg } from '../scene/village.ts'
import { HEART, MAGNIFIER, PAL, productFor } from '../sprites.ts'
import type { State } from '../state.ts'
import { esc, panel, photo, steps } from './ui.ts'

const icon = (grid: Grid, cls = 'icon') => `<span class="${cls}" aria-hidden="true">${sprite(grid, PAL)}</span>`

const isPicked = (pick: Pick | null, kind: Pick['kind'], id: string) => pick?.kind === kind && pick.id === id

/** A package at a stall, or an animal to adopt: photo (click to enlarge), text and a pick button. */
const offer = (state: State, kind: Pick['kind'], p: Package, cta: string) => {
  const picked = isPicked(state.pick, kind, p.id)
  return `<article class="offer ${picked ? 'picked' : ''}">
    <button class="offer-img zoom" data-action="zoom" data-id="${esc(p.image)}" aria-label="Enlarge the photo of ${esc(p.name)}">${photo(p.image, p.name)}${icon(MAGNIFIER, 'zoom-badge')}</button>
    <div class="offer-body">
      <h2>${esc(p.name)}</h2>
      <p>${esc(p.description)}</p>
      <button class="btn ${picked ? 'btn-picked' : 'btn-primary'}" data-action="pick-${kind}" data-id="${p.id}">
        ${picked ? 'Your pick ✓' : cta}</button>
    </div>
  </article>`
}

// --- home ----------------------------------------------------------------------

export const home = () => `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-village layer" style="--depth:18">${villageSvg()}</div>
    <div class="hero-copy">
      <p class="eyebrow">Winter 2026</p>
      <h1 id="hero-title">Welcome to the <em>Xebia Christmas Market</em></h1>
      <p class="hero-lead">Wander past the stalls of local makers. Pick one gift for yourself, or give it to a good cause.</p>
      <a class="btn btn-primary" href="#/choose">Enter the market</a>
    </div>
    <a class="scroll-cue" href="#/choose" aria-label="Scroll to the market entrance"><span></span></a>
  </section>
  <section class="paths" id="paths" aria-labelledby="paths-title">
    <header class="section-head">
      <p class="eyebrow">One gift per Xebian</p>
      <h2 id="paths-title">Which way will you go?</h2>
    </header>
    <div class="gates">
      <a class="gate" href="#/market" style="--glow:#ffb347">
        <span class="gate-art" aria-hidden="true">${marketScene()}</span>
        <span class="gate-label">The market</span>
        <strong>Choose a present</strong>
        <span class="gate-text">Visit ${suppliers.length} local makers and pick the package you like best. We'll deliver it to your office.</span>
        <span class="gate-go">Walk in →</span>
      </a>
      <a class="gate" href="#/donate" style="--glow:#e5007d">
        <span class="gate-art" aria-hidden="true">${givingScene()}</span>
        <span class="gate-label">The giving booth</span>
        <strong>Donate your gift</strong>
        <span class="gate-text">Give the value of your present to one of ${charities.length} charities instead.</span>
        <span class="gate-go">Walk in →</span>
      </a>
    </div>
  </section>`

// --- market --------------------------------------------------------------------

export const market = (state: State) => `
  ${steps(1)}
  <section class="market" aria-labelledby="market-title">
    <header class="section-head">
      <p class="eyebrow">The market square</p>
      <h1 id="market-title">Step up to a stall</h1>
      <p class="section-lead">Step up to a stall to see what's on offer. You can pick one present.</p>
      <p class="square-hint">Psst… tap the square itself for a little dance (sound on).</p>
    </header>
    <div class="market-map layer" style="--depth:6">${villageSvg({ interactive: true })}</div>
    <p class="swipe-hint" aria-hidden="true">← Swipe to look around →</p>
    <nav class="stall-index" aria-label="All stalls">
      ${suppliers
        .map(
          (s) => `<a class="stall-chip ${state.pick?.kind === 'present' && state.pick.id.startsWith(`${s.id}-`) ? 'has-pick' : ''}" href="#/stall/${s.id}" style="--glow:${s.color}">
            ${icon(productFor[s.id], 'chip-icon')}<span><strong>${esc(s.name)}</strong><small>${esc(s.kind)}</small></span></a>`,
        )
        .join('')}
      <a class="stall-chip" href="#/donate" style="--glow:#e5007d">${icon(HEART, 'chip-icon')}<span><strong>Giving booth</strong><small>Donate instead</small></span></a>
    </nav>
  </section>`

// --- stall ---------------------------------------------------------------------

export const stall = (state: State, id: string) => {
  const i = suppliers.findIndex((s) => s.id === id)
  const s = suppliers[i]
  if (!s) return null
  const prev = suppliers[(i - 1 + suppliers.length) % suppliers.length]
  const next = suppliers[(i + 1) % suppliers.length]
  return `
  ${steps(1)}
  <div class="stall-page" style="--glow:${s.color}">
    <aside class="stall-side">
      <a class="back" href="#/market">← Market square</a>
      <div class="stall-photo-frame">${photo(s.image, `${s.name} market stall`, 'stall-photo')}</div>
      <p class="eyebrow">${esc(s.kind)}</p>
      <h1>${esc(s.name)}</h1>
      <p class="stall-desc">${esc(s.description)}</p>
      <nav class="stall-hop" aria-label="Other stalls">
        <a href="#/stall/${prev.id}">← ${esc(prev.name)}</a>
        <a href="#/stall/${next.id}">${esc(next.name)} →</a>
      </nav>
    </aside>
    <div class="offers">${s.packages.map((p) => offer(state, 'present', p, 'Pick this present')).join('')}</div>
  </div>`
}

// --- donate --------------------------------------------------------------------

export const donate = (state: State) => `
  ${steps(1)}
  <section class="donate" aria-labelledby="donate-title">
    <header class="section-head">
      <p class="eyebrow">The giving booth</p>
      <h1 id="donate-title">Give your gift away</h1>
      <p class="section-lead">Skip the present and we donate its value to one of these charities.</p>
    </header>
    <div class="charities">
      ${charities
        .map((c) => {
          const picked = state.pick?.kind === 'donate' && (c.animals ?? [c]).some((x) => x.id === state.pick?.id)
          // a charity with animals sends you to choose one first
          const button = c.animals
            ? `<a class="btn ${picked ? 'btn-picked' : 'btn-primary'}" href="#/donate/${c.id}">${picked ? 'Your pick ✓' : 'Choose an animal'}</a>`
            : `<button class="btn ${picked ? 'btn-picked' : 'btn-primary'}" data-action="pick-donate" data-id="${c.id}">
                ${picked ? 'Your pick ✓' : `Donate to ${esc(c.name)}`}</button>`
          return `<article class="offer charity ${picked ? 'picked' : ''}">
            <div class="offer-img">${photo(c.image, c.name)}</div>
            <div class="offer-body">
              <p class="eyebrow">${esc(c.tagline)}</p>
              <h2>${esc(c.name)}</h2>
              <p>${esc(c.description)}</p>
              ${c.url ? `<p><a class="link" href="${esc(c.url)}" target="_blank" rel="noopener">About ${esc(c.name)} ↗</a></p>` : ''}
              ${button}
            </div>
          </article>`
        })
        .join('')}
    </div>
    <p class="aside-link"><a href="#/market">← Rather have a present? Back to the market</a></p>
  </section>`

/** The animals of a charity, laid out like a stall. */
export const adopt = (state: State, id: string) => {
  const c = charities.find((c) => c.id === id)
  if (!c?.animals) return null
  return `
  ${steps(1)}
  <div class="stall-page" style="--glow:#e5007d">
    <aside class="stall-side">
      <a class="back" href="#/donate">← Giving booth</a>
      <div class="stall-photo-frame">${photo(c.image, c.name, 'stall-photo')}</div>
      <p class="eyebrow">${esc(c.tagline)}</p>
      <h1>${esc(c.name)}</h1>
      <p class="stall-desc">${esc(c.description)}</p>
      ${c.url ? `<p class="stall-hop"><a href="${esc(c.url)}" target="_blank" rel="noopener">About ${esc(c.name)} ↗</a></p>` : ''}
    </aside>
    <div class="offers">${c.animals.map((a) => offer(state, 'donate', a, 'Adopt this one')).join('')}</div>
  </div>`
}

// --- details & review ----------------------------------------------------------

const pickSummary = (r: Resolved) => {
  const img = r.kind === 'present' ? r.pkg.image : (r.animal ?? r.charity).image
  const change = r.kind === 'present' ? `#/stall/${r.supplier.id}` : r.animal ? `#/donate/${r.charity.id}` : '#/donate'
  return `<div class="pick-summary">
    ${photo(img, '', 'pick-thumb')}
    <div><p class="eyebrow">${r.kind === 'present' ? 'Your present' : r.animal ? 'Your adoption' : 'Your donation'}</p><strong>${esc(label(r))}</strong></div>
    <a class="link" href="${change}">Change</a>
  </div>`
}

const choice = (name: string, value: string, checked: boolean) =>
  `<label class="choice"><input type="radio" name="${name}" value="${esc(value)}" ${checked ? 'checked' : ''}><span>${esc(value)}</span></label>`

/** Only picks that get delivered have details to fill in: where to drop them off. */
export const details = (state: State) => {
  const r = resolve(state.pick)
  if (!r || !needsDelivery(state.pick)) return null
  return `${steps(2)}${panel(
    `<h1>One more detail</h1>
    ${pickSummary(r)}
    <form data-form="details" novalidate>
      <fieldset>
        <legend>Where should we drop off your ${r.kind === 'present' ? 'present' : 'adoption pack'}?</legend>
        <div class="choices">${LOCATIONS.map((l) => choice('location', l, state.location === l)).join('')}</div>
      </fieldset>
      <p class="hint">No need to fill in your email. You'll sign in with your Xebia account in the last step, and that's how we know it's you.</p>
      <p class="error" role="alert" hidden></p>
      <div class="actions"><button class="btn btn-primary" type="submit">Review my pick</button></div>
    </form>`,
    'narrow',
  )}`
}

export const review = (state: State, formUrl: string | null) => {
  const r = resolve(state.pick)
  if (!r) return null
  return `${steps(3)}${panel(
    `<h1>All set?</h1>
    ${pickSummary(r)}
    ${needsDelivery(state.pick) ? `<dl class="facts"><dt>Drop-off</dt><dd>${esc(state.location)}</dd></dl>` : ''}
    ${
      formUrl
        ? `<p class="hint">Last step: Microsoft Forms opens with your answers already filled in. Sign in with your Xebia account and press <strong>Submit</strong>. Nothing is ordered until you do.</p>
        <div class="actions"><a class="btn btn-primary btn-wide" href="${esc(formUrl)}" target="_blank" rel="noopener">Confirm in Microsoft Forms ↗</a></div>`
        : `<p class="hint warn">The order form isn't connected yet${FORM_URL ? '' : ' (FORM_URL is empty in src/config.ts)'}. Check back soon!</p>`
    }
    <div class="actions split">
      ${needsDelivery(state.pick) ? '<a class="link" href="#/details">← Edit details</a>' : '<span></span>'}
      <button class="link" data-action="reset">Start over</button>
    </div>`,
    'narrow',
  )}`
}

export const notFound = () =>
  panel(`<h1>This stall has packed up</h1><p>We couldn't find that page.</p><div class="actions"><a class="btn btn-primary" href="#/">Back to the square</a></div>`, 'narrow')

export const pickPill = (state: State) => {
  const r = resolve(state.pick)
  return r ? `<a class="pick-pill" href="#/details"><span class="pill-dot"></span><span class="pill-text">${esc(label(r))}</span></a>` : ''
}
