import { Skeleton } from '@/components/Skeleton'
import { useFood } from '@/hooks/queries/useFoods'
import type { Meal } from '@/services/FoodService/types/Food'
import type { AmountUnit } from '../food'
import type { useFoodLog } from '../hooks/useFoodLog'
import { AmountPanel } from './AmountPanel'

type Props = Pick<ReturnType<typeof useFoodLog>, 'foodId' | 'unselect' | 'add' | 'adding'> & {
  meal: Meal
  onMeal: (meal: Meal) => void
}

// The right-hand side (desktop) or the whole screen (mobile) for the picked food: its amount
// panel, a skeleton while it loads, "not found", or a hint when nothing is picked (desktop only).
export const SelectedFood = ({ foodId, unselect, add, adding, meal, onMeal }: Props) => {
  const selected = useFood(foodId)

  if (!foodId) {
    return (
      <p className="m-0 hidden rounded-[20px] border border-dashed border-ink-3 p-4 text-center text-[13px] text-ink-2 lg:block">
        Pick a food to choose the amount
      </p>
    )
  }
  if (selected.data) {
    const food = selected.data
    return (
      <AmountPanel
        key={food.id}
        food={food}
        meal={meal}
        onMeal={onMeal}
        onBack={unselect}
        onAdd={(amount: number, unit: AmountUnit) => add(food, amount, unit)}
        adding={adding}
      />
    )
  }
  if (selected.isPending) return <Skeleton className="h-112 rounded-[20px]" />
  return (
    <div className="flex flex-col items-start gap-2 rounded-[20px] border border-line/80 bg-surface p-4">
      <p className="m-0 font-bold">Food not found</p>
      <button type="button" onClick={unselect} className="font-bold text-primary-ink">
        Back to search
      </button>
    </div>
  )
}
