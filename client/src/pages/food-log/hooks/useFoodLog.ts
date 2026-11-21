import { useAddFood } from '@/hooks/queries/useAddFood'
import type { Food, Meal } from '@/services/FoodService/types/Food'
import { startOfToday, toDateKey } from '@/utils/date'
import { useMealLabel } from '@/hooks/queries/useMeals'
import { useUnits } from '@/hooks/queries/useUnits'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { defaultAmount, nutrientsFor, parseMeal, toBase, type AmountUnit } from '../food'

// Meal and selected food live in the URL (?meal=lunch&food=id): refresh keeps them, and on mobile
// the phone's back gesture leaves the amount screen.
export const useFoodLog = () => {
  const [params, setParams] = useSearchParams()
  const meal = parseMeal(params.get('meal'))
  const mealLabel = useMealLabel(meal)
  const units = useUnits().data
  const foodId = params.get('food')
  const addFood = useAddFood()

  const update = (changes: Record<string, string | null>, replace: boolean) =>
    setParams(
      (p) => {
        for (const [k, v] of Object.entries(changes)) {
          if (v === null) p.delete(k)
          else p.set(k, v)
        }
        return p
      },
      { replace },
    )

  const select = (id: string) => update({ food: id }, foodId !== null)
  const unselect = () => update({ food: null }, true)
  const setMeal = (m: Meal) => update({ meal: m }, true)

  const add = (food: Food, amount: number, unit: AmountUnit) => {
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
          unselect()
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

  return { meal, setMeal, foodId, select, unselect, add, quickAdd, adding: addFood.isPending }
}
