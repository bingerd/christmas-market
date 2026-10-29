import { describe, expect, it } from 'vitest'
import { label, needsDelivery, resolve, sanitize } from './pick.ts'

describe('pick', () => {
  it('resolves presents and donations', () => {
    const present = resolve({ kind: 'present', id: 'olala-chocola-workshop' })
    expect(present && label(present)).toBe('Olala Chocola – Bonbon workshop')
    const donation = resolve({ kind: 'donate', id: 'wwf' })
    expect(donation && label(donation)).toBe('Donation to WWF')
  })

  it('rejects unknown or mismatched ids', () => {
    expect(resolve({ kind: 'present', id: 'nope' })).toBeNull()
    expect(resolve({ kind: 'donate', id: 'olala-chocola-workshop' })).toBeNull()
    expect(resolve(null)).toBeNull()
  })

  it('only presents need a drop-off location', () => {
    expect(needsDelivery({ kind: 'present', id: 'balthazar-pasta-machine' })).toBe(true)
    expect(needsDelivery({ kind: 'donate', id: 'wwf' })).toBe(false)
    expect(needsDelivery(null)).toBe(false)
  })

  it('sanitizes stored data', () => {
    expect(sanitize(null)).toBeNull()
    expect(sanitize({ kind: 'present', id: 'gone' })).toBeNull()
    expect(sanitize({ kind: 'steal', id: 'balthazar-pasta-machine' })).toBeNull()
    expect(sanitize({ kind: 'donate', id: 'het-vergeten-kind', extra: 1 })).toEqual({ kind: 'donate', id: 'het-vergeten-kind' })
  })
})
