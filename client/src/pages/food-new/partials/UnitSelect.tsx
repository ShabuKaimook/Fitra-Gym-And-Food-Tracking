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
import type { UnitId } from '@/services/FoodService/types/Food'
import { useId } from 'react'
import { labelText, row } from './PillField'

type Props = { value: UnitId; onChange: (unit: UnitId) => void }

const GROUPS = [
  { kind: 'base', label: 'Weight & volume' },
  { kind: 'portion', label: 'Portions' },
] as const

// "Unit  [ Grams (g) ⌄ ]" row of the food card: what "Nutrition per" is counted in.
export const UnitSelect = ({ value, onChange }: Props) => {
  const labelId = useId()
  const units = useUnits().data ?? []
  return (
    <div className={row}>
      <span id={labelId} className={labelText}>
        Unit
      </span>
      <Select value={value} onValueChange={(v) => onChange(v as UnitId)}>
        <SelectTrigger
          aria-labelledby={labelId}
          className="min-h-11 w-auto rounded-full bg-surface pr-4 pl-5 font-semibold"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="end" sideOffset={6} className="max-h-80">
          {GROUPS.map(({ kind, label }, i) => (
            <SelectGroup key={kind}>
              {i > 0 && <SelectSeparator />}
              <SelectLabel>{label}</SelectLabel>
              {units
                .filter((u) => u.kind === kind)
                .map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.label}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
