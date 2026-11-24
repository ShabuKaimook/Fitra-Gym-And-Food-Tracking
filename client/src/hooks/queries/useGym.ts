import { QUERY_KEYS } from '@/constants/queryKeys'
import { WorkoutService } from '@/services/WorkoutService'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

// The plan being followed. data null = none.
export const useActivePlan = () =>
  useQuery({ queryKey: QUERY_KEYS.activePlan, queryFn: ({ signal }) => WorkoutService.getActivePlan({ signal }) })

// The user's splits, their own first.
export const useSplits = () =>
  useQuery({ queryKey: QUERY_KEYS.splits, queryFn: ({ signal }) => WorkoutService.getSplits({ signal }) })

export const useTemplates = () =>
  useQuery({ queryKey: QUERY_KEYS.templates, queryFn: ({ signal }) => WorkoutService.getTemplates({ signal }) })

// The last workout finished before `date`. data null = none yet.
export const useLastSession = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.lastSession(key),
    queryFn: ({ signal }) => WorkoutService.getLastSession(key, { signal }),
  })
}
