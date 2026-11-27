import { Badge } from '@/components/Badge'
import { ListItem } from '@/components/ListItem'
import { Button } from '@/components/Button'
import type { TrainingPlan } from '@/services/WorkoutService/types/Workout'
import { Dialog } from '@/components/Dialog'
import { useState } from 'react'

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
  const [picked, setPicked] = useState<string[]>([])
  // Which button saved, so only that one shows the spinner.
  const [withPlans, setWithPlans] = useState(false)

  return (
    <Dialog
      title="Update plans too?"
      subtitle={`${plans.length === 1 ? '1 plan uses' : `${plans.length} plans use`} ${splitName}. Pick which ones get your changes.`}
      onClose={onClose}
      className="max-w-md"
    >
      <fieldset className="m-0 flex flex-col border-0 p-0" aria-label="Plans to update">
        {plans.map((p) => {
          const can = canUpdate(p)
          return (
            <ListItem
              key={p.id}
              as="label"
              className={`min-h-14 border-b border-line-soft last:border-b-0 ${can ? 'cursor-pointer' : 'opacity-60'}`}
              start={
                <input
                  type="checkbox"
                  className="size-5 flex-none accent-primary"
                  disabled={!can}
                  checked={picked.includes(p.id)}
                  onChange={() => setPicked((ps) => (ps.includes(p.id) ? ps.filter((x) => x !== p.id) : [...ps, p.id]))}
                />
              }
              title={p.name}
              badge={p.status === 'active' && <Badge tone="activity">Active</Badge>}
              subtitle={effect(p)}
            />
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
          {saving && !withPlans ? 'Saving' : 'Split only'}
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
            : picked.length === 0
              ? 'Update plans'
              : `Update ${picked.length} plan${picked.length === 1 ? '' : 's'}`}
        </Button>
      </div>
    </Dialog>
  )
}
