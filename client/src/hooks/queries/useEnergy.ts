import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Energy score (1–10) on `date`. data null = not rated that day.
export const useEnergy = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.energy(key),
    queryFn: ({ signal }) => HealthService.getEnergy(key, { signal }),
  })
}

// Replaces the day's energy score.
export const useSetEnergy = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (score: number) => HealthService.setEnergy({ date: key, score }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.energy(key) }),
  })
}
