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

  /** Replaces the day's step count. */
  setSteps: async ({ date, steps }: { date: DateKey; steps: number }): Promise<DailyActivity> => {
    // shortcut: edits the in-memory mock (lost on reload); the API will own this.
    let day = onDate(ACTIVITY, date)
    if (!day) {
      day = { date, steps: 0, stepsTarget: ACTIVITY.at(-1)?.stepsTarget ?? 10000, cardioMinutes: null }
      ACTIVITY.push(day)
    }
    day.steps = steps
    return mockRequest(day)
  },
}
