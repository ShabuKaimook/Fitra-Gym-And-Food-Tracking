import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Body weight logged on `date`. data null = not weighed that day.
export const useWeight = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.weight(key),
    queryFn: ({ signal }) => HealthService.getWeight(key, { signal }),
  })
}

// The last weight recorded before `date`. data null = none earlier.
export const usePreviousWeight = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.weightBefore(key),
    queryFn: ({ signal }) => HealthService.getWeightBefore(key, { signal }),
  })
}

// Replaces the day's body weight (kg).
export const useSetWeight = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (kg: number) => HealthService.setWeight({ date: key, kg }),
    // Every weight query: a change can also be another day's "previous".
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weight'] }),
  })
}
