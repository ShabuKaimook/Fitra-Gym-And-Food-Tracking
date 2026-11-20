import { capAtMax, numbersOnly } from '@/utils/numbersOnly'
import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
  unit: string
  /** Extra control on the right, e.g. "Sync with macros". */
  action?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

// A card that is one number input: icon + label, then a big value and its unit. The whole card
// shows focus (ring) and errors (red border), so the input itself has no outline.
export const NutrientCard = ({ icon, label, unit, action, ...inputProps }: Props) => (
  <div className="flex min-w-0 items-start gap-2 rounded-[20px] border border-line/80 bg-surface p-3.5 focus-within:ring-2 focus-within:ring-primary has-user-invalid:border-danger">
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-2">
        {icon}
        {label}
      </span>
      <span className="flex min-w-0 items-baseline gap-1">
        <input
          type="number"
          step="any"
          min={0}
          placeholder="–"
          onBeforeInput={numbersOnly}
          {...inputProps}
          onChange={capAtMax(inputProps.onChange)}
          className="field-sizing-content max-w-full min-w-[2ch] bg-transparent text-lg font-bold tabular-nums placeholder:text-ink-3 focus-visible:outline-none"
        />
        <span className="text-sm font-semibold text-ink-2">{unit}</span>
      </span>
    </label>
    {action}
  </div>
)
