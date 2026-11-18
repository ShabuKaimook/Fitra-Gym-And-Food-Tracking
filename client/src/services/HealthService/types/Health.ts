import type { DateKey } from '@/utils/date'

export type DailySleep = { date: DateKey; minutes: number; target: number }
export type DailyWeight = { date: DateKey; kg: number }
export type DailyActivity = { date: DateKey; steps: number; stepsTarget: number; cardioMinutes: number | null }
