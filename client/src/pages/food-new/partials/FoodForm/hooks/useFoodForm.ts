import { MICROS } from '@/constants/nutrients'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useCreateFood, useUpdateFood } from '@/hooks/queries/useFoods'
import { fmt, nutrientsFor } from '@/pages/food-log/food'
import { useFoodLog } from '@/pages/food-log/hooks/useFoodLog'
import type { Food } from '@/services/FoodService/types/Food'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import type { MicroValues } from '../partials/MicronutrientsBox'

export type MacroKey = 'calories' | 'protein' | 'carbs' | 'fat'
type Change = { target: { value: string } }

// Blank stays null (no data), never 0.
const optionalNumber = (v: string) => (v === '' ? null : Number(v))
// null (no data) shows as blank, the same way it was typed. fmt trims float noise from scaling.
const text = (v: number | null | undefined) => (v == null ? '' : fmt(v))

// State and saving for the food form. New food (no `food`): Save creates it, then opens it filled in.
// Existing food: "Nutrition per" is the amount eaten and scales every nutrient by the food's ratio;
// "Add to <meal>" saves any edits to the food, then logs that amount. ?meal and ?name come from the food log.
export const useFoodForm = (food?: Food) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { meal, setMeal, mealLabel, add, adding } = useFoodLog()
  const createFood = useCreateFood()
  const updateFood = useUpdateFood()

  // Existing food: the nutrients "Nutrition per" scales from. Typed nutrients replace it (dirty) on the
  // next scale or save, so scaling always starts from exact values, never from already-rounded ones.
  const [basis, setBasis] = useState(food)
  const [dirty, setDirty] = useState(false)
  const [image, setImage] = useState(food?.image)
  const [micros, setMicros] = useState<MicroValues>(() =>
    Object.fromEntries(
      MICROS.filter(({ key }) => food?.nutrients[key] !== undefined).map(({ key }) => [
        key,
        text(food?.nutrients[key]),
      ]),
    ),
  )
  const [form, setForm] = useState({
    name: food?.name ?? params.get('name') ?? '',
    per: food ? String(food.per) : '100',
    unit: food?.unit ?? ('g' as Food['unit']),
    calories: text(food?.nutrients.calories),
    protein: text(food?.nutrients.protein),
    carbs: text(food?.nutrients.carbs),
    fat: text(food?.nutrients.fat),
  })

  const setName = (e: Change) => setForm((f) => ({ ...f, name: e.target.value }))
  const setUnit = (unit: Food['unit']) => setForm((f) => ({ ...f, unit }))
  const setMacro = (key: MacroKey) => (e: Change) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setDirty(true)
  }
  const changeMicros = (values: MicroValues) => {
    setMicros(values)
    setDirty(true)
  }

  const fields = () => ({
    name: form.name.trim(),
    unit: form.unit,
    per: Number(form.per),
    image,
    // Built whole, so a micro removed in the form is removed from the food too.
    nutrients: {
      calories: Number(form.calories),
      protein: optionalNumber(form.protein),
      carbs: optionalNumber(form.carbs),
      fat: optionalNumber(form.fat),
      ...Object.fromEntries(Object.entries(micros).map(([key, v]) => [key, optionalNumber(v)])),
    },
  })
  // What the nutrients are in proportion to: the typed values if any, else the basis.
  const ratioFood = () => (dirty ? { ...food!, ...fields() } : basis!)

  const setPer = (e: Change) => {
    const per = Number(e.target.value)
    if (!food || !(per > 0)) return setForm((f) => ({ ...f, per: e.target.value }))
    const src = ratioFood()
    const n = nutrientsFor(src, per)
    setBasis(src)
    setDirty(false)
    setForm((f) => ({
      ...f,
      per: e.target.value,
      calories: text(n.calories),
      protein: text(n.protein),
      carbs: text(n.carbs),
      fat: text(n.fat),
    }))
    setMicros((m) => Object.fromEntries(Object.keys(m).map((k) => [k, text(n[k as keyof typeof n])])))
  }

  const logUrl = `${ROUTE_PATHS.FOOD_LOG}?${new URLSearchParams({ meal })}`
  const notSaved = () => toast.error('Food not saved, try again')

  const save = () => {
    if (!food) {
      return createFood.mutate(
        { brand: null, serving: null, ...fields() },
        {
          // Opens it filled in to pick the amount; replace so Back doesn't return to this blank form.
          onSuccess: (saved) => {
            toast.success(`Saved ${saved.name}`)
            navigate(`${ROUTE_PATHS.FOOD_EDIT}?${new URLSearchParams({ food: saved.id, meal })}`, { replace: true })
          },
          onError: notSaved,
        },
      )
    }
    const { name, unit } = fields()
    const saved = { ...ratioFood(), name, unit, image }
    const log = () => add(saved, Number(form.per), unit, () => navigate(logUrl, { replace: true }))
    // Only write the food when the form changed it; a new amount alone is just what was eaten.
    if (JSON.stringify(saved) === JSON.stringify(food)) log()
    else updateFood.mutate(saved, { onSuccess: log, onError: notSaved })
  }

  return {
    form,
    micros,
    image,
    meal,
    logUrl,
    submitLabel: food ? `Add to ${mealLabel}` : 'Save',
    pending: createFood.isPending || updateFood.isPending || adding,
    setName,
    setPer,
    setUnit,
    setMacro,
    changeMicros,
    setImage,
    setMeal,
    save,
  }
}
