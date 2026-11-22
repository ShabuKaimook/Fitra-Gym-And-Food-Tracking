import { SquarePen } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

type Props = { label: string } & InputHTMLAttributes<HTMLInputElement>

// A text input styled as the page title, with a pencil to show it's editable. `label` is for
// screen readers; the placeholder shows it visually.
export const TitleField = ({ label, ...inputProps }: Props) => (
  <label className="flex items-center gap-2">
    <span className="sr-only">{label}</span>
    <input
      placeholder={label}
      {...inputProps}
      className="min-w-0 flex-1 rounded-sm bg-transparent text-xl leading-tight font-extrabold tracking-[-0.4px] placeholder:text-ink-3 user-invalid:border-danger"
    />
    <SquarePen size={18} className="flex-none text-ink-2" aria-hidden />
  </label>
)
