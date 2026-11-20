import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import { useQuery } from '@tanstack/react-query'

// Base units (g, ml) and portions (plate, cup, …). Fetched once per session.
export const useUnits = () =>
  useQuery({
    queryKey: QUERY_KEYS.units,
    queryFn: ({ signal }) => FoodService.getUnits({ signal }),
    staleTime: Infinity,
  })
