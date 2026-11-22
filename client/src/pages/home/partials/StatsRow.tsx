import type { DailyWater } from '@/services/FoodService/types/Food'
import type { DailyActivity, DailySleep, DailyWeight } from '@/services/HealthService/types/Health'
import type { Loadable } from '@/types/Loadable'
import { Droplets, Footprints, Moon, Scale } from 'lucide-react'
import { useSetSteps } from '@/hooks/queries/useActivity'
import { useSetSleep } from '@/hooks/queries/useSleep'
import { useSetWater } from '@/hooks/queries/useWater'
import { MetricTile } from './MetricTile'
import { row } from './ui'

type Props = {
  date: Date
  activity: Loadable<DailyActivity | null>
  water: Loadable<DailyWater | null>
  sleep: Loadable<DailySleep | null>
  weight: Loadable<DailyWeight | null>
}

const formatSleep = (min: number) => `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`

// Steps, water, sleep (hours and quality) and weight tiles. null data → the tile's "Not recorded" state.
export const StatsRow = ({ date, activity, water, sleep, weight }: Props) => {
  const act = activity.data
  const wat = water.data
  const slp = sleep.data
  const setSteps = useSetSteps(date)
  const setWater = useSetWater(date)
  const setSleep = useSetSleep(date)

  return (
    <div className={`${row} lg:grid-cols-4 lg:gap-3`}>
      <MetricTile
        loading={activity.isPending}
        area="[grid-area:steps]"
        label="Steps"
        icon={Footprints}
        tone="activity"
        value={act ? act.steps.toLocaleString() : null}
        target={act?.stepsTarget.toLocaleString()}
        progress={act ? { value: act.steps, max: act.stepsTarget } : undefined}
        addLabel="Add steps"
        edit={{
          title: 'Edit steps',
          rows: [[{ name: 'steps', label: 'Steps', max: 100000 }]],
          initial: act ? { steps: String(act.steps) } : undefined,
          saving: setSteps.isPending,
          save: (v) => setSteps.mutateAsync(v.steps),
        }}
      />
      <MetricTile
        loading={water.isPending}
        area="[grid-area:water]"
        label="Water"
        icon={Droplets}
        tone="water"
        value={wat ? wat.liters.toFixed(1) : null}
        target={wat ? `${wat.target} L` : undefined}
        progress={wat ? { value: wat.liters, max: wat.target } : undefined}
        addLabel="Add water"
        edit={{
          title: 'Edit water',
          rows: [[{ name: 'liters', label: 'Water', unit: 'L', max: 10, step: 0.01 }]],
          initial: wat ? { liters: String(wat.liters) } : undefined,
          saving: setWater.isPending,
          save: (v) => setWater.mutateAsync(v.liters),
        }}
      />
      <MetricTile
        loading={sleep.isPending}
        area="[grid-area:sleep]"
        label="Sleep"
        icon={Moon}
        tone="sleep"
        value={slp ? formatSleep(slp.minutes) : null}
        target={slp ? formatSleep(slp.target) : undefined}
        detail={slp ? `Quality ${slp.quality === null ? '–' : `${slp.quality}/10`}` : undefined}
        progress={slp ? { value: slp.minutes, max: slp.target } : undefined}
        addLabel="Add sleep"
        edit={{
          title: 'Edit sleep',
          rows: [
            [
              { name: 'hours', label: 'Hours', unit: 'h', max: 24 },
              { name: 'minutes', label: 'Minutes', unit: 'm', max: 59 },
            ],
            [{ name: 'quality', label: 'Quality', unit: '/ 10', min: 1, max: 10 }],
          ],
          initial: slp
            ? {
                hours: String(Math.floor(slp.minutes / 60)),
                minutes: String(slp.minutes % 60),
                ...(slp.quality !== null && { quality: String(slp.quality) }),
              }
            : undefined,
          saving: setSleep.isPending,
          save: (v) => setSleep.mutateAsync({ minutes: v.hours * 60 + v.minutes, quality: v.quality }),
        }}
      />
      <MetricTile
        loading={weight.isPending}
        area="[grid-area:weight]"
        label="Weight"
        icon={Scale}
        value={weight.data ? `${weight.data.kg} kg` : null}
        addLabel="Add"
      />
    </div>
  )
}
