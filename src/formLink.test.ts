import { describe, expect, it } from 'vitest'
import { charities, suppliers } from './catalog.ts'
import { FORM_FIELDS, FORM_TYPE_LABELS, FORM_URL, NO_DELIVERY_LABEL } from './config.ts'
import { type FormConfig, buildFormUrl } from './formLink.ts'
import type { Pick } from './pick.ts'

const config: FormConfig = {
  url: 'https://forms.office.com/Pages/ResponsePage.aspx?id=ABC',
  fields: { type: 'r1', choice: 'r2', location: 'r4' },
  typeLabels: { donate: 'Donation', present: 'Present' },
  noDeliveryLabel: 'n/a',
}

const params = (url: string | null) => new URL(url!).searchParams

describe('buildFormUrl', () => {
  it('pre-fills a present by its Dutch name and keeps the form id', () => {
    const p = params(buildFormUrl(config, { location: 'Hilversum' }, { kind: 'present', id: 'gastrovino-alcohol-free' }))
    expect(p.get('id')).toBe('ABC')
    expect(p.get('r1')).toBe('"Present"')
    expect(p.get('r2')).toBe('Gastrovino Mijn Hemel – Franc Lizêr – Rosso 0% en Bianco 0%')
    expect(p.get('r4')).toBe('"Hilversum"')
    expect([...p.keys()]).toEqual(['id', 'r1', 'r2', 'r4'])
  })

  it('uses the no-delivery label for donations', () => {
    const p = params(buildFormUrl(config, { location: 'Eindhoven' }, { kind: 'donate', id: 'het-vergeten-kind' }))
    expect(p.get('r1')).toBe('"Donation"')
    expect(p.get('r2')).toBe('Donation to Het Vergeten Kind')
    expect(p.get('r4')).toBe('"n/a"')
  })

  it('names an adopted animal in Dutch and drops off its pack', () => {
    const p = params(buildFormUrl(config, { location: 'Oostenburg' }, { kind: 'donate', id: 'wwf-orangutan' }))
    expect(p.get('r1')).toBe('"Donation"')
    expect(p.get('r2')).toBe('WWF – Adopteer een orang-oetan')
    expect(p.get('r4')).toBe('"Oostenburg"')
  })

  it('encodes special characters and refuses invalid picks', () => {
    const url = buildFormUrl(config, { location: 'A & B' }, { kind: 'present', id: 'de-magistraat-beer-box-extras' })
    expect(url).toContain('r4=%22A%20%26%20B%22')
    expect(url).toContain("r2=De%20Magistraat%20%E2%80%93%20Bierpakket%20met%20extra's")
    expect(url).not.toContain('+')
    expect(buildFormUrl(config, { location: '' }, null)).toBeNull()
  })
})

// Orders are fulfilled from the Form's responses, so every pick must arrive
// there as an answer that names exactly one thing.
describe('every pick in the catalogue, through the real Form config', () => {
  const real: FormConfig = { url: FORM_URL, fields: FORM_FIELDS, typeLabels: FORM_TYPE_LABELS, noDeliveryLabel: NO_DELIVERY_LABEL }
  const picks: Pick[] = [
    ...suppliers.flatMap((s) => s.packages.map((p) => ({ kind: 'present' as const, id: p.id }))),
    // a charity with animals is adopted from, not donated to directly
    ...charities.flatMap((c) => (c.animals ?? [c]).map((a) => ({ kind: 'donate' as const, id: a.id }))),
  ]
  const answers = picks.map((pick) => {
    const url = buildFormUrl(real, { location: 'Hilversum' }, pick)
    return url ? params(url).get(FORM_FIELDS.choice) : null
  })

  it('gets a Form link with an answer for each', () => {
    expect(picks.filter((_, i) => !answers[i])).toEqual([])
  })

  it('names each pick differently', () => {
    expect(new Set(answers).size).toBe(picks.length)
  })

  it('names each pick differently to someone reading the responses', () => {
    // ignoring case, how accents are encoded, dash and quote styles and spacing
    const loose = (s: string) =>
      s.normalize('NFKC').toLowerCase().replace(/[\u2010-\u2015\u2212]/g, '-').replace(/[\u2018\u2019`\u00b4]/g, "'").replace(/\s+/g, ' ').trim()
    expect(new Set(answers.map((a) => loose(a!))).size).toBe(picks.length)
  })

  it('writes every answer cleanly', () => {
    for (const a of answers) {
      expect(a, a!).toBe(a!.normalize('NFC'))
      expect(a, a!).toBe(a!.trim())
      expect(a, a!).not.toMatch(/\s{2}/)
    }
  })
})
