import { describe, expect, test } from 'bun:test'
import { dayLabel } from './split'

describe('dayLabel', () => {
  const day = (name: string) => ({ name, exerciseIds: [] })
  // Mon Upper, Tue rest, Wed unnamed, Thu "  " (spaces only), Fri Lower
  const days = [day('Upper'), null, day(''), day('  '), day('Lower'), null, null]

  test('uses the name when there is one', () => {
    expect(dayLabel(days, 0)).toBe('Upper')
    expect(dayLabel(days, 4)).toBe('Lower')
  })

  test('unnamed days are numbered by training day, skipping rest days', () => {
    expect(dayLabel(days, 2)).toBe('Day 2')
    expect(dayLabel(days, 3)).toBe('Day 3')
  })
})
