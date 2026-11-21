import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Water drunk on `date`. data null = not recorded.
export const useWater = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.water(key),
    queryFn: ({ signal }) => FoodService.getWater(key, { signal }),
  })
}

// Replaces the day's water total with `liters`.
export const useSetWater = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (liters: number) => FoodService.setWater({ date: key, liters }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.water(key) }),
  })
}

// Adds `ml` to the day's water total.
export const useAddWater = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ml: number) => FoodService.addWater({ date: key, ml }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.water(key) }),
  })
}
