import type { DateKey } from '@/utils/date'

/** One exercise of a planned workout. reps is a range as written, e.g. '8–12'. */
export type PlannedExercise = { name: string; sets: number; reps: string; restSeconds: number }

/** planDay: where it sits in the active plan ("week 3 day 1"); null = not from a plan. */
export type PlannedWorkout = {
  date: DateKey
  name: string
  minutes: number
  exercises: PlannedExercise[]
  planDay: { week: number; day: number } | null
}

/** A training plan: a split run for a number of weeks. */
export type TrainingPlan = { id: string; name: string; split: string; weeks: number; currentWeek: number }

/** A weekly split. days: Mon … Sun, true = a training day. */
export type Split = { id: string; name: string; kind: 'custom' | 'builtin'; days: boolean[] }

export type WorkoutTemplate = { id: string; name: string }

/** A finished workout. */
export type WorkoutSession = { date: DateKey; name: string }
