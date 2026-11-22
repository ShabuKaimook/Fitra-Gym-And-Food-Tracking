import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Recovery score (1–10) on `date`. data null = not rated that day.
export const useRecovery = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.recovery(key),
    queryFn: ({ signal }) => HealthService.getRecovery(key, { signal }),
  })
}

// Replaces the day's recovery score.
export const useSetRecovery = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (score: number) => HealthService.setRecovery({ date: key, score }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recovery(key) }),
  })
}
