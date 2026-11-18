// Run with: bun test
import { expect, test } from 'bun:test'
import { parseDateParam } from './useSelectedDate'

const today = new Date(2026, 10, 18) // 18 Nov 2026

test('valid past date is used', () => {
  expect(parseDateParam('2026-11-17', today)).toEqual(new Date(2026, 10, 17))
})

test('missing, malformed, impossible or future dates fall back to today', () => {
  for (const p of [null, '', 'yesterday', '2026-1-5', '2026-02-30', '2026-11-19']) {
    expect(parseDateParam(p, today)).toBe(today)
  }
})
