import { inputBase } from '@/components/Form'
import type { Exercise, SplitDay } from '@/services/WorkoutService/types/Workout'
import { WEEKDAYS } from '@/utils/date'
import { ScrollRail } from '@/components/ScrollRail'
import { Copy, Plus, X } from 'lucide-react'
import { useId, useState } from 'react'
import { dayLabel } from '@/pages/split/split'
import { CopyDayDialog } from './CopyDayDialog'
import { ExerciseThumb } from './ExerciseThumb'

type Props = {
  days: (SplitDay | null)[]
  selected: number
  onSelect: (i: number) => void
  label: string
  exercises: Map<string, Exercise>
  onRename: (name: string) => void
  onRemove: (id: string) => void
  /** Mobile: opens the picker sheet. Desktop has the picker beside the day instead. */
  onAddExercises: () => void
  onCopy: (to: number[]) => void
}

// Tabs for the training days, then the selected day: its name and exercises.
export const DayEditor = ({
  days,
  selected,
  onSelect,
  label,
  exercises,
  onRename,
  onRemove,
  onAddExercises,
  onCopy,
}: Props) => {
  const day = days[selected]!
  const weekday = WEEKDAYS[selected]
  const nameId = useId()
  const [copying, setCopying] = useState(false)
  return (
    <section aria-label={`${weekday}, ${label}`} className="flex flex-col gap-2.5">
      <ScrollRail role="tablist" label="Training days" scrollLabel="More days" watch={days} rowClassName="gap-2">
        {days.map((d, i) =>
          d ? (
            <button
              key={WEEKDAYS[i]}
              type="button"
              role="tab"
              aria-selected={i === selected}
              onClick={() => onSelect(i)}
              className={`flex min-h-11 flex-none snap-start items-baseline gap-1.5 rounded-2xl border px-4 py-2.5 ${
                i === selected
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-line bg-surface text-ink-2 hover:bg-surface-2'
              }`}
            >
              <b className="text-[15px] font-extrabold">{WEEKDAYS[i]}</b>
              <span className="max-w-28 truncate text-[13px] font-semibold">{dayLabel(days, i)}</span>
            </button>
          ) : null,
        )}
      </ScrollRail>

      <div className="flex flex-col rounded-[20px] border border-line/80 bg-surface px-3.5 py-1">
        <div className="flex flex-col gap-1.5 border-b border-line-soft py-2.5">
          <div className="flex items-center justify-between">
            <label htmlFor={nameId} className="text-[13px] font-bold text-ink-2">
              {weekday} name
            </label>
            <button
              type="button"
              onClick={() => setCopying(true)}
              className="-my-1 inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-bold text-primary-ink hover:bg-primary-50"
            >
              <Copy size={14} aria-hidden />
              Copy to
            </button>
          </div>
          <input
            id={nameId}
            className={`${inputBase} min-h-10 text-sm font-bold`}
            value={day.name}
            placeholder={label}
            maxLength={40}
            onChange={(e) => onRename(e.target.value)}
          />
        </div>
        {day.exerciseIds.length === 0 ? (
          <p className="m-0 py-4 text-center text-[13px] text-ink-2">No exercises yet</p>
        ) : (
          <ul className="m-0 list-none p-0">
            {day.exerciseIds.map((id) => {
              const ex = exercises.get(id)
              return (
                <li key={id} className="flex items-center gap-3 border-b border-line-soft py-2.5 last:border-b-0">
                  <ExerciseThumb />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13px] font-extrabold">{ex?.name ?? id}</span>
                    {ex && (
                      <span className="text-xs text-ink-2">
                        {ex.muscle}, {ex.equipment.toLowerCase()}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${ex?.name ?? id}`}
                    onClick={() => onRemove(id)}
                    className="grid size-9 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onAddExercises}
        className="flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-dashed border-primary-100 bg-primary-50/50 text-sm font-extrabold text-primary-ink hover:bg-primary-50 lg:hidden"
      >
        <Plus size={16} aria-hidden />
        Add exercises to {weekday}
      </button>
      <p className="m-0 text-center text-xs text-ink-2">Sets, reps and rest are set in the plan</p>
      {copying && <CopyDayDialog days={days} from={selected} onCopy={onCopy} onClose={() => setCopying(false)} />}
    </section>
  )
}
