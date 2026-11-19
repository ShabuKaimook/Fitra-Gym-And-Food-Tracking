import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Foods matching `query`. Keeps the last results on screen while the next ones load.
export const useFoodSearch = (query: string) =>
  useQuery({
    queryKey: QUERY_KEYS.foodSearch(query.trim().toLowerCase()),
    queryFn: ({ signal }) => FoodService.searchFoods(query, { signal }),
    placeholderData: keepPreviousData,
  })

export const useRecentFoods = () =>
  useQuery({
    queryKey: QUERY_KEYS.recentFoods,
    queryFn: ({ signal }) => FoodService.getRecentFoods({ signal }),
  })

// One food; disabled (data undefined) while id is null.
export const useFood = (id: string | null) =>
  useQuery({
    queryKey: QUERY_KEYS.food(id ?? ''),
    queryFn: ({ signal }) => FoodService.getFood(id!, { signal }),
    enabled: id !== null,
  })

export const useCreateFood = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: FoodService.createFood,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.foods }),
  })
}
