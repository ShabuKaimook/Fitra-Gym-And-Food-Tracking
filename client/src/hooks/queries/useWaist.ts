import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Waist measured on `date`. data null = not measured that day.
export const useWaist = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.waist(key),
    queryFn: ({ signal }) => HealthService.getWaist(key, { signal }),
  })
}

// The last waist recorded before `date`. data null = none earlier.
export const usePreviousWaist = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.waistBefore(key),
    queryFn: ({ signal }) => HealthService.getWaistBefore(key, { signal }),
  })
}

// Replaces the day's waist (cm).
export const useSetWaist = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cm: number) => HealthService.setWaist({ date: key, cm }),
    // Every waist query: a change can also be another day's "previous".
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waist'] }),
  })
}
