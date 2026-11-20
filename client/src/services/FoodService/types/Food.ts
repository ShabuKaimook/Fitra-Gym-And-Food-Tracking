import type { DateKey } from '@/utils/date'

/** One day's calories. A day with nothing logged has no record at all. */
export type DailyCalories = { date: DateKey; eaten: number; target: number }

export type MacroAmount = { grams: number; target: number }
export type DailyMacros = { date: DateKey; protein: MacroAmount; carbs: MacroAmount; fat: MacroAmount }

/** value null = not tracked that day (shown as "No data", never 0). */
export type Micronutrient = { name: string; unit: string; value: number | null; target: number }
export type DailyMicronutrients = { date: DateKey; items: Micronutrient[] }

export type DailyWater = { date: DateKey; liters: number; target: number }

export type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

/** Grams for protein, carbs, fat and fiber; mg for sodium. null = no data, never counted as 0. */
export type Nutrients = {
  calories: number
  protein: number | null
  carbs: number | null
  fat: number | null
  fiber: number | null
  sodium: number | null
}

/** A food in the database. `nutrients` are for `per` of `unit` (e.g. per 100 g). */
export type Food = {
  id: string
  name: string
  /** null = generic. */
  brand: string | null
  unit: 'g' | 'ml'
  per: number
  /** A named portion, e.g. one plate = 350 g. */
  serving: { name: string; size: number } | null
  nutrients: Nutrients
}

/** One logged food, with nutrients already worked out for the amount eaten. `amount` is in `unit`. */
export type FoodEntry = Nutrients & {
  date: DateKey
  meal: Meal
  foodId: string
  name: string
  amount: number
  unit: Food['unit']
}
