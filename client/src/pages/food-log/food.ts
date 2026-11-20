import { MEALS } from '@/constants/meals'
import type { Food, Meal, Nutrients } from '@/services/FoodService/types/Food'

export const mealLabel = (meal: Meal) => MEALS.find((m) => m.value === meal)!.label

// ?meal= from the URL; missing or unknown → guess from the time of day.
export const parseMeal = (param: string | null, hour = new Date().getHours()): Meal =>
  MEALS.find((m) => m.value === param)?.value ??
  (hour < 11 ? 'breakfast' : hour < 15 ? 'lunch' : hour < 21 ? 'dinner' : 'snacks')

/** 'base' = the food's own unit (g or ml); 'serving' = its named portion. */
export type AmountUnit = 'base' | 'serving'

export const unitName = (unit: Food['unit']) => (unit === 'g' ? 'grams (g)' : 'millilitres (ml)')

export const amountUnits = (food: Food) => [
  { value: 'base' as const, label: unitName(food.unit) },
  ...(food.serving
    ? [{ value: 'serving' as const, label: `${food.serving.name} (${food.serving.size} ${food.unit})` }]
    : []),
]

// One serving if the food has one, otherwise its basis amount (e.g. 100 g).
export const defaultAmount = (food: Food): { amount: number; unit: AmountUnit } =>
  food.serving ? { amount: 1, unit: 'serving' } : { amount: food.per, unit: 'base' }

/** The amount in the food's own unit (g or ml). */
export const toBase = (food: Food, amount: number, unit: AmountUnit) =>
  unit === 'serving' && food.serving ? amount * food.serving.size : amount

const round = (n: number, step: number) => Math.round(n / step) * step
const scale = (v: number | null, f: number, step: number) => (v === null ? null : round(v * f, step))

/** Nutrients for `base` g/ml of the food. Missing stays missing (null), never 0. */
export const nutrientsFor = (food: Food, base: number): Nutrients => {
  const f = base / food.per
  const n = food.nutrients
  return {
    calories: Math.round(n.calories * f),
    protein: scale(n.protein, f, 0.1),
    carbs: scale(n.carbs, f, 0.1),
    fat: scale(n.fat, f, 0.1),
    fiber: scale(n.fiber, f, 0.1),
    sodium: scale(n.sodium, f, 1),
  }
}

// The amount the food's nutrients are for ("350 g", "100 g"), not the serving: an egg is 50 g but listed per 100 g.
export const basisText = (food: Food) => `${food.per} ${food.unit}`

// Trims float noise (0.30000000000000004 → 0.3) for display.
export const fmt = (n: number) => String(Number(n.toFixed(1)))
