import { describe, expect, it } from 'vitest'
import { type FormConfig, buildFormUrl } from './formLink.ts'

const config: FormConfig = {
  url: 'https://forms.office.com/Pages/ResponsePage.aspx?id=ABC',
  fields: { type: 'r1', choice: 'r2', serviceLine: 'r3', location: 'r4' },
  typeLabels: { donate: 'Donation', present: 'Present' },
  noDeliveryLabel: 'n/a',
}

const params = (url: string | null) => new URL(url!).searchParams

describe('buildFormUrl', () => {
  it('pre-fills a present and keeps the form id', () => {
    const p = params(
      buildFormUrl(config, { serviceLine: 'Xebia Data', location: 'Hilversum' }, { kind: 'present', id: 'weldam-wijn-2' }),
    )
    expect(p.get('id')).toBe('ABC')
    expect(p.get('r1')).toBe('"Present"')
    expect(p.get('r2')).toBe('Weldam Wijn – Red & white duo')
    expect(p.get('r3')).toBe('"Xebia Data"')
    expect(p.get('r4')).toBe('"Hilversum"')
  })

  it('uses the no-delivery label for donations', () => {
    const p = params(
      buildFormUrl(config, { serviceLine: 'Xebia Cloud', location: 'Eindhoven' }, { kind: 'donate', id: 'free-a-girl' }),
    )
    expect(p.get('r1')).toBe('"Donation"')
    expect(p.get('r2')).toBe('Donation to Free a Girl')
    expect(p.get('r4')).toBe('"n/a"')
  })

  it('encodes special characters and refuses invalid picks', () => {
    const url = buildFormUrl(config, { serviceLine: 'A & B', location: '' }, { kind: 'donate', id: 'free-a-girl' })
    expect(url).toContain('r3=%22A%20%26%20B%22')
    expect(url).not.toContain('+')
    expect(buildFormUrl(config, { serviceLine: '', location: '' }, null)).toBeNull()
  })
})
