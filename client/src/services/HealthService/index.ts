import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'
import { mockRequest, onDate } from '@/utils/mockRequest'
import { ACTIVITY, ENERGY, NOTES, RECOVERY, SLEEP, WAIST, WEIGHT } from '../mockData'
import type { DailyActivity, DailyNote, DailyScore, DailySleep, DailyWaist, DailyWeight } from './types/Health'

// shortcut: edits the in-memory mock (lost on reload); the API will own this.
const upsert = <T extends { date: DateKey }>(rows: T[], row: T) => {
  const i = rows.findIndex((r) => r.date === row.date)
  if (i === -1) rows.push(row)
  else rows[i] = row
  return mockRequest(row)
}

// null = nothing recorded that day.
export const HealthService = {
  getSleep: async (date: DateKey, options?: RequestOptions): Promise<DailySleep | null> =>
    mockRequest(onDate(SLEEP, date), options),

  getWeight: async (date: DateKey, options?: RequestOptions): Promise<DailyWeight | null> =>
    mockRequest(onDate(WEIGHT, date), options),

  getWaist: async (date: DateKey, options?: RequestOptions): Promise<DailyWaist | null> =>
    mockRequest(onDate(WAIST, date), options),

  getEnergy: async (date: DateKey, options?: RequestOptions): Promise<DailyScore | null> =>
    mockRequest(onDate(ENERGY, date), options),

  getRecovery: async (date: DateKey, options?: RequestOptions): Promise<DailyScore | null> =>
    mockRequest(onDate(RECOVERY, date), options),

  getNote: async (date: DateKey, options?: RequestOptions): Promise<DailyNote | null> =>
    mockRequest(onDate(NOTES, date), options),

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

  /** Replaces the night's sleep and its quality. */
  setSleep: async ({
    date,
    minutes,
    quality,
  }: {
    date: DateKey
    minutes: number
    quality: number
  }): Promise<DailySleep> => {
    // shortcut: edits the in-memory mock (lost on reload); the API will own this.
    let day = onDate(SLEEP, date)
    if (!day) {
      day = { date, minutes: 0, target: SLEEP.at(-1)?.target ?? 480, quality: null }
      SLEEP.push(day)
    }
    Object.assign(day, { minutes, quality })
    return mockRequest(day)
  },

  /** Replaces the day's waist measurement. */
  setWaist: async (waist: DailyWaist): Promise<DailyWaist> => upsert(WAIST, waist),

  /** Replaces the day's energy score (1–10). */
  setEnergy: async (energy: DailyScore): Promise<DailyScore> => upsert(ENERGY, energy),

  /** Replaces the day's recovery score (1–10). */
  setRecovery: async (recovery: DailyScore): Promise<DailyScore> => upsert(RECOVERY, recovery),

  /** Replaces the day's note. */
  setNote: async (note: DailyNote): Promise<DailyNote> => upsert(NOTES, note),
}
