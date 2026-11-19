import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Logs one food. Refreshes every daily total (any range may include its day) and the recent list.
export const useAddFood = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: FoodService.addFood,
    onSuccess: () =>
      Promise.all(
        [['calories'], ['macros'], ['micronutrients'], QUERY_KEYS.recentFoods].map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      ),
  })
}
