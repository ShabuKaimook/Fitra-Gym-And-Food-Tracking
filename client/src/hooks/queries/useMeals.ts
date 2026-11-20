import { QUERY_KEYS } from '@/constants/queryKeys'
import { FoodService } from '@/services/FoodService'
import type { Meal } from '@/services/FoodService/types/Food'
import { useQuery } from '@tanstack/react-query'

// Meal groups in day order. Fetched once per session: they don't change while the app runs.
export const useMeals = () =>
  useQuery({
    queryKey: QUERY_KEYS.meals,
    queryFn: ({ signal }) => FoodService.getMeals({ signal }),
    staleTime: Infinity,
  })

// "Lunch" for 'lunch'; '' until the meals load.
export const useMealLabel = (meal: Meal) => useMeals().data?.find((m) => m.id === meal)?.label ?? ''
