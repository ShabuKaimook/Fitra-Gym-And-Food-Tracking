import type { DateKey } from '@/utils/date'

/** One day's calories. A day with nothing logged has no record at all. */
export type DailyCalories = { date: DateKey; eaten: number; target: number }

export type MacroAmount = { grams: number; target: number }
export type DailyMacros = { date: DateKey; protein: MacroAmount; carbs: MacroAmount; fat: MacroAmount }

/** value null = not tracked that day (shown as "No data", never 0). */
export type Micronutrient = { name: string; unit: string; value: number | null; target: number }
export type DailyMicronutrients = { date: DateKey; items: Micronutrient[] }

export type DailyWater = { date: DateKey; liters: number; target: number }
