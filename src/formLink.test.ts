import { describe, expect, it } from 'vitest'
import { type FormConfig, buildFormUrl } from './formLink.ts'

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
