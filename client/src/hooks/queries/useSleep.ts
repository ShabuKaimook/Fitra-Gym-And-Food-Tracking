import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Sleep for the night ending on `date`. data null = not recorded.
export const useSleep = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.sleep(key),
    queryFn: ({ signal }) => HealthService.getSleep(key, { signal }),
  })
}

// Replaces the night's sleep (minutes) and its quality (1–10).
export const useSetSleep = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ minutes, quality }: { minutes: number; quality: number }) =>
      HealthService.setSleep({ date: key, minutes, quality }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sleep(key) }),
  })
}
