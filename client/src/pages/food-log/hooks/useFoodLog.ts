import { useAddFood } from '@/hooks/queries/useAddFood'
import type { Food, Meal } from '@/services/FoodService/types/Food'
import { startOfToday, toDateKey } from '@/utils/date'
import { useMealLabel } from '@/hooks/queries/useMeals'
import { useUnits } from '@/hooks/queries/useUnits'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { defaultAmount, nutrientsFor, parseMeal, toBase, type AmountUnit } from '../food'

// Meal lives in the URL (?meal=lunch) so refresh keeps it. Used by the food log and the food form.
export const useFoodLog = () => {
  const [params, setParams] = useSearchParams()
  const meal = parseMeal(params.get('meal'))
  const mealLabel = useMealLabel(meal)
  const units = useUnits().data
  const addFood = useAddFood()

  const setMeal = (m: Meal) =>
    setParams(
      (p) => {
        p.set('meal', m)
        return p
      },
      { replace: true },
    )

  const add = (food: Food, amount: number, unit: AmountUnit, onDone?: () => void) => {
    const base = toBase(food, amount, unit, units)
    addFood.mutate(
      {
        date: toDateKey(startOfToday()),
        meal,
        foodId: food.id,
        name: food.name,
        amount: base,
        unit: food.unit,
        ...nutrientsFor(food, base),
      },
      {
        onSuccess: () => {
          toast.success(`Added ${food.name} to ${mealLabel}`)
          onDone?.()
        },
        onError: () => toast.error(`${food.name} not saved, try again`),
      },
    )
  }

  // + on a row: one default serving, no amount screen.
  const quickAdd = (food: Food) => {
    const { amount, unit } = defaultAmount(food)
    add(food, amount, unit)
  }

  return { meal, setMeal, mealLabel, add, quickAdd, adding: addFood.isPending }
}
