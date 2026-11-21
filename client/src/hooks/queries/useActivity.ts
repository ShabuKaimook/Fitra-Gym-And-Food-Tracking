import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Steps and cardio on `date`. data null = nothing recorded.
export const useActivity = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.activity(key),
    queryFn: ({ signal }) => HealthService.getActivity(key, { signal }),
  })
}

// Replaces the day's step count.
export const useSetSteps = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (steps: number) => HealthService.setSteps({ date: key, steps }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activity(key) }),
  })
}
