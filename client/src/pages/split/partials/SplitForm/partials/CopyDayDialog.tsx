import { Button } from '@/components/Button'
import type { SplitDay } from '@/services/WorkoutService/types/Workout'
import { WEEKDAYS } from '@/utils/date'
import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { dayLabel } from '@/pages/split/split'

type Props = {
  days: (SplitDay | null)[]
  /** The weekday being copied. */
  from: number
  onCopy: (to: number[]) => void
  onClose: () => void
}

// Pick the other weekdays to copy a day's name and exercises to. A rest day becomes a training day; a
// day that already has exercises says what it loses. Mount it only while open: it opens on mount.
export const CopyDayDialog = ({ days, from, onCopy, onClose }: Props) => {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [to, setTo] = useState<number[]>([])
  useEffect(() => ref.current?.showModal(), [])
  const close = () => ref.current?.close()

  const source = `${WEEKDAYS[from]}, ${dayLabel(days, from)}`
  const count = days[from]!.exerciseIds.length
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // Same look as FormDialog: centred, or a sheet near the bottom on phones.
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-[26px] bg-surface p-5 text-ink shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop:bg-ink/40 max-sm:mt-auto max-sm:mb-2 max-sm:w-[calc(100%-1rem)] max-sm:max-w-none"
      // A click on the dialog itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
      onClose={onClose}
    >
      {/* No <form>: this dialog renders inside the split form, and a nested form would submit (reload) the page. */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id={titleId} className="m-0 text-[19px] font-extrabold tracking-[-0.5px]">
              Copy to other days
            </h2>
            <p className="m-0 text-[13px] text-ink-2">
              {source}, {count} exercise{count === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="-mr-2 grid size-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2"
            onClick={close}
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <fieldset className="m-0 flex flex-col border-0 p-0">
          <legend className="sr-only">Days to copy to</legend>
          {days.map((day, i) => {
            if (i === from) return null
            const replaced = day?.exerciseIds.length ?? 0
            return (
              <label
                key={WEEKDAYS[i]}
                className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-line-soft last:border-b-0"
              >
                <input
                  type="checkbox"
                  className="size-5 flex-none accent-primary"
                  checked={to.includes(i)}
                  onChange={() => setTo((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]))}
                />
                <span className="w-10 text-sm font-extrabold">{WEEKDAYS[i]}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">
                  {day ? dayLabel(days, i) : 'Rest'}
                </span>
                {to.includes(i) && replaced > 0 && (
                  <span className="flex-none text-xs font-semibold text-primary-ink">
                    replaces {replaced} exercise{replaced === 1 ? '' : 's'}
                  </span>
                )}
              </label>
            )
          })}
        </fieldset>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            disabled={to.length === 0}
            onClick={() => {
              onCopy(to)
              close()
            }}
          >
            {to.length > 1 ? `Copy to ${to.length} days` : to.length === 1 ? `Copy to ${WEEKDAYS[to[0]]}` : 'Copy'}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
