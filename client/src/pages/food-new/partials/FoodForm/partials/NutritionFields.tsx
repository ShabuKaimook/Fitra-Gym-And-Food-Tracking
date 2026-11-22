import { MACROS } from '@/constants/nutrients'
import { Flame } from 'lucide-react'
import type { MacroKey } from '../hooks/useFoodForm'
import { MicronutrientsBox, type MicroValues } from './MicronutrientsBox'
import { NutrientCard } from './NutrientCard'

type Change = { target: { value: string } }

type Props = {
  values: Record<MacroKey, string>
  micros: MicroValues
  onMacro: (key: MacroKey) => (e: Change) => void
  onMicros: (values: MicroValues) => void
}

// Energy, then protein / carbs / fat, then any micronutrients the user adds.
export const NutritionFields = ({ values, micros, onMacro, onMicros }: Props) => (
  <>
    <h2 className="m-0 pt-1 text-sm font-bold">Nutrition</h2>

    <NutrientCard
      icon={<Flame size={16} className="text-primary" aria-hidden />}
      label="Energy"
      unit="kcal"
      inputMode="numeric"
      required
      max={10000}
      step={1}
      value={values.calories}
      onChange={onMacro('calories')}
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
          value={values[key]}
          onChange={onMacro(key)}
        />
      ))}
    </div>

    <MicronutrientsBox values={micros} onChange={onMicros} />
    <p className="m-0 text-xs text-ink-2">Left blank = no data, never counted as 0</p>
  </>
)
