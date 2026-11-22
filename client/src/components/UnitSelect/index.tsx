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
import type { UnitId } from '@/services/FoodService/types/Food'

export type UnitOption = { value: UnitId; label: string; hint?: string }

type Props = {
  value: UnitId
  onChange: (unit: UnitId) => void
  /** Shown in order with separators between; empty groups are skipped. */
  groups: { label?: string; options: UnitOption[] }[]
  className?: string
  align?: 'start' | 'end'
  'aria-label'?: string
  'aria-labelledby'?: string
}

// Unit dropdown shared by the food log amount (1j) and the new food card.
export const UnitSelect = ({ value, onChange, groups, className, align, ...aria }: Props) => (
  <Select value={value} onValueChange={(v) => onChange(v as UnitId)}>
    <SelectTrigger {...aria} className={className}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent position="popper" align={align} sideOffset={6} className="max-h-80">
      {groups
        .filter((g) => g.options.length > 0)
        .map(({ label, options }, i) => (
          <SelectGroup key={label ?? i}>
            {i > 0 && <SelectSeparator />}
            {label && <SelectLabel>{label}</SelectLabel>}
            {options.map(({ value, label, hint }) => (
              <SelectItem key={value} value={value}>
                {label}
                {hint && <span className="font-medium text-ink-3 tabular-nums">{hint}</span>}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
    </SelectContent>
  </Select>
)
