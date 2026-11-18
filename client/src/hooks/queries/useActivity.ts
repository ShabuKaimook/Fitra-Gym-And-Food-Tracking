import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

// Steps and cardio on `date`. data null = nothing recorded.
export const useActivity = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.activity(key),
    queryFn: ({ signal }) => HealthService.getActivity(key, { signal }),
  })
}
