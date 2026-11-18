import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import { toDateKey } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'

// Water drunk on `date`. data null = not recorded.
export const useWater = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.water(key),
    queryFn: ({ signal }) => FoodService.getWater(key, { signal }),
  })
}
