import { Search } from 'lucide-react'

type Props = { value: string; onChange: (value: string) => void }

export const SearchBox = ({ value, onChange }: Props) => (
  <label className="relative">
    <span className="sr-only">Search foods</span>
    <Search size={16} className="absolute top-3.5 left-3 text-ink-3" aria-hidden />
    <input
      type="search"
      placeholder="Search foods"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-11 w-full rounded-[14px] border border-line bg-surface pr-3 pl-9 text-base placeholder:text-ink-3"
    />
  </label>
)
