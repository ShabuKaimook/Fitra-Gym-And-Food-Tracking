import { capAtMax, numbersOnly } from '@/utils/numbersOnly'
import type { InputHTMLAttributes } from 'react'

// Label on the left, a rounded pill control on the right.
export const row = 'flex items-center justify-between gap-3'
export const labelText = 'text-sm font-bold'
const pill =
  'h-11 rounded-full border border-line bg-surface text-base font-semibold tabular-nums user-invalid:border-2 user-invalid:border-danger'

type InputProps = { label: string } & InputHTMLAttributes<HTMLInputElement>

// A short number in a pill, e.g. "Nutrition per  [ 100 ]".
export const PillInput = ({ label, ...inputProps }: InputProps) => (
  <label className={row}>
    <span className={labelText}>{label}</span>
    <input
      type="number"
      step="any"
      onBeforeInput={numbersOnly}
      {...inputProps}
      onChange={capAtMax(inputProps.onChange)}
      className={`${pill} w-28 px-4 text-center`}
    />
  </label>
)
