import { MICROS } from '@/constants/nutrients'
import type { Food, Meal, Nutrients, Unit, UnitId } from '@/services/FoodService/types/Food'

// Record<Meal, …> so a new meal in the type fails to compile here until it's added.
const MEAL_IDS: Record<Meal, true> = { breakfast: true, lunch: true, dinner: true, snacks: true }

// ?meal= from the URL; missing or unknown → guess from the time of day.
export const parseMeal = (param: string | null, hour = new Date().getHours()): Meal =>
  param !== null && Object.hasOwn(MEAL_IDS, param)
    ? (param as Meal)
    : hour < 11
      ? 'breakfast'
      : hour < 15
        ? 'lunch'
        : hour < 21
          ? 'dinner'
          : 'snacks'

/** Any unit can be picked for any food; see toBase for how it converts. */
export type AmountUnit = UnitId

const unitOf = (units: Unit[] | undefined, id: UnitId) => units?.find((u) => u.id === id)

// Exact for the food's own unit and serving; anything else goes through each unit's typical size.
const isExact = (food: Food, unit: UnitId) => unit === food.unit || unit === food.serving?.unit

/** The amount in the food's own unit. */
export const toBase = (food: Food, amount: number, unit: AmountUnit, units?: Unit[]) => {
  if (unit === food.unit) return amount
  if (unit === food.serving?.unit) return amount * food.serving.size
  // shortcut: treats 1 ml as 1 g and uses one typical size per unit (a cup ≈ 240), fine for logging, not for lab-grade.
  return (amount * (unitOf(units, unit)?.size ?? 1)) / (unitOf(units, food.unit)?.size ?? 1)
}

type UnitOption = { value: UnitId; label: string; hint?: string }

// The food's own units first (exact sizes), then every other unit with its estimated size as the hint.
// Labels fall back to ids ("plate") until useUnits() loads.
export const amountUnits = (food: Food, units: Unit[] | undefined): { own: UnitOption[]; other: UnitOption[] } => {
  const label = (id: UnitId) => unitOf(units, id)?.label ?? id
  const grams = food.unit === 'ml' ? 'ml' : 'g'
  return {
    own: [
      { value: food.unit, label: label(food.unit) },
      ...(food.serving
        ? [{ value: food.serving.unit, label: label(food.serving.unit), hint: `${food.serving.size} ${food.unit}` }]
        : []),
    ],
    other: (units ?? [])
      .filter((u) => !isExact(food, u.id))
      .map((u) => ({ value: u.id, label: u.label, hint: u.kind === 'base' ? undefined : `≈${u.size} ${grams}` })),
  }
}

// One serving if the food has one, otherwise its basis amount (e.g. 100 g).
export const defaultAmount = (food: Food): { amount: number; unit: AmountUnit } =>
  food.serving ? { amount: 1, unit: food.serving.unit } : { amount: food.per, unit: food.unit }

const round = (n: number, step: number) => Math.round(n / step) * step
const scale = (v: number | null, f: number, step: number) => (v === null ? null : round(v * f, step))

/** Nutrients for `base` of the food's own unit. Missing stays missing (null), never 0. */
export const nutrientsFor = (food: Food, base: number): Nutrients => {
  const f = base / food.per
  const n = food.nutrients
  return {
    calories: Math.round(n.calories * f),
    protein: scale(n.protein, f, 0.1),
    carbs: scale(n.carbs, f, 0.1),
    fat: scale(n.fat, f, 0.1),
    // Only the micros the food lists, so "not entered" stays distinguishable from "entered as unknown".
    ...Object.fromEntries(
      MICROS.filter(({ key }) => n[key] !== undefined).map(({ key }) => [key, scale(n[key] ?? null, f, 0.1)]),
    ),
  }
}

// The amount the food's nutrients are for ("350 g", "100 g"), not the serving: an egg is 50 g but listed per 100 g.
export const basisText = (food: Food) => `${food.per} ${food.unit}`

// Trims float noise (0.30000000000000004 → 0.3) for display.
export const fmt = (n: number) => String(Number(n.toFixed(1)))
