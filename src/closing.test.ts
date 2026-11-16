import { describe, expect, it } from 'vitest'
import { formatTimeLeft, timeLeft } from './closing.ts'

const closes = new Date('2026-11-18T00:00:00+01:00')

describe('closing', () => {
  it('counts down to closing time', () => {
    const left = timeLeft(new Date('2026-11-16T18:55:57+01:00'), closes)
    expect(left).toEqual({ days: 1, hours: 5, minutes: 4, seconds: 3 })
    expect(left && formatTimeLeft(left)).toBe('1d 05:04:03')
  })

  it('drops the days on the last day', () => {
    const left = timeLeft(new Date('2026-11-17T23:59:30+01:00'), closes)
    expect(left && formatTimeLeft(left)).toBe('00:00:30')
  })

  it('is closed at and after closing time', () => {
    expect(timeLeft(closes, closes)).toBeNull()
    expect(timeLeft(new Date('2026-11-19T00:00:00+01:00'), closes)).toBeNull()
  })
})
