import { describe, expect, test } from 'bun:test'
import { lastBefore } from './mockRequest'

describe('lastBefore', () => {
  // Out of order on purpose: the latest earlier date must win, not the last row.
  const rows = [
    { date: '2026-11-18', kg: 72.1 },
    { date: '2026-11-10', kg: 73 },
    { date: '2026-11-16', kg: 72.4 },
  ]

  test('latest row strictly before the date', () => {
    expect(lastBefore(rows, '2026-11-20')?.kg).toBe(72.1)
    expect(lastBefore(rows, '2026-11-18')?.kg).toBe(72.4)
  })

  test('null when nothing is earlier', () => {
    expect(lastBefore(rows, '2026-11-10')).toBeNull()
    expect(lastBefore([], '2026-11-20')).toBeNull()
  })
})
