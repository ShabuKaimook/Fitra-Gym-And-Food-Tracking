import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUnits } from '@/hooks/queries/useUnits'
import type { Food, UnitId } from '@/services/FoodService/types/Food'
import { amountUnits } from '../food'

type Props = { food: Food; value: UnitId; onChange: (unit: UnitId) => void }

// Unit next to the amount (1j): the food's own units first, then every other unit as an estimate.
export const UnitSelect = ({ food, value, onChange }: Props) => {
  const { own, other } = amountUnits(food, useUnits().data)
  const item = ({ value, label, hint }: (typeof own)[number]) => (
    <SelectItem key={value} value={value}>
      {label}
      {hint && <span className="font-medium text-ink-3 tabular-nums">{hint}</span>}
    </SelectItem>
  )
  return (
    <Select value={value} onValueChange={(v) => onChange(v as UnitId)}>
      <SelectTrigger aria-label="Unit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={6} className="max-h-80">
        <SelectGroup>{own.map(item)}</SelectGroup>
        {other.length > 0 && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Other units (estimate)</SelectLabel>
              {other.map(item)}
            </SelectGroup>
          </>
        )}
      </SelectContent>
    </Select>
  )
}
