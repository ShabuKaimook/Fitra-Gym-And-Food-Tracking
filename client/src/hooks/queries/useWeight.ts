import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

// Body weight logged on `date`. data null = not weighed that day.
export const useWeight = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.weight(key),
    queryFn: ({ signal }) => HealthService.getWeight(key, { signal }),
  })
}
