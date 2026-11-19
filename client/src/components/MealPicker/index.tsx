import { MEALS } from '@/constants/meals'
import type { Meal } from '@/services/FoodService/types/Food'
import { ChevronDown } from 'lucide-react'

type Props = {
  value: Meal
  onChange: (meal: Meal) => void
  /** 'pill': rounded box (give it a background with className). 'title': plain text at page-title size. */
  variant?: 'pill' | 'title'
  /** Pill background and border, e.g. translucent on a cover image or outlined on the canvas. */
  className?: string
}

const VARIANTS = {
  pill: { box: 'rounded-full px-4 text-base', chevron: 16 },
  title: { box: 'rounded-lg px-1 text-[21px] tracking-[-0.6px] lg:text-[25px]', chevron: 20 },
}

// Dropdown for Breakfast / Lunch / Dinner / Snacks. The visible text and chevron size the control
// to the chosen meal (a bare <select> is as wide as its longest option); an invisible native
// <select> covers them, so tapping still opens the platform's own list.
export const MealPicker = ({
  value,
  onChange,
  variant = 'pill',
  className = 'border border-line bg-surface',
}: Props) => {
  const v = VARIANTS[variant]
  return (
    <label
      className={`relative inline-flex h-11 items-center gap-1.5 font-extrabold has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary ${v.box} ${variant === 'pill' ? className : ''}`}
    >
      <span aria-hidden>{MEALS.find((m) => m.value === value)?.label}</span>
      <ChevronDown size={v.chevron} className="flex-none" aria-hidden />
      <select
        aria-label="Meal"
        value={value}
        onChange={(e) => onChange(e.target.value as Meal)}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
      >
        {MEALS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </label>
  )
}
