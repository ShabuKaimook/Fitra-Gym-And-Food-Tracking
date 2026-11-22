import { Skeleton } from '@/components/Skeleton'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useFood } from '@/hooks/queries/useFoods'
import { FoodForm } from '@/pages/food-new/partials/FoodForm'
import { Link, useSearchParams } from 'react-router-dom'

// Edit a food (?food=id): the new food form, filled in. ?meal is kept for the way back to the food log.
const FoodEditPage = () => {
  const [params] = useSearchParams()
  const food = useFood(params.get('food'))

  // key: the form copies the food into its state once, so a different food needs a fresh form.
  if (food.data) return <FoodForm key={food.data.id} food={food.data} />
  if (food.isPending && food.fetchStatus !== 'idle') return <Skeleton className="h-112 rounded-[28px]" />
  return (
    <div className="flex flex-col items-start gap-2 rounded-[20px] border border-line/80 bg-surface p-4">
      <p className="m-0 font-bold">Food not found</p>
      <Link
        to={`${ROUTE_PATHS.FOOD_LOG}?${new URLSearchParams({ meal: params.get('meal') ?? '' })}`}
        className="font-bold text-primary-ink"
      >
        Back to food log
      </Link>
    </div>
  )
}

export default FoodEditPage
