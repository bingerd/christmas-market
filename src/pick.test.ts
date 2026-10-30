import { describe, expect, it } from 'vitest'
import { formLabel, label, needsDelivery, resolve, sanitize } from './pick.ts'

describe('pick', () => {
  it('resolves presents and donations', () => {
    const present = resolve({ kind: 'present', id: 'olala-chocola-workshop' })
    expect(present && label(present)).toBe('Olala Chocola – Bonbon workshop')
    const donation = resolve({ kind: 'donate', id: 'het-vergeten-kind' })
    expect(donation && label(donation)).toBe('Donation to Het Vergeten Kind')
    const adoption = resolve({ kind: 'donate', id: 'wwf-polar-bear' })
    expect(adoption && label(adoption)).toBe('WWF – Adopt a polar bear')
  })

  it('names picks in Dutch for the Form', () => {
    const present = resolve({ kind: 'present', id: 'olala-chocola-workshop' })
    expect(present && formLabel(present)).toBe('Olala Chocola – Workshop bonbons maken')
    const adoption = resolve({ kind: 'donate', id: 'wwf-polar-bear' })
    expect(adoption && formLabel(adoption)).toBe('WWF – Adopteer een ijsbeer')
  })

  it('rejects unknown or mismatched ids', () => {
    expect(resolve({ kind: 'present', id: 'nope' })).toBeNull()
    expect(resolve({ kind: 'donate', id: 'olala-chocola-workshop' })).toBeNull()
    expect(resolve({ kind: 'present', id: 'wwf-tiger' })).toBeNull()
    expect(resolve(null)).toBeNull()
  })

  it('only takes an animal at a charity that has them', () => {
    expect(resolve({ kind: 'donate', id: 'wwf' })).toBeNull()
  })

  it('only presents and adoptions need a drop-off location', () => {
    expect(needsDelivery({ kind: 'present', id: 'balthazar-pasta-machine' })).toBe(true)
    expect(needsDelivery({ kind: 'donate', id: 'wwf-tiger' })).toBe(true)
    expect(needsDelivery({ kind: 'donate', id: 'het-vergeten-kind' })).toBe(false)
    expect(needsDelivery(null)).toBe(false)
  })

  it('sanitizes stored data', () => {
    expect(sanitize(null)).toBeNull()
    expect(sanitize({ kind: 'present', id: 'gone' })).toBeNull()
    expect(sanitize({ kind: 'steal', id: 'balthazar-pasta-machine' })).toBeNull()
    expect(sanitize({ kind: 'donate', id: 'het-vergeten-kind', extra: 1 })).toEqual({ kind: 'donate', id: 'het-vergeten-kind' })
  })
})
