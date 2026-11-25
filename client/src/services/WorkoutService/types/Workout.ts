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

/** One training day of a split: its name ("Upper") and exercises, in order. */
export type SplitDay = { name: string; exerciseIds: string[] }

/** A weekly split. days: Mon … Sun, null = a rest day. */
export type Split = { id: string; name: string; kind: 'custom' | 'builtin'; days: (SplitDay | null)[] }

/** The plan's own copy of its split's days, used from `fromWeek` on (until a later entry). */
export type PlanScheduleEntry = { fromWeek: number; days: (SplitDay | null)[] }

/** A training plan: a split run for a number of weeks. `split` is the split's name as shown;
 * `schedule` is the plan's own copy of the split, so editing the split changes a plan only when asked. */
export type TrainingPlan = {
  id: string
  name: string
  splitId: string
  split: string
  status: 'active' | 'upcoming' | 'finished'
  weeks: number
  currentWeek: number
  schedule: PlanScheduleEntry[]
}

// Muscles and equipment are lists the backend owns (getExerciseOptions), so any string it sends.
export type Muscle = string
export type Equipment = string
/** Smaller muscle groups an exercise also works, e.g. a row's biceps and rear delts. */
export type SecondaryMuscle = string

/** What a set of it records. */
export type RecordType = 'weight-reps' | 'reps' | 'time'
/** level = a machine's pin number, for stacks without kg or lb. */
export type WeightUnit = 'kg' | 'lb' | 'level'

/** The choices for an exercise, in display order: the picker's filters (1f) and the new exercise form (1n).
 * Record types and weight units keep fixed values because the app treats each one differently. */
export type ExerciseOptions = {
  muscles: Muscle[]
  equipment: Equipment[]
  secondaryMuscles: SecondaryMuscle[]
  recordTypes: { value: RecordType; label: string }[]
  weightUnits: { value: WeightUnit; label: string }[]
}

/** An exercise in the library. weightUnit is set only when it records weight; photo is a URL. */
export type Exercise = {
  id: string
  name: string
  muscle: Muscle
  secondary: SecondaryMuscle[]
  equipment: Equipment
  record: RecordType
  weightUnit: WeightUnit | null
  howTo: string
  photo?: string
  favourite: boolean
  /** Made by the user (1n), not part of the built-in library. */
  custom: boolean
}

export type WorkoutTemplate = { id: string; name: string }

/** A finished workout. */
export type WorkoutSession = { date: DateKey; name: string }
