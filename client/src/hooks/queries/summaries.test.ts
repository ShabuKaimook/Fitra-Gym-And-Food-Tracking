// Run with: bun test
import { expect, test } from 'bun:test'
import { summarizeCalories } from './useCalories'
import { sumMacros } from './useMacros'
import { sumMicronutrients } from './useMicronutrients'

test('calories: totals over the range, each day by date, null when nothing logged', () => {
  const s = summarizeCalories([
    { date: '2026-11-16', eaten: 2000, target: 2200 },
    { date: '2026-11-17', eaten: 1500, target: 2200 },
  ])
  expect(s.total).toEqual({ eaten: 3500, target: 4400 })
  expect(s.byDay.get('2026-11-17')?.eaten).toBe(1500)
  expect(summarizeCalories([]).total).toBeNull()
})

test('macros: each macro adds up; null when no days', () => {
  const day = (date: string, p: number) => ({
    date,
    protein: { grams: p, target: 150 },
    carbs: { grams: 100, target: 250 },
    fat: { grams: 50, target: 75 },
  })
  expect(sumMacros([day('2026-11-16', 100), day('2026-11-17', 40)])?.protein).toEqual({ grams: 140, target: 300 })
  expect(sumMacros([])).toBeNull()
})

test('micronutrients: values add up, untracked days are skipped, never-tracked stays null', () => {
  const item = (name: string, value: number | null) => ({ name, unit: 'g', value, target: 10 })
  const totals = sumMicronutrients([
    { date: '2026-11-16', items: [item('Fiber', 8), item('Vitamin D', null)] },
    { date: '2026-11-17', items: [item('Fiber', null), item('Vitamin D', null)] },
    { date: '2026-11-18', items: [item('Fiber', 5), item('Vitamin D', null)] },
  ])
  expect(totals).toEqual([
    { name: 'Fiber', unit: 'g', value: 13, target: 30 },
    { name: 'Vitamin D', unit: 'g', value: null, target: 30 },
  ])
})
