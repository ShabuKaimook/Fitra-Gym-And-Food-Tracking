import { Button } from '@/components/Button'
import type { TrainingPlan } from '@/services/WorkoutService/types/Workout'
import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

type Props = {
  splitName: string
  plans: TrainingPlan[]
  saving: boolean
  /** Saves the split and gives these plans its new days ([] = the split only). */
  onSave: (planIds: string[]) => void
  onClose: () => void
}

// What saving would do to each plan: weeks already played never change.
const effect = (p: TrainingPlan) =>
  p.status === 'finished'
    ? 'Finished, stays as it was'
    : p.status === 'upcoming'
      ? `Not started: all ${p.weeks} weeks`
      : p.currentWeek >= p.weeks
        ? 'Last week: nothing left to change'
        : `From week ${p.currentWeek + 1} (weeks 1–${p.currentWeek} stay as played)`

const canUpdate = (p: TrainingPlan) => p.status !== 'finished' && p.currentWeek < p.weeks

// Asked when saving an edited split that plans use: pick which plans take the change. Mount only while
// open. No <form>: it renders inside the split form, and a nested form would submit (reload) the page.
export const UpdatePlansDialog = ({ splitName, plans, saving, onSave, onClose }: Props) => {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [picked, setPicked] = useState<string[]>([])
  // Which button saved, so only that one shows the spinner.
  const [withPlans, setWithPlans] = useState(false)
  useEffect(() => ref.current?.showModal(), [])
  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // Same look as FormDialog: centred, or a sheet near the bottom on phones.
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[26px] bg-surface p-5 text-ink shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop:bg-ink/40 max-sm:mt-auto max-sm:mb-2 max-sm:w-[calc(100%-1rem)] max-sm:max-w-none"
      // A click on the dialog itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id={titleId} className="m-0 text-[19px] font-extrabold tracking-[-0.5px]">
              Update plans too?
            </h2>
            <p className="m-0 text-[13px] text-ink-2">
              {plans.length === 1 ? '1 plan uses' : `${plans.length} plans use`} {splitName}. Pick the ones that should
              follow your changes.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="-mr-2 grid size-9 flex-none place-items-center rounded-full text-ink-2 hover:bg-surface-2"
            onClick={close}
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <fieldset className="m-0 flex flex-col border-0 p-0">
          <legend className="sr-only">Plans to update</legend>
          {plans.map((p) => {
            const can = canUpdate(p)
            return (
              <label
                key={p.id}
                className={`flex min-h-14 items-center gap-3 border-b border-line-soft py-2 last:border-b-0 ${can ? 'cursor-pointer' : 'opacity-60'}`}
              >
                <input
                  type="checkbox"
                  className="size-5 flex-none accent-primary"
                  disabled={!can}
                  checked={picked.includes(p.id)}
                  onChange={() => setPicked((ps) => (ps.includes(p.id) ? ps.filter((x) => x !== p.id) : [...ps, p.id]))}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-1.5 text-sm font-extrabold">
                    <span className="truncate">{p.name}</span>
                    {p.status === 'active' && (
                      <span className="flex-none rounded-full bg-activity-tint px-1.5 py-0.5 text-[10px] font-bold text-activity-ink">
                        Active
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-ink-2">{effect(p)}</span>
                </span>
              </label>
            )
          })}
        </fieldset>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            loading={saving && !withPlans}
            disabled={saving}
            onClick={() => {
              setWithPlans(false)
              onSave([])
            }}
            className="whitespace-normal"
          >
            {saving && !withPlans ? 'Saving' : 'Save split only'}
          </Button>
          <Button
            loading={saving && withPlans}
            disabled={saving || picked.length === 0}
            onClick={() => {
              setWithPlans(true)
              onSave(picked)
            }}
            className="whitespace-normal"
          >
            {saving && withPlans
              ? 'Saving'
              : `Save and update ${picked.length || ''} plan${picked.length === 1 ? '' : 's'}`}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
