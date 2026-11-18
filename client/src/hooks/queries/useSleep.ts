import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

// Sleep for the night ending on `date`. data null = not recorded.
export const useSleep = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.sleep(key),
    queryFn: ({ signal }) => HealthService.getSleep(key, { signal }),
  })
}
