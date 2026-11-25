import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useId, useRef, useState } from 'react'

type Props<T extends string> = {
  label: string
  value: T
  options: readonly (T | { value: T; label: string })[]
  onChange: (value: T) => void
  hint?: string
}

// A labelled dropdown of fixed choices (primary muscle, equipment, what you record, weight unit).
export const OptionSelect = <T extends string>({ label, value, options, onChange, hint }: Props<T>) => {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  // In the split builder's sheet the list must render inside the dialog, or it can't be clicked.
  const [dialog, setDialog] = useState<HTMLElement | null>(null)
  useEffect(() => setDialog(ref.current?.closest('dialog') ?? null), [])
  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <span id={id} className="text-[13px] font-bold text-ink-2">
        {label}
      </span>
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger aria-labelledby={id} className="min-h-11 w-full rounded-[14px] bg-surface text-sm font-semibold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={6} className="max-h-80" container={dialog}>
          {options.map((o) => {
            const { value: v, label: l } = typeof o === 'string' ? { value: o, label: o } : o
            return (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      {hint && <span className="text-xs text-ink-2">{hint}</span>}
    </div>
  )
}
