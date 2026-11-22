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

// Replaces the day's waist (cm).
export const useSetWaist = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cm: number) => HealthService.setWaist({ date: key, cm }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.waist(key) }),
  })
}
