import type { RequestOptions } from '@/types/api/RequestOptions'
import type { DateKey } from '@/utils/date'
import { mockRequest, onDate } from '@/utils/mockRequest'
import { WORKOUTS } from '../mockData'
import type { PlannedWorkout } from './types/Workout'

export const WorkoutService = {
  /** null = rest day, nothing planned. */
  getPlannedWorkout: async (date: DateKey, options?: RequestOptions): Promise<PlannedWorkout | null> =>
    mockRequest(onDate(WORKOUTS, date), options),
}
