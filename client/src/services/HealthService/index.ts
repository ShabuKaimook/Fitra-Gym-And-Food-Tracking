import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'
import { mockRequest, onDate } from '@/utils/mockRequest'
import { ACTIVITY, SLEEP, WEIGHT } from '../mockData'
import type { DailyActivity, DailySleep, DailyWeight } from './types/Health'

// null = nothing recorded that day.
export const HealthService = {
  getSleep: async (date: DateKey, options?: RequestOptions): Promise<DailySleep | null> =>
    mockRequest(onDate(SLEEP, date), options),

  getWeight: async (date: DateKey, options?: RequestOptions): Promise<DailyWeight | null> =>
    mockRequest(onDate(WEIGHT, date), options),

  getActivity: async (date: DateKey, options?: RequestOptions): Promise<DailyActivity | null> =>
    mockRequest(onDate(ACTIVITY, date), options),
}
