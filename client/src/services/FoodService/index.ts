import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'
import { inRange, mockRequest, onDate } from '@/utils/mockRequest'
import { CALORIES, MACROS, MICRONUTRIENTS, WATER } from '../mockData'
import type { DailyCalories, DailyMacros, DailyMicronutrients, DailyWater } from './types/Food'

// Range calls return one record per day that has data (from and to inclusive).
export const FoodService = {
  getCalories: async (from: DateKey, to: DateKey, options?: RequestOptions): Promise<DailyCalories[]> =>
    mockRequest(inRange(CALORIES, from, to), options),

  getMacros: async (from: DateKey, to: DateKey, options?: RequestOptions): Promise<DailyMacros[]> =>
    mockRequest(inRange(MACROS, from, to), options),

  getMicronutrients: async (from: DateKey, to: DateKey, options?: RequestOptions): Promise<DailyMicronutrients[]> =>
    mockRequest(inRange(MICRONUTRIENTS, from, to), options),

  getWater: async (date: DateKey, options?: RequestOptions): Promise<DailyWater | null> =>
    mockRequest(onDate(WATER, date), options),
}
