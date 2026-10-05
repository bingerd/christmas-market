import { charities, suppliers } from '../catalog.ts'
import { FORM_URL, LOCATIONS, SERVICE_LINES } from '../config.ts'
import { sprite } from '../pixel.ts'
import { type Pick, type Resolved, label, needsDelivery, resolve } from '../pick.ts'
import { villageSvg } from '../scene/village.ts'
import { BASKET, HEART, PAL, productFor, stallSvg } from '../sprites.ts'
import type { State } from '../state.ts'
import { esc, panel, photo, steps } from './ui.ts'

const icon = (id: string, cls = 'icon') => `<span class="${cls}" aria-hidden="true">${sprite(productFor[id], PAL)}</span>`

const isPicked = (pick: Pick | null, kind: Pick['kind'], id: string) => pick?.kind === kind && pick.id === id

// --- home ----------------------------------------------------------------------

export const home = () => `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-village layer" style="--depth:18">${villageSvg()}</div>
    <div class="hero-copy">
      <p class="eyebrow">Xebia · Winter 2026</p>
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
        <span class="gate-art" aria-hidden="true">${stallSvg('#f2c94c', BASKET, 4)}</span>
        <span class="gate-label">The market</span>
        <strong>Choose a present</strong>
        <span class="gate-text">Visit ${suppliers.length} local makers and pick the package you like best. We'll deliver it to your office.</span>
        <span class="gate-go">Walk in →</span>
      </a>
      <a class="gate" href="#/donate" style="--glow:#e5007d">
        <span class="gate-art" aria-hidden="true">${stallSvg('#e5007d', HEART, 9)}</span>
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
      <p class="section-lead">Hover a stall to light it up, click to see what's on offer. You can pick one present.</p>
      <p class="square-hint">Psst… click the square itself for a little dance (sound on).</p>
    </header>
    <div class="market-map layer" style="--depth:6">${villageSvg({ interactive: true })}</div>
    <nav class="stall-index" aria-label="All stalls">
      ${suppliers
        .map(
          (s) => `<a class="stall-chip ${state.pick?.kind === 'present' && state.pick.id.startsWith(`${s.id}-`) ? 'has-pick' : ''}" href="#/stall/${s.id}" style="--glow:${s.color}">
            ${icon(s.id, 'chip-icon')}<span><strong>${esc(s.name)}</strong><small>${esc(s.kind)}</small></span></a>`,
        )
        .join('')}
      <a class="stall-chip" href="#/donate" style="--glow:#e5007d">${icon('free-a-girl', 'chip-icon')}<span><strong>Giving booth</strong><small>Donate instead</small></span></a>
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
    <div class="offers">
      ${s.packages
        .map((p) => {
          const picked = isPicked(state.pick, 'present', p.id)
          return `<article class="offer ${picked ? 'picked' : ''}">
            <div class="offer-img">${photo(p.image, p.name)}</div>
            <div class="offer-body">
              <h2>${esc(p.name)}</h2>
              <p>${esc(p.description)}</p>
              <button class="btn ${picked ? 'btn-picked' : 'btn-primary'}" data-action="pick-present" data-id="${p.id}">
                ${picked ? 'Your pick ✓' : 'Pick this present'}</button>
            </div>
          </article>`
        })
        .join('')}
    </div>
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
          const picked = isPicked(state.pick, 'donate', c.id)
          return `<article class="offer charity ${picked ? 'picked' : ''}">
            <div class="offer-img">${photo(c.image, c.name)}</div>
            <div class="offer-body">
              <p class="eyebrow">${esc(c.tagline)}</p>
              <h2>${esc(c.name)}</h2>
              <p>${esc(c.description)}</p>
              ${c.url ? `<p><a class="link" href="${esc(c.url)}" target="_blank" rel="noopener">About ${esc(c.name)} ↗</a></p>` : ''}
              <button class="btn ${picked ? 'btn-picked' : 'btn-primary'}" data-action="pick-donate" data-id="${c.id}">
                ${picked ? 'Your pick ✓' : `Donate to ${esc(c.name)}`}</button>
            </div>
          </article>`
        })
        .join('')}
    </div>
    <p class="aside-link"><a href="#/market">← Rather have a present? Back to the market</a></p>
  </section>`

// --- details & review ----------------------------------------------------------

const pickSummary = (r: Resolved) => {
  const img = r.kind === 'present' ? r.pkg.image : r.charity.image
  const change = r.kind === 'present' ? `#/stall/${r.supplier.id}` : '#/donate'
  return `<div class="pick-summary">
    ${photo(img, '', 'pick-thumb')}
    <div><p class="eyebrow">${r.kind === 'present' ? 'Your present' : 'Your donation'}</p><strong>${esc(label(r))}</strong></div>
    <a class="link" href="${change}">Change</a>
  </div>`
}

const choice = (name: string, value: string, checked: boolean) =>
  `<label class="choice"><input type="radio" name="${name}" value="${esc(value)}" ${checked ? 'checked' : ''}><span>${esc(value)}</span></label>`

export const details = (state: State) => {
  const r = resolve(state.pick)
  if (!r) return null
  const delivery = needsDelivery(state.pick)
  return `${steps(2)}${panel(
    `<h1>A couple of details</h1>
    ${pickSummary(r)}
    <form data-form="details" novalidate>
      <fieldset>
        <legend>Your service line</legend>
        <div class="choices">${SERVICE_LINES.map((s) => choice('serviceLine', s, state.serviceLine === s)).join('')}</div>
      </fieldset>
      ${
        delivery
          ? `<fieldset>
        <legend>Where should we drop off your present?</legend>
        <div class="choices">${LOCATIONS.map((l) => choice('location', l, state.location === l)).join('')}</div>
      </fieldset>`
          : ''
      }
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
    <dl class="facts">
      <dt>Service line</dt><dd>${esc(state.serviceLine)}</dd>
      ${r.kind === 'present' ? `<dt>Drop-off</dt><dd>${esc(state.location)}</dd>` : ''}
    </dl>
    ${
      formUrl
        ? `<p class="hint">Last step: Microsoft Forms opens with your answers already filled in. Sign in with your Xebia account and press <strong>Submit</strong>. Nothing is ordered until you do.</p>
        <div class="actions"><a class="btn btn-primary btn-wide" href="${esc(formUrl)}" target="_blank" rel="noopener">Confirm in Microsoft Forms ↗</a></div>`
        : `<p class="hint warn">The order form isn't connected yet${FORM_URL ? '' : ' (FORM_URL is empty in src/config.ts)'}. Check back soon!</p>`
    }
    <div class="actions split">
      <a class="link" href="#/details">← Edit details</a>
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
