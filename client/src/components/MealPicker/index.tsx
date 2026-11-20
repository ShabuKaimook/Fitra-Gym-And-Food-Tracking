import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMeals } from '@/hooks/queries/useMeals'
import { cn } from '@/lib/utils'
import type { Meal } from '@/services/FoodService/types/Food'

type Props = {
  value: Meal
  onChange: (meal: Meal) => void
  /** 'pill': rounded box (give it a background with className). 'title': plain text at page-title size. */
  variant?: 'pill' | 'title'
  /** Pill background and border, e.g. translucent on a cover image or outlined on the canvas. */
  className?: string
}

// Trigger sizes itself to the chosen meal; [&_svg] sizes the chevron the select adds.
const VARIANTS = {
  pill: 'w-auto gap-1.5 rounded-full px-4 font-extrabold [&_svg]:size-4 [&_svg]:text-ink',
  title:
    'w-auto gap-1.5 rounded-lg border-0 bg-transparent px-1 text-[21px] font-extrabold tracking-[-0.6px] lg:text-[25px] [&_svg]:size-5 [&_svg]:text-ink',
}

// Dropdown for Breakfast / Lunch / Dinner / Snacks, shared by the food log title and the new food cover.
export const MealPicker = ({
  value,
  onChange,
  variant = 'pill',
  className = 'border border-line bg-surface',
}: Props) => {
  const meals = useMeals().data ?? []
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Meal)}>
      <SelectTrigger aria-label="Meal" className={cn(VARIANTS[variant], variant === 'pill' && className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="center" sideOffset={6}>
        {meals.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
