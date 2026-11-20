import { FormPage } from '@/components/Form'
import { MACROS, MICROS } from '@/constants/nutrients'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useCreateFood } from '@/hooks/queries/useFoods'
import { MealPicker } from '@/components/MealPicker'
import { parseMeal } from '@/pages/food-log/food'
import type { Food } from '@/services/FoodService/types/Food'
import { Flame, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { NutrientCard } from './partials/NutrientCard'
import { PillInput } from './partials/PillField'
import { TitleField } from './partials/TitleField'
import { UnitSelect } from './partials/UnitSelect'

// Blank stays null (no data), never 0.
const optionalNumber = (v: string) => (v === '' ? null : Number(v))

// New food (1j's third screen, laid out as a food card): saved to the food database, then opened in
// the food log to pick the amount. ?meal and ?name come from the food log.
const FoodNewPage = () => {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const meal = parseMeal(params.get('meal'))
  const createFood = useCreateFood()
  const [more, setMore] = useState(false)
  const [form, setForm] = useState({
    name: params.get('name') ?? '',
    per: '100',
    unit: 'g' as Food['unit'],
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sodium: '',
  })
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const logUrl = (extra: Record<string, string> = {}) =>
    `${ROUTE_PATHS.FOOD_LOG}?${new URLSearchParams({ meal, ...extra })}`

  const save = () =>
    createFood.mutate(
      {
        name: form.name.trim(),
        brand: null,
        unit: form.unit,
        per: Number(form.per),
        serving: null,
        nutrients: {
          calories: Number(form.calories),
          protein: optionalNumber(form.protein),
          carbs: optionalNumber(form.carbs),
          fat: optionalNumber(form.fat),
          fiber: optionalNumber(form.fiber),
          sodium: optionalNumber(form.sodium),
        },
      },
      {
        // Straight to its amount screen; replace so Back doesn't return to this filled-in form.
        onSuccess: (food) => navigate(logUrl({ food: food.id }), { replace: true }),
      },
    )

  return (
    <FormPage
      title="New food"
      backTo={logUrl()}
      submitLabel="Save"
      onSubmit={save}
      pending={createFood.isPending}
      error={createFood.isError ? 'Not saved, try again' : undefined}
      headerCenter={
        <MealPicker
          value={meal}
          onChange={(m) => setParams({ ...Object.fromEntries(params), meal: m }, { replace: true })}
          className="bg-surface/70 backdrop-blur-sm"
        />
      }
      cover={<img src="/illustrations/new-food.svg" alt="" className="size-full object-cover object-bottom" />}
      side={
        <>
          <TitleField
            label="Food name"
            required
            // Spaces only would pass `required` but save an empty name.
            pattern=".*\S.*"
            maxLength={100}
            value={form.name}
            onChange={set('name')}
          />
          <PillInput
            label="Nutrition per"
            inputMode="decimal"
            required
            min={0.1}
            max={10000}
            value={form.per}
            onChange={set('per')}
          />
          <UnitSelect value={form.unit} onChange={(unit) => setForm((f) => ({ ...f, unit }))} />
        </>
      }
    >
      <div className="flex items-center justify-between gap-3 pt-1">
        <h2 className="m-0 text-sm font-bold">Nutrition</h2>
        <button
          type="button"
          aria-expanded={more}
          onClick={() => setMore((m) => !m)}
          className="inline-flex min-h-11 items-center gap-1 text-[13px] font-bold text-ink-2"
        >
          {more ? 'Fewer nutrients' : 'Add more nutrients'}
          <Plus size={16} className={more ? 'rotate-45' : ''} aria-hidden />
        </button>
      </div>

      <NutrientCard
        icon={<Flame size={16} className="text-primary" aria-hidden />}
        label="Energy"
        unit="kcal"
        inputMode="numeric"
        required
        max={10000}
        step={1}
        value={form.calories}
        onChange={set('calories')}
      />

      <div className="grid grid-cols-3 gap-2.5">
        {MACROS.map(({ key, label, icon: Icon, text }) => (
          <NutrientCard
            key={key}
            icon={<Icon size={16} className={text} aria-hidden />}
            label={label}
            unit="g"
            inputMode="decimal"
            max={1000}
            value={form[key]}
            onChange={set(key)}
          />
        ))}
      </div>

      {more && (
        <div className="grid grid-cols-2 gap-2.5">
          {MICROS.map(({ key, label, unit, max, icon: Icon }) => (
            <NutrientCard
              key={key}
              icon={<Icon size={16} className="text-ink-3" aria-hidden />}
              label={label}
              unit={unit}
              inputMode="decimal"
              max={max}
              value={form[key]}
              onChange={set(key)}
            />
          ))}
        </div>
      )}
      <p className="m-0 text-xs text-ink-2">Left blank = no data, never counted as 0</p>
    </FormPage>
  )
}

export default FoodNewPage
