import type { DailyWater } from '@/services/FoodService/types/Food'
import type { DailyActivity, DailySleep, DailyWeight } from '@/services/HealthService/types/Health'
import type { Loadable } from '@/types/Loadable'
import { Droplets, Footprints, Moon, Scale } from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'
import { StatTile } from './StatTile'
import { cardSkeleton, row } from './ui'

type Props = {
  activity: Loadable<DailyActivity | null>
  water: Loadable<DailyWater | null>
  sleep: Loadable<DailySleep | null>
  weight: Loadable<DailyWeight | null>
}

const formatSleep = (min: number) => `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`

// Steps, water, sleep and weight tiles. null data → the tile's "Not recorded" state.
export const StatsRow = ({ activity, water, sleep, weight }: Props) => {
  const act = activity.data
  const wat = water.data
  const slp = sleep.data

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
    </div>
  )
}
