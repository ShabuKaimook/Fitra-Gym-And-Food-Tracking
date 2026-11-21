import type { DailyWater } from '@/services/FoodService/types/Food'
import type { DailyActivity, DailySleep, DailyWeight } from '@/services/HealthService/types/Health'
import type { Loadable } from '@/types/Loadable'
import { Droplets, Footprints, Moon, Scale } from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'
import { useSetSteps } from '@/hooks/queries/useActivity'
import { useSetWater } from '@/hooks/queries/useWater'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { FormDialog } from '@/components/FormDialog'
import { StatTile } from './StatTile'
import { cardSkeleton, row } from './ui'

type Props = {
  date: Date
  activity: Loadable<DailyActivity | null>
  water: Loadable<DailyWater | null>
  sleep: Loadable<DailySleep | null>
  weight: Loadable<DailyWeight | null>
}

const formatSleep = (min: number) => `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`

// Steps, water, sleep and weight tiles. null data → the tile's "Not recorded" state.
export const StatsRow = ({ date, activity, water, sleep, weight }: Props) => {
  const act = activity.data
  const wat = water.data
  const slp = sleep.data
  const [editing, setEditing] = useState<'steps' | 'water' | null>(null)
  const setSteps = useSetSteps(date)
  const setWater = useSetWater(date)

  const toasts = (what: string) => ({
    onSuccess: () => {
      toast.success(`${what} updated`)
      setEditing(null)
    },
    onError: () => toast.error(`${what} not saved, try again`),
  })

  return (
    <div className={`${row} lg:grid-cols-4 lg:gap-3`}>
      {activity.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-28 [grid-area:steps]`} />
      ) : (
        <StatTile
          className="[grid-area:steps] lg:[grid-area:auto]"
          label="Steps"
          icon={Footprints}
          tone="activity"
          value={act ? act.steps.toLocaleString() : null}
          target={act?.stepsTarget.toLocaleString()}
          progress={act ? { value: act.steps, max: act.stepsTarget } : undefined}
          addLabel="Add steps"
          onEdit={() => setEditing('steps')}
        />
      )}
      {water.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-28 [grid-area:water]`} />
      ) : (
        <StatTile
          className="[grid-area:water] lg:[grid-area:auto]"
          label="Water"
          icon={Droplets}
          tone="water"
          value={wat ? wat.liters.toFixed(1) : null}
          target={wat ? `${wat.target} L` : undefined}
          progress={wat ? { value: wat.liters, max: wat.target } : undefined}
          addLabel="Add water"
          onEdit={() => setEditing('water')}
        />
      )}
      {sleep.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-28 [grid-area:sleep]`} />
      ) : (
        <StatTile
          className="[grid-area:sleep] lg:[grid-area:auto]"
          label="Sleep"
          icon={Moon}
          tone="sleep"
          value={slp ? formatSleep(slp.minutes) : null}
          target={slp ? formatSleep(slp.target) : undefined}
          progress={slp ? { value: slp.minutes, max: slp.target } : undefined}
          addLabel="Add sleep"
        />
      )}
      {weight.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-28 [grid-area:weight]`} />
      ) : (
        <StatTile
          className="[grid-area:weight] lg:[grid-area:auto]"
          label="Weight"
          icon={Scale}
          value={weight.data ? `${weight.data.kg} kg` : null}
          addLabel="Add"
        />
      )}
      {editing === 'steps' && (
        <FormDialog
          title="Edit steps"
          rows={[[{ name: 'steps', label: 'Steps', max: 100000 }]]}
          initial={act ? { steps: String(act.steps) } : undefined}
          saving={setSteps.isPending}
          onSave={(v) => setSteps.mutate(v.steps, toasts('Steps'))}
          onClose={() => setEditing(null)}
        />
      )}
      {editing === 'water' && (
        <FormDialog
          title="Edit water"
          rows={[[{ name: 'liters', label: 'Water', unit: 'L', max: 10, step: 0.01 }]]}
          initial={wat ? { liters: String(wat.liters) } : undefined}
          saving={setWater.isPending}
          onSave={(v) => setWater.mutate(v.liters, toasts('Water'))}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
