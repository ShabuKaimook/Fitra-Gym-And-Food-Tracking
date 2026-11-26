import { ToggleChip } from '@/components/ToggleChip'
type Props<T extends string> = {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

// A row of toggle chips where one is on (e.g. All / Recent).
export const FilterChips = <T extends string>({ label, options, value, onChange }: Props<T>) => (
  <div className="flex gap-1.5" role="group" aria-label={label}>
    {options.map((o) => (
      <ToggleChip key={o.value} size="sm" on={value === o.value} onClick={() => onChange(o.value)}>
        {o.label}
      </ToggleChip>
    ))}
  </div>
)
