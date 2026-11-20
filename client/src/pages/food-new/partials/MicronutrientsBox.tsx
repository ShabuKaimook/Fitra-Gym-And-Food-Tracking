import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { MICROS } from '@/constants/nutrients'
import type { MicroKey } from '@/services/FoodService/types/Food'
import { capAtMax, numbersOnly } from '@/utils/numbersOnly'
import { ListChecks, Plus, X } from 'lucide-react'
import { useId, useRef } from 'react'

/** Typed text per added micro; a key being present means its row is shown. */
export type MicroValues = Partial<Record<MicroKey, string>>

// Same cap as Energy: any one nutrient above this per food is a typo.
const MAX_AMOUNT = 10000

type Props = { values: MicroValues; onChange: (values: MicroValues) => void }

// The optional micronutrients of the new food: rows the user added, then "Add micronutrient", a
// dropdown of the ones not added yet. Rows stay in the order they were added.
export const MicronutrientsBox = ({ values, onChange }: Props) => {
  const idPrefix = useId()
  const inputId = (key: MicroKey) => `${idPrefix}-${key}`
  // Set on pick, read when the dropdown closes: focus goes to the new input instead of back to the button.
  const justAdded = useRef<MicroKey | null>(null)

  const added = (Object.keys(values) as MicroKey[]).map((key) => MICROS.find((m) => m.key === key)!)
  const remaining = MICROS.filter(({ key }) => !(key in values))

  const add = (key: MicroKey) => {
    justAdded.current = key
    onChange({ ...values, [key]: '' })
  }
  const remove = (key: MicroKey) => {
    const rest = { ...values }
    delete rest[key]
    onChange(rest)
  }

  return (
    <section
      aria-labelledby={`${idPrefix}-title`}
      className="flex flex-col rounded-[20px] border border-line/80 bg-surface px-3.5 pt-3 pb-1.5"
    >
      <h3 id={`${idPrefix}-title`} className="m-0 flex items-center gap-1.5 pb-1 text-[13px] font-semibold text-ink-2">
        <ListChecks size={15} aria-hidden />
        Micronutrients
      </h3>

      {added.length === 0 && (
        <p className="m-0 py-2 text-[13px] text-ink-3">Optional. Add the ones on the label, like fiber or sodium.</p>
      )}

      {added.map(({ key, label, unit, icon: Icon }) => (
        <div key={key} className="flex items-center gap-2 border-b border-line-soft py-1">
          <label htmlFor={inputId(key)} className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold">
            <Icon size={16} className="flex-none text-ink-3" aria-hidden />
            <span className="truncate">{label}</span>
          </label>
          <input
            id={inputId(key)}
            type="number"
            inputMode="decimal"
            step="any"
            min={0}
            max={MAX_AMOUNT}
            placeholder="–"
            onBeforeInput={numbersOnly}
            value={values[key]}
            onChange={capAtMax((e) => onChange({ ...values, [key]: e.target.value }))}
            className="h-10 w-24 rounded-xl border border-line bg-surface-2 px-2.5 text-right text-base font-semibold tabular-nums placeholder:text-ink-3 user-invalid:border-2 user-invalid:border-danger"
          />
          <span className="w-6 text-[13px] text-ink-2">{unit}</span>
          <button
            type="button"
            aria-label={`Remove ${label}`}
            onClick={() => remove(key)}
            className="-mr-2 grid size-10 flex-none place-items-center rounded-xl text-ink-3 hover:bg-surface-2"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      ))}

      {remaining.length > 0 && (
        // value="" keeps it a button: it never shows a choice, each pick just adds a row.
        <Select value="" onValueChange={(v) => add(v as MicroKey)}>
          <SelectTrigger
            aria-label="Add micronutrient"
            className="my-1 min-h-11 w-full justify-center gap-1.5 border-0 bg-transparent text-[13px] font-bold text-primary-ink hover:bg-primary-50 [&>svg:last-child]:hidden"
          >
            <Plus size={16} aria-hidden />
            Add micronutrient
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="max-h-80"
            onCloseAutoFocus={(e) => {
              if (!justAdded.current) return
              e.preventDefault()
              document.getElementById(inputId(justAdded.current))?.focus()
              justAdded.current = null
            }}
          >
            {remaining.map(({ key, label, unit, icon: Icon }) => (
              <SelectItem key={key} value={key}>
                <Icon size={16} className="text-ink-3" aria-hidden />
                {label}
                <span className="font-medium text-ink-3">{unit}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </section>
  )
}
