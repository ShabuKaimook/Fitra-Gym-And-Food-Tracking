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
export type MealOption = { id: Meal; label: string }

/** Weight and volume. */
export type BaseUnit = 'g' | 'ml'
/** A named amount; as a serving its size is set per food (a plate of rice ≠ a plate of salad). */
export type PortionUnit =
  | 'serving'
  | 'bowl'
  | 'can'
  | 'piece'
  | 'plate'
  | 'slice'
  | 'teaspoon'
  | 'tablespoon'
  | 'pack'
  | 'box'
  | 'bottle'
  | 'cup'
export type UnitId = BaseUnit | PortionUnit
/** `size`: typical g (or ml) in one, used when a food has no size of its own for this unit. */
export type Unit = { id: UnitId; label: string; kind: 'base' | 'portion'; size: number }

export type MicroKey =
  | 'fiber'
  | 'sugar'
  | 'sodium'
  | 'potassium'
  | 'saturatedFat'
  | 'cholesterol'
  | 'calcium'
  | 'iron'
  | 'vitaminC'
  | 'vitaminD'
  | 'magnesium'
  | 'zinc'

/** Macros in grams; micros in the unit MICROS gives them. null or missing = no data, never counted as 0. */
export type Nutrients = {
  calories: number
  protein: number | null
  carbs: number | null
  fat: number | null
} & Partial<Record<MicroKey, number | null>>

/** A food in the database. `nutrients` are for `per` of `unit` (e.g. per 100 g, per 1 plate). */
export type Food = {
  id: string
  name: string
  /** null = generic. */
  brand: string | null
  unit: UnitId
  per: number
  /** A named portion in `unit`, e.g. one plate = 350 g. */
  serving: { unit: PortionUnit; size: number } | null
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
