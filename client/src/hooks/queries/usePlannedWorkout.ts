import { QUERY_KEYS } from '@/constants/queryKeys'
import { WorkoutService } from '@/services/WorkoutService'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

// The workout planned for `date`. data null = rest day.
export const usePlannedWorkout = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.plannedWorkout(key),
    queryFn: ({ signal }) => WorkoutService.getPlannedWorkout(key, { signal }),
  })
}
