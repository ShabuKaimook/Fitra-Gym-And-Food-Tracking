import { WeekStrip } from '@/components/WeekStrip'
import { useActivity } from '@/hooks/queries/useActivity'
import { useCalories } from '@/hooks/queries/useCalories'
import { useMacros } from '@/hooks/queries/useMacros'
import { useMicronutrients } from '@/hooks/queries/useMicronutrients'
import { usePlannedWorkout } from '@/hooks/queries/usePlannedWorkout'
import { useSleep } from '@/hooks/queries/useSleep'
import { useWater } from '@/hooks/queries/useWater'
import { useWeight } from '@/hooks/queries/useWeight'
import { toDateKey } from '@/utils/date'
import { Bike, Droplets, Footprints, Moon, Scale } from 'lucide-react'
import { useState } from 'react'
import { useSelectedDate } from './hooks/useSelectedDate'
import { CaloriesCard } from './partials/CaloriesCard'
import { CardSkeleton } from './partials/CardSkeleton'
import { MicronutrientsCard } from './partials/MicronutrientsCard'
import { StatTile } from './partials/StatTile'
import { WorkoutCard } from './partials/WorkoutCard'
import { muted } from './partials/ui'

const row = 'contents lg:grid lg:gap-3.5'

// The title already shows the weekday unless it's today.
const formatDate = (d: Date, style: 'short' | 'long', withWeekday: boolean) =>
  d.toLocaleDateString('en-GB', { weekday: withWeekday ? style : undefined, day: 'numeric', month: style })

const formatSleep = (min: number) => `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`

const HomePage = () => {
  const { date, today, isToday, select } = useSelectedDate()

  // Rings cover every week the strip has loaded; it reports that range. Until it does, just the selected day.
  const [range, setRange] = useState<{ from: Date; to: Date } | null>(null)
  const ringCalories = useCalories(range?.from ?? date, range?.to ?? date, { keepPrevious: true })
  const calories = useCalories(date)
  const macros = useMacros(date)
  const micros = useMicronutrients(date)
  const activity = useActivity(date)
  const water = useWater(date)
  const sleep = useSleep(date)
  const weight = useWeight(date)
  const workout = usePlannedWorkout(date)

  // shortcut: no error states yet (mock data can't fail); add retry UI when the services call the API.
  const progressOf = (d: Date) => {
    const c = ringCalories.data?.byDay.get(toDateKey(d))
    return c ? c.eaten / c.target : 0
  }
  const act = activity.data

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-baseline gap-2.5">
        <h1 className="m-0 text-2xl leading-7.5 font-extrabold tracking-[-0.4px] lg:text-[30px] lg:leading-9">
          {isToday ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'long' })}
        </h1>
        <span className={`${muted} lg:hidden`}>{formatDate(date, 'short', isToday)}</span>
        <span className="text-sm text-ink-2 max-lg:hidden">{formatDate(date, 'long', isToday)}</span>
      </header>

      <WeekStrip
        date={date}
        today={today}
        onSelect={select}
        progressOf={progressOf}
        onRangeChange={(from, to) => setRange({ from, to })}
      />

      {/* Mobile: one 2-column grid, the row wrappers dissolve and areas set the order. Desktop: rows. */}
      <div className="grid grid-cols-2 gap-3 [grid-template-areas:'cal_cal'_'steps_water'_'micro_micro'_'sleep_weight'_'workout_workout'] lg:flex lg:flex-col lg:gap-3.5">
        <div className={`${row} lg:grid-cols-[1.25fr_1fr]`}>
          {calories.isPending || macros.isPending ? (
            <CardSkeleton className="min-h-42 [grid-area:cal] lg:min-h-53.5" />
          ) : (
            <CaloriesCard calories={calories.data?.total ?? null} macros={macros.data ?? null} />
          )}
          {micros.isPending ? (
            <CardSkeleton className="min-h-42 [grid-area:micro]" />
          ) : (
            <MicronutrientsCard micros={micros.data ?? []} />
          )}
        </div>

        <div className={`${row} lg:grid-cols-4 lg:gap-3`}>
          {activity.isPending ? (
            <CardSkeleton className="min-h-28 [grid-area:steps]" />
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
            <CardSkeleton className="min-h-28 [grid-area:water]" />
          ) : (
            <StatTile
              className="[grid-area:water] lg:[grid-area:auto]"
              label="Water"
              icon={Droplets}
              tone="water"
              value={water.data ? water.data.liters.toFixed(1) : null}
              target={water.data ? `${water.data.target} L` : undefined}
              progress={water.data ? { value: water.data.liters, max: water.data.target } : undefined}
              addLabel="Add water"
            />
          )}
          {sleep.isPending ? (
            <CardSkeleton className="min-h-28 [grid-area:sleep]" />
          ) : (
            <StatTile
              className="[grid-area:sleep] lg:[grid-area:auto]"
              label="Sleep"
              icon={Moon}
              tone="sleep"
              value={sleep.data ? formatSleep(sleep.data.minutes) : null}
              target={sleep.data ? formatSleep(sleep.data.target) : undefined}
              progress={sleep.data ? { value: sleep.data.minutes, max: sleep.data.target } : undefined}
              addLabel="Add sleep"
            />
          )}
          {weight.isPending ? (
            <CardSkeleton className="min-h-28 [grid-area:weight]" />
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

        <div className={`${row} lg:grid-cols-[1.25fr_1fr]`}>
          {workout.isPending ? (
            <CardSkeleton className="min-h-24 [grid-area:workout]" />
          ) : (
            workout.data && <WorkoutCard workout={workout.data} isToday={isToday} />
          )}
          {activity.isPending ? (
            <CardSkeleton className="min-h-28 max-lg:hidden" />
          ) : (
            <StatTile
              className="max-lg:hidden" // wireframe 1a leaves it out on mobile
              label="Cardio"
              icon={Bike}
              value={act?.cardioMinutes ? `${act.cardioMinutes} min` : null}
              addLabel="Add cardio"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
