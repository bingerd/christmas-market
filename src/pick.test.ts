import { describe, expect, it } from 'vitest'
import { label, needsDelivery, resolve, sanitize } from './pick.ts'

describe('pick', () => {
  it('resolves presents and donations', () => {
    const present = resolve({ kind: 'present', id: 'olala-chocola-1' })
    expect(present && label(present)).toBe('Olala Chocola – Bar of joy')
    const donation = resolve({ kind: 'donate', id: 'free-a-girl' })
    expect(donation && label(donation)).toBe('Donation to Free a Girl')
  })

  it('rejects unknown or mismatched ids', () => {
    expect(resolve({ kind: 'present', id: 'nope' })).toBeNull()
    expect(resolve({ kind: 'donate', id: 'olala-chocola-1' })).toBeNull()
    expect(resolve(null)).toBeNull()
  })

  it('only presents need a drop-off location', () => {
    expect(needsDelivery({ kind: 'present', id: 'oldenhof-1' })).toBe(true)
    expect(needsDelivery({ kind: 'donate', id: 'free-a-girl' })).toBe(false)
    expect(needsDelivery(null)).toBe(false)
  })

  it('sanitizes stored data', () => {
    expect(sanitize(null)).toBeNull()
    expect(sanitize({ kind: 'present', id: 'gone' })).toBeNull()
    expect(sanitize({ kind: 'steal', id: 'oldenhof-1' })).toBeNull()
    expect(sanitize({ kind: 'donate', id: 'leger-des-heils', extra: 1 })).toEqual({ kind: 'donate', id: 'leger-des-heils' })
  })
})
