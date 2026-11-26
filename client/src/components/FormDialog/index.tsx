import { Button } from '@/components/Button'
import { Field, input } from '@/components/Form'
import { useInlineValidation } from '@/hooks/useInlineValidation'
import { capAtMax, numbersOnly } from '@/utils/numbersOnly'
import { X } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

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

// Modal with number fields laid out in rows: centred, or on phones a sheet resting on the keyboard.
// Native <dialog> gives focus trapping, Esc and an inert page. Mount it only while open: it opens on
// mount, and onClose is the parent's cue to unmount.
export const FormDialog = ({ title, rows, initial = {}, submitLabel = 'Save', saving, onSave, onClose }: Props) => {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [values, setValues] = useState(initial)
  const { attach, message, clear } = useInlineValidation()

  // Layout effect: still inside the tap that opened it, which iOS needs before focus() may raise the keyboard.
  useLayoutEffect(() => {
    ref.current?.showModal()
    ref.current?.querySelector('input')?.focus()
  }, [])

  // --kb = how much of the page the keyboard covers, so the phone sheet's bottom sits on top of it.
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () =>
      ref.current?.style.setProperty(
        '--kb',
        `${Math.max(0, document.documentElement.clientHeight - vv.offsetTop - vv.height)}px`,
      )
    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])
  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-[26px] bg-surface p-5 text-ink shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop:animate-fade-in backdrop:bg-ink/40 motion-reduce:backdrop:animate-none max-sm:mt-auto max-sm:mb-[calc(var(--kb,0px)+8px)] max-sm:w-[calc(100%-1rem)] max-sm:max-w-none"
      // A click on the dialog itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
      onClose={onClose}
    >
      <form
        ref={attach}
        className="flex flex-col gap-4"
        onInput={clear}
        onSubmit={(e) => {
          e.preventDefault()
          onSave(Object.fromEntries(rows.flat().map(({ name }) => [name, Number(values[name])])))
        }}
      >
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="m-0 text-[19px] font-extrabold tracking-[-0.5px]">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="-mr-2 grid size-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2"
            onClick={close}
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {rows.map((row, i) => (
          <div key={i} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>
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
    </dialog>
  )
}
