import { inputBase } from '@/components/Form'
import { cn } from 'cn'
import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  /** "Search foods": the placeholder and the label screen readers read. */
  label: string
  className?: string
}

// Search box with a magnifier inside. White, so it shows on grey panels and the page alike; 16px text
// so iPhones don't zoom in when it's tapped.
export const SearchInput = ({ value, onChange, label, className }: Props) => (
  <label className={cn('relative block', className)}>
    <span className="sr-only">{label}</span>
    <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" aria-hidden />
    <input
      type="search"
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputBase, 'bg-surface pl-9 text-base')}
    />
  </label>
)
