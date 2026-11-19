type Props<T extends string> = {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

const chip = 'min-h-8 rounded-full border px-3 text-xs font-semibold'

// A row of toggle chips where one is on (e.g. All / Recent).
export const FilterChips = <T extends string>({ label, options, value, onChange }: Props<T>) => (
  <div className="flex gap-1.5" role="group" aria-label={label}>
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        aria-pressed={value === o.value}
        onClick={() => onChange(o.value)}
        className={`${chip} ${value === o.value ? 'border-primary-100 bg-primary-50 text-primary-ink' : 'border-line bg-surface-2 text-ink-2'}`}
      >
        {o.label}
      </button>
    ))}
  </div>
)
