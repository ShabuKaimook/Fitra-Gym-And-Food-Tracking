import { WeekStrip } from '@/components/WeekStrip'
import { useActivity } from '@/hooks/queries/useActivity'
import { useCalories } from '@/hooks/queries/useCalories'
import { useMacros } from '@/hooks/queries/useMacros'
import { useMicronutrients } from '@/hooks/queries/useMicronutrients'
import { usePlannedWorkout } from '@/hooks/queries/usePlannedWorkout'
import { useSleep } from '@/hooks/queries/useSleep'
import { useWater } from '@/hooks/queries/useWater'
import { useWeight } from '@/hooks/queries/useWeight'
import { useSelectedDate } from './hooks/useSelectedDate'
import { DayHeader } from './partials/DayHeader'
import { NutritionRow } from './partials/NutritionRow'
import { StatsRow } from './partials/StatsRow'
import { TrainingRow } from './partials/TrainingRow'

// Home (wireframe 1a): the page fetches, each row renders its cards or their skeletons.
const HomePage = () => {
  const { date, today, isToday, select } = useSelectedDate()

  const calories = useCalories(date)
  const macros = useMacros(date)
  const micros = useMicronutrients(date)
  const activity = useActivity(date)
  const water = useWater(date)
  const sleep = useSleep(date)
  const weight = useWeight(date)
  const workout = usePlannedWorkout(date)
  // shortcut: no error states yet (mock data can't fail); add retry UI when the services call the API.

  return (
    <div className="flex flex-col gap-4">
      <DayHeader date={date} isToday={isToday} />

      <WeekStrip date={date} today={today} onSelect={select} />

      {/* Mobile: one 2-column grid, the row wrappers dissolve and areas set the order. Desktop: rows. */}
      <div className="grid grid-cols-2 gap-3 [grid-template-areas:'cal_cal'_'steps_water'_'micro_micro'_'sleep_weight'_'workout_workout'] lg:flex lg:flex-col lg:gap-3.5">
        <NutritionRow calories={calories} macros={macros} micros={micros} />
        <StatsRow date={date} activity={activity} water={water} sleep={sleep} weight={weight} />
        <TrainingRow workout={workout} activity={activity} isToday={isToday} />
      </div>
    </div>
  )
}

export default HomePage
