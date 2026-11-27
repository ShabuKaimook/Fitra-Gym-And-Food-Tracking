import { NotFound } from '@/components/NotFound'
import { Skeleton } from '@/components/Skeleton'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useFood } from '@/hooks/queries/useFoods'
import { FoodForm } from '@/pages/food-new/partials/FoodForm'
import { useSearchParams } from 'react-router-dom'

// Edit a food (?food=id): the new food form, filled in. ?meal is kept for the way back to the food log.
const FoodEditPage = () => {
  const [params] = useSearchParams()
  const food = useFood(params.get('food'))

  // key: the form copies the food into its state once, so a different food needs a fresh form.
  if (food.data) return <FoodForm key={food.data.id} food={food.data} />
  if (food.isPending && food.fetchStatus !== 'idle') return <Skeleton className="h-112 rounded-[28px]" />
  return (
    <NotFound
      title="Food not found"
      description="It may have been deleted, or the link is wrong."
      backTo={`${ROUTE_PATHS.FOOD_LOG}?${new URLSearchParams({ meal: params.get('meal') ?? '' })}`}
      backLabel="Back to food log"
    />
  )
}

export default FoodEditPage
