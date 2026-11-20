import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMeals } from '@/hooks/queries/useMeals'
import type { Meal } from '@/services/FoodService/types/Food'
import { useId } from 'react'

type Props = { value: Meal; onChange: (meal: Meal) => void }

// "Meal" field at the bottom of the amount screen (1j).
export const MealSelect = ({ value, onChange }: Props) => {
  const labelId = useId()
  const meals = useMeals().data ?? []
  return (
    <div className="flex flex-col gap-1.5">
      {/* Not a <label>: the trigger is a button, so it's tied by aria-labelledby instead. */}
      <span id={labelId} className="text-[13px] font-bold text-ink-2">
        Meal
      </span>
      <Select value={value} onValueChange={(v) => onChange(v as Meal)}>
        <SelectTrigger aria-labelledby={labelId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={6}>
          {meals.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
