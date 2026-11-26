import { Button } from '@/components/Button'
import type { SplitDay } from '@/services/WorkoutService/types/Workout'
import { WEEKDAYS } from '@/utils/date'
import { Dialog } from '@/components/Dialog'
import { useState } from 'react'
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
  const [to, setTo] = useState<number[]>([])

  const source = `${WEEKDAYS[from]}, ${dayLabel(days, from)}`
  const count = days[from]!.exerciseIds.length
  return (
    // No <form>: this dialog renders inside the split form, and a nested form would submit (reload) the page.
    <Dialog
      title="Copy to other days"
      subtitle={`${source}, ${count} exercise${count === 1 ? '' : 's'}`}
      onClose={onClose}
    >
      {(close) => (
        <>
          <fieldset className="m-0 flex flex-col border-0 p-0" aria-label="Days to copy to">
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
        </>
      )}
    </Dialog>
  )
}
