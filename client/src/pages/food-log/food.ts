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

// "1 plate", "2 plates" (shortcut: English plural by adding s), "170 g".
export const amountText = (food: Food, amount: number, unit: AmountUnit) =>
  unit === 'serving' && food.serving
    ? `${amount} ${food.serving.name}${amount === 1 ? '' : 's'}`
    : `${amount} ${food.unit}`

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

export const hasMissingData = (food: Food) => Object.values(food.nutrients).some((v) => v === null)

// "Generic, per plate (350 g)", "7-Eleven, per 100 g, some data missing".
export const describeFood = (food: Food) =>
  [
    food.brand ?? 'Generic',
    food.serving ? `per ${food.serving.name} (${food.serving.size} ${food.unit})` : `per ${food.per} ${food.unit}`,
    hasMissingData(food) && 'some data missing',
  ]
    .filter(Boolean)
    .join(', ')

// "32 / 70 / 24" for the food's basis; "no data" if any of the three is missing.
export const macroLine = ({ nutrients: { protein, carbs, fat } }: Food) =>
  protein === null || carbs === null || fat === null ? 'no data' : `${protein} / ${carbs} / ${fat}`

// Trims float noise (0.30000000000000004 → 0.3) for display.
export const fmt = (n: number) => String(Number(n.toFixed(1)))
