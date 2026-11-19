import { numbersOnly } from '@/utils/numbersOnly'
import { ChevronDown } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

// Label on the left, a rounded pill control on the right.
const row = 'flex items-center justify-between gap-3'
const labelText = 'text-sm font-bold'
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
      className={`${pill} w-28 px-4 text-center`}
    />
  </label>
)

type SelectProps = { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>

// A dropdown in a pill, e.g. "Unit  [ grams (g) ⌄ ]". Pass <option>s as children.
export const PillSelect = ({ label, children, ...selectProps }: SelectProps) => (
  <label className={row}>
    <span className={labelText}>{label}</span>
    <span className="relative">
      <select {...selectProps} className={`${pill} appearance-none pr-11 pl-5`}>
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute top-3.5 right-4.5" aria-hidden />
    </span>
  </label>
)
