import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'
import { lastBefore, mockRequest, onDate } from '@/utils/mockRequest'
import { EXERCISE_OPTIONS, EXERCISES, PLANS, SESSIONS, SPLITS, TEMPLATES, WORKOUTS } from '../mockData'
import { planScheduleAfter } from './plans'
import type { Exercise, ExerciseOptions, PlannedWorkout, Split, TrainingPlan, WorkoutSession, WorkoutTemplate } from './types/Workout'

export const WorkoutService = {
  /** null = rest day, nothing planned. */
  getPlannedWorkout: async (date: DateKey, options?: RequestOptions): Promise<PlannedWorkout | null> =>
    mockRequest(onDate(WORKOUTS, date), options),

  /** The plan being followed; null = none. */
  getActivePlan: async (options?: RequestOptions): Promise<TrainingPlan | null> =>
    mockRequest(PLANS.find((p) => p.status === 'active') ?? null, options),

  /** Every plan built on the split, whatever its status. */
  getPlansUsingSplit: async (splitId: string, options?: RequestOptions): Promise<TrainingPlan[]> =>
    mockRequest(
      PLANS.filter((p) => p.splitId === splitId),
      options,
    ),

  /** Gives the picked plans the split's current days, keeping weeks already played (see planScheduleAfter). */
  updatePlansFromSplit: async ({
    splitId,
    planIds,
  }: {
    splitId: string
    planIds: string[]
  }): Promise<TrainingPlan[]> => {
    // shortcut: in-memory mock (lost on reload); the API will own this.
    const split = SPLITS.find((s) => s.id === splitId)
    if (!split) throw new Error(`Split ${splitId} not found`)
    const updated = PLANS.filter((p) => p.splitId === splitId && planIds.includes(p.id))
    for (const p of updated) p.schedule = planScheduleAfter(p, split.days)
    return mockRequest(updated)
  },

  /** null = no such split. */
  getSplit: async (id: string, options?: RequestOptions): Promise<Split | null> =>
    mockRequest(SPLITS.find((s) => s.id === id) ?? null, options),

  /** Replaces one of the user's own splits; built-in ones are copied instead (createSplit). */
  updateSplit: async (split: Split): Promise<Split> => {
    // shortcut: in-memory mock (lost on reload); the API will own this.
    const i = SPLITS.findIndex((s) => s.id === split.id)
    if (i === -1 || SPLITS[i].kind !== 'custom') throw new Error(`Split ${split.id} can't be edited`)
    SPLITS[i] = split
    return mockRequest(split)
  },

  /** The user's own splits first, then the built-in ones. */
  getSplits: async (options?: RequestOptions): Promise<Split[]> =>
    mockRequest(
      [...SPLITS].sort((a, b) => Number(a.kind === 'builtin') - Number(b.kind === 'builtin')),
      options,
    ),

  /** Saves a new split of the user's own. */
  createSplit: async (split: Omit<Split, 'id' | 'kind'>): Promise<Split> => {
    // shortcut: in-memory mock (lost on reload); the API will own this.
    const created: Split = { ...split, id: crypto.randomUUID(), kind: 'custom' }
    SPLITS.push(created)
    return mockRequest(created)
  },

  /** Saves an exercise of the user's own (1n). */
  createExercise: async (exercise: Omit<Exercise, 'id' | 'custom' | 'favourite'>): Promise<Exercise> => {
    // shortcut: in-memory mock (lost on reload); the API will own this.
    const created: Exercise = { ...exercise, id: crypto.randomUUID(), custom: true, favourite: false }
    EXERCISES.push(created)
    return mockRequest(created)
  },

  /** The exercise library, by name. */
  getExercises: async (options?: RequestOptions): Promise<Exercise[]> =>
    mockRequest(
      [...EXERCISES].sort((a, b) => a.name.localeCompare(b.name)),
      options,
    ),

  /** Muscles, equipment, record types and weight units to choose from, in display order. */
  getExerciseOptions: async (options?: RequestOptions): Promise<ExerciseOptions> =>
    mockRequest(EXERCISE_OPTIONS, options),

  getTemplates: async (options?: RequestOptions): Promise<WorkoutTemplate[]> => mockRequest(TEMPLATES, options),

  /** The last workout finished before `date`; null = none. */
  getLastSession: async (date: DateKey, options?: RequestOptions): Promise<WorkoutSession | null> =>
    mockRequest(lastBefore(SESSIONS, date), options),
}
