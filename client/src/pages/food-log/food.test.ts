import type { Food, Unit } from '@/services/FoodService/types/Food'
import { expect, test } from 'bun:test'
import { basisText, nutrientsFor, parseMeal, toBase } from './food'

const rice: Food = {
  id: 'rice',
  name: 'Steamed rice',
  brand: null,
  unit: 'g',
  per: 100,
  serving: { unit: 'bowl', size: 150 },
  nutrients: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: null },
}

test('nutrientsFor scales from the basis, rounds, and keeps missing as null', () => {
  const n = nutrientsFor(rice, 170)
  expect(n.calories).toBe(221)
  expect(n.protein).toBeCloseTo(4.6)
  expect(n.carbs).toBeCloseTo(47.6)
  expect(n.fat).toBeCloseTo(0.5)
  expect(n.sodium).toBeNull()
  // Micros the food doesn't list stay absent, not null.
  expect('zinc' in n).toBe(false)
})

test('servings convert to the base unit', () => {
  expect(toBase(rice, 2, 'bowl')).toBe(300)
  expect(toBase(rice, 170, 'g')).toBe(170)
})

test('other units convert through their typical size', () => {
  const units = [
    { id: 'g', label: 'Grams (g)', kind: 'base', size: 1 },
    { id: 'cup', label: 'Cup', kind: 'portion', size: 240 },
    { id: 'plate', label: 'Plate', kind: 'portion', size: 350 },
  ] as const satisfies Unit[]
  expect(toBase(rice, 1, 'cup', [...units])).toBe(240)
  // A food listed per plate, logged in grams.
  expect(toBase({ ...rice, unit: 'plate', per: 1, serving: null }, 700, 'g', [...units])).toBe(2)
})

test('basisText is the amount the nutrients are for, not the serving', () => {
  expect(basisText(rice)).toBe('100 g')
})

test('parseMeal falls back to the time of day', () => {
  expect(parseMeal('dinner', 8)).toBe('dinner')
  expect(parseMeal('nope', 8)).toBe('breakfast')
  expect(parseMeal(null, 13)).toBe('lunch')
  expect(parseMeal(null, 22)).toBe('snacks')
  expect(parseMeal('toString', 8)).toBe('breakfast')
})
