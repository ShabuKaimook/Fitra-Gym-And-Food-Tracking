import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'
import { lastBefore, mockRequest, onDate } from '@/utils/mockRequest'
import { ACTIVE_PLAN, SESSIONS, SPLITS, TEMPLATES, WORKOUTS } from '../mockData'
import type { PlannedWorkout, Split, TrainingPlan, WorkoutSession, WorkoutTemplate } from './types/Workout'

export const WorkoutService = {
  /** null = rest day, nothing planned. */
  getPlannedWorkout: async (date: DateKey, options?: RequestOptions): Promise<PlannedWorkout | null> =>
    mockRequest(onDate(WORKOUTS, date), options),

  /** The plan being followed; null = none. */
  getActivePlan: async (options?: RequestOptions): Promise<TrainingPlan | null> => mockRequest(ACTIVE_PLAN, options),

  /** The user's own splits first, then the built-in ones. */
  getSplits: async (options?: RequestOptions): Promise<Split[]> =>
    mockRequest(
      [...SPLITS].sort((a, b) => Number(a.kind === 'builtin') - Number(b.kind === 'builtin')),
      options,
    ),

  getTemplates: async (options?: RequestOptions): Promise<WorkoutTemplate[]> => mockRequest(TEMPLATES, options),

  /** The last workout finished before `date`; null = none. */
  getLastSession: async (date: DateKey, options?: RequestOptions): Promise<WorkoutSession | null> =>
    mockRequest(lastBefore(SESSIONS, date), options),
}
