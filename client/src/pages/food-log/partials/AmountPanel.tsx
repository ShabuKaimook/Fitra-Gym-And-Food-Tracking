import { input, inputBase } from '@/components/Form'
import { numbersOnly } from '@/utils/numbersOnly'
import { MACROS, MICROS } from '@/constants/nutrients'
import { MEALS } from '@/constants/meals'
import { useInlineValidation } from '@/hooks/useInlineValidation'
import type { Food, Meal } from '@/services/FoodService/types/Food'
import { ChevronLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { amountUnits, defaultAmount, fmt, mealLabel, nutrientsFor, toBase, type AmountUnit } from '../food'

type Props = {
  food: Food
  meal: Meal
  onMeal: (meal: Meal) => void
  onBack: () => void
  onAdd: (amount: number, unit: AmountUnit) => void
  adding: boolean
}

// Amount screen (1j): mobile shows it in place of the list, desktop beside it. Mount with key={food.id}
// so the amount resets when another food is picked.
export const AmountPanel = ({ food, meal, onMeal, onBack, onAdd, adding }: Props) => {
  const initial = defaultAmount(food)
  const [amount, setAmount] = useState(String(initial.amount))
  const [unit, setUnit] = useState<AmountUnit>(initial.unit)
  const base = toBase(food, Number(amount) || 0, unit)
  const n = nutrientsFor(food, base)

  const rows: [string, number | null, string, string?][] = [
    ...MACROS.map(({ key, label, bg }): [string, number | null, string, string] => [label, n[key], 'g', bg]),
    ...MICROS.map(({ key, label, unit }): [string, number | null, string] => [label, n[key], unit]),
  ]

  const { attach, message: invalidMessage, clear: clearInvalid } = useInlineValidation()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onAdd(Number(amount), unit)
  }

  return (
    <form
      ref={attach}
      onSubmit={submit}
      onInput={clearInvalid}
      aria-label={`Amount of ${food.name}`}
      className="flex flex-col gap-3 lg:sticky lg:top-20 lg:rounded-[20px] lg:border lg:border-line/80 lg:bg-surface lg:p-4"
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Back to search"
          onClick={onBack}
          className="-ml-2.5 grid size-11 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 lg:hidden"
        >
          <ChevronLeft size={22} aria-hidden />
        </button>
        <h2 className="m-0 truncate text-[21px] leading-tight font-extrabold tracking-[-0.6px]">{food.name}</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-2">Amount</span>
        <div className="flex gap-2">
          <span className="w-28 flex-none">
            <input
              className={`${inputBase} text-xl font-bold`}
              type="number"
              inputMode="decimal"
              aria-label="Amount"
              onBeforeInput={numbersOnly}
              required
              min={0.01}
              max={100000}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </span>
          <select
            className={input}
            aria-label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as AmountUnit)}
          >
            {amountUnits(food).map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col rounded-[20px] border border-line/80 bg-surface px-3.5 py-3 lg:border-0 lg:p-0">
        <div className="flex items-baseline gap-1.5 pb-1.5" aria-live="polite">
          <span className="text-[28px] leading-none font-extrabold tracking-[-1px] tabular-nums">{n.calories}</span>
          <span className="text-xs text-ink-2">kcal</span>
          <span className="ml-auto text-xs text-ink-2 tabular-nums">
            for {fmt(base)} {food.unit}
          </span>
        </div>
        {rows.map(([label, value, u, dot]) => (
          <div key={label} className="flex items-center gap-1.75 border-b border-line-soft py-1.75 last:border-b-0">
            {dot && <span className={`size-2 rounded-full ${dot}`} aria-hidden />}
            <span className="flex-1 text-[13px] font-semibold">{label}</span>
            <span className="text-xs text-ink-2 tabular-nums">{value === null ? 'No data' : `${fmt(value)} ${u}`}</span>
          </div>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-2">Meal</span>
        <select className={input} value={meal} onChange={(e) => onMeal(e.target.value as Meal)}>
          {MEALS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      {invalidMessage && (
        <p role="alert" className="m-0 text-[13px] font-bold text-danger">
          {invalidMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={adding}
        className="h-13 rounded-2xl bg-primary text-[15px] font-extrabold text-on-primary disabled:opacity-60 lg:h-11"
      >
        {adding ? 'Saving…' : `Add to ${mealLabel(meal)}`}
      </button>
    </form>
  )
}
