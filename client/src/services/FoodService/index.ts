import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'
import { MICROS } from '@/constants/nutrients'
import { inRange, mockRequest, onDate } from '@/utils/mockRequest'
import { CALORIES, FOOD_ENTRIES, FOODS, MACROS, MEALS, MICRONUTRIENTS, UNITS, WATER } from '../mockData'
import type {
  DailyCalories,
  DailyMacros,
  DailyMicronutrients,
  DailyWater,
  Food,
  FoodEntry,
  MealOption,
  Unit,
} from './types/Food'

// Range calls return one record per day that has data (from and to inclusive).
export const FoodService = {
  /** Meal groups in day order. */
  getMeals: async (options?: RequestOptions): Promise<MealOption[]> => mockRequest(MEALS, options),

  /** Base units (g, ml) first, then portions. */
  getUnits: async (options?: RequestOptions): Promise<Unit[]> => mockRequest(UNITS, options),

  getCalories: async (from: DateKey, to: DateKey, options?: RequestOptions): Promise<DailyCalories[]> =>
    mockRequest(inRange(CALORIES, from, to), options),

  getMacros: async (from: DateKey, to: DateKey, options?: RequestOptions): Promise<DailyMacros[]> =>
    mockRequest(inRange(MACROS, from, to), options),

  getMicronutrients: async (from: DateKey, to: DateKey, options?: RequestOptions): Promise<DailyMicronutrients[]> =>
    mockRequest(inRange(MICRONUTRIENTS, from, to), options),

  getWater: async (date: DateKey, options?: RequestOptions): Promise<DailyWater | null> =>
    mockRequest(onDate(WATER, date), options),

  addWater: async ({ date, ml }: { date: DateKey; ml: number }): Promise<DailyWater> => {
    // shortcut: edits the in-memory mock (lost on reload); the API will own this.
    let day = onDate(WATER, date)
    if (!day) {
      day = { date, liters: 0, target: WATER.at(-1)?.target ?? 2.5 }
      WATER.push(day)
    }
    day.liters = Math.round((day.liters + ml / 1000) * 100) / 100
    return mockRequest(day)
  },

  /** Replaces the day's water total. */
  setWater: async ({ date, liters }: { date: DateKey; liters: number }): Promise<DailyWater> => {
    // shortcut: edits the in-memory mock (lost on reload); the API will own this.
    let day = onDate(WATER, date)
    if (!day) {
      day = { date, liters: 0, target: WATER.at(-1)?.target ?? 2.5 }
      WATER.push(day)
    }
    day.liters = liters
    return mockRequest(day)
  },

  addFood: async (entry: FoodEntry): Promise<FoodEntry> => {
    // shortcut: edits the in-memory mock (lost on reload) and its daily totals; the API will own this.
    FOOD_ENTRIES.push(entry)
    let cal = onDate(CALORIES, entry.date)
    if (!cal) {
      cal = { date: entry.date, eaten: 0, target: CALORIES.at(-1)?.target ?? 2200 }
      CALORIES.push(cal)
    }
    cal.eaten += entry.calories
    let mac = onDate(MACROS, entry.date)
    if (!mac) {
      const last = MACROS.at(-1)
      const zero = (key: 'protein' | 'carbs' | 'fat') => ({ grams: 0, target: last?.[key].target ?? 0 })
      mac = { date: entry.date, protein: zero('protein'), carbs: zero('carbs'), fat: zero('fat') }
      MACROS.push(mac)
    }
    mac.protein.grams += entry.protein ?? 0
    mac.carbs.grams += entry.carbs ?? 0
    mac.fat.grams += entry.fat ?? 0
    let micro = onDate(MICRONUTRIENTS, entry.date)
    if (!micro) {
      micro = { date: entry.date, items: (MICRONUTRIENTS.at(-1)?.items ?? []).map((m) => ({ ...m, value: null })) }
      MICRONUTRIENTS.push(micro)
    }
    for (const { key, label } of MICROS) {
      const value = entry[key]
      const item = micro.items.find((m) => m.name === label)
      if (item && value != null) item.value = (item.value ?? 0) + value
    }
    return mockRequest(entry)
  },

  /** Foods whose name or brand contains `query` (any case); every food when it's blank. */
  searchFoods: async (query: string, options?: RequestOptions): Promise<Food[]> => {
    const q = query.trim().toLowerCase()
    return mockRequest(
      FOODS.filter((f) => `${f.name} ${f.brand ?? ''}`.toLowerCase().includes(q)),
      options,
    )
  },

  /** Foods logged before, most recent first, each once. */
  getRecentFoods: async (options?: RequestOptions): Promise<Food[]> => {
    const ids = [...new Set(FOOD_ENTRIES.map((e) => e.foodId).reverse())]
    return mockRequest(
      ids.flatMap((id) => FOODS.find((f) => f.id === id) ?? []),
      options,
    )
  },

  getFood: async (id: string, options?: RequestOptions): Promise<Food | null> =>
    mockRequest(FOODS.find((f) => f.id === id) ?? null, options),

  createFood: async (food: Omit<Food, 'id'>): Promise<Food> => {
    // shortcut: in-memory mock (lost on reload); the API will own this.
    const created = { ...food, id: crypto.randomUUID() }
    FOODS.push(created)
    return mockRequest(created)
  },
}
