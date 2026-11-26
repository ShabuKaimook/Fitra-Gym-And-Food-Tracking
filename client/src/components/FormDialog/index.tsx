import { Button } from '@/components/Button'
import { Field, input } from '@/components/Form'
import { useInlineValidation } from '@/hooks/useInlineValidation'
import { capAtMax, numbersOnly } from '@/utils/numbersOnly'
import { Dialog } from '@/components/Dialog'
import { useState } from 'react'

export type DialogField = {
  name: string
  label: string
  unit?: string
  max: number
  /** Default 0 */
  min?: number
  /** Default 1 (whole numbers); e.g. 0.01 for litres */
  step?: number
}

type Props = {
  title: string
  /** Each inner array is one row; its fields share the row equally. [[a, b], [c]] → a | b, then c. */
  rows: DialogField[][]
  /** Starting text per field name; missing = blank */
  initial?: Record<string, string>
  submitLabel?: string
  saving?: boolean
  /** Every field is required, so all names are present. */
  onSave: (values: Record<string, number>) => void
  onClose: () => void
}

// Dialog with number fields laid out in rows. Mount it only while open: it opens on mount, and onClose
// is the parent's cue to unmount.
export const FormDialog = ({ title, rows, initial = {}, submitLabel = 'Save', saving, onSave, onClose }: Props) => {
  const [values, setValues] = useState(initial)
  const { attach, message, clear } = useInlineValidation()

  return (
    <Dialog title={title} onClose={onClose}>
      {(close) => (
        <form
          ref={attach}
          className="flex flex-col gap-4"
          onInput={clear}
          onSubmit={(e) => {
            e.preventDefault()
            onSave(Object.fromEntries(rows.flat().map(({ name }) => [name, Number(values[name])])))
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
            >
              {row.map(({ name, label, unit, max, min = 0, step = 1 }) => (
                <Field key={name} label={label} unit={unit}>
                  <input
                    type="number"
                    inputMode={step < 1 ? 'decimal' : 'numeric'}
                    onBeforeInput={numbersOnly}
                    min={min}
                    max={max}
                    step={step}
                    required
                    value={values[name] ?? ''}
                    onChange={capAtMax((e) => setValues((v) => ({ ...v, [name]: e.target.value })))}
                    className={input}
                  />
                </Field>
              ))}
            </div>
          ))}

          {message && (
            <p role="alert" className="m-0 text-[13px] font-semibold text-danger">
              {message}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {submitLabel}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
