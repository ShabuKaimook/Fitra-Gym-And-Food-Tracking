import type { DateKey } from '@/utils/date'

/** quality: 1–10, null = not rated. */
export type DailySleep = { date: DateKey; minutes: number; target: number; quality: number | null }
export type DailyWeight = { date: DateKey; kg: number }
export type DailyWaist = { date: DateKey; cm: number }
/** A 1–10 rating of the day, e.g. energy or recovery. */
export type DailyScore = { date: DateKey; score: number }
export type DailyNote = { date: DateKey; text: string }
export type DailyActivity = { date: DateKey; steps: number; stepsTarget: number; cardioMinutes: number | null }
