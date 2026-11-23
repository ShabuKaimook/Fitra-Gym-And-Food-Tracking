import { WeekStrip } from '@/components/WeekStrip'
import { useActivity } from '@/hooks/queries/useActivity'
import { useCalories } from '@/hooks/queries/useCalories'
import { useEnergy } from '@/hooks/queries/useEnergy'
import { useMacros } from '@/hooks/queries/useMacros'
import { useMicronutrients } from '@/hooks/queries/useMicronutrients'
import { useNote } from '@/hooks/queries/useNote'
import { usePlannedWorkout } from '@/hooks/queries/usePlannedWorkout'
import { useRecovery } from '@/hooks/queries/useRecovery'
import { useSleep } from '@/hooks/queries/useSleep'
import { usePreviousWaist, useWaist } from '@/hooks/queries/useWaist'
import { useWater } from '@/hooks/queries/useWater'
import { usePreviousWeight, useWeight } from '@/hooks/queries/useWeight'
import { useSelectedDate } from './hooks/useSelectedDate'
import { CheckInRow } from './partials/CheckInRow'
import { DayHeader } from './partials/DayHeader'
import { NutritionRow } from './partials/NutritionRow'
import { StatsRow } from './partials/StatsRow'
import { WorkoutNotesRow } from './partials/WorkoutNotesRow'

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
  const previousWeight = usePreviousWeight(date)
  const waist = useWaist(date)
  const previousWaist = usePreviousWaist(date)
  const energy = useEnergy(date)
  const recovery = useRecovery(date)
  const note = useNote(date)
  const workout = usePlannedWorkout(date)
  // shortcut: no error states yet (mock data can't fail); add retry UI when the services call the API.

  return (
    <div className="flex flex-col gap-4">
      <DayHeader date={date} isToday={isToday} />

      <WeekStrip date={date} today={today} onSelect={select} />

      {/* Mobile: one 2-column grid, the row wrappers dissolve and areas set the order. Desktop: rows of
          calories | micros, steps water sleep cardio, weight waist energy recovery, workout | notes. */}
      <div className="grid grid-cols-2 gap-3 [grid-template-areas:'cal_cal'_'steps_water'_'micro_micro'_'sleep_sleep'_'weight_waist'_'energy_recovery'_'note_note'_'workout_workout'] lg:flex lg:flex-col lg:gap-3.5">
        <NutritionRow calories={calories} macros={macros} micros={micros} />
        <StatsRow date={date} activity={activity} water={water} sleep={sleep} />
        <CheckInRow
          date={date}
          weight={weight}
          previousWeight={previousWeight}
          waist={waist}
          previousWaist={previousWaist}
          energy={energy}
          recovery={recovery}
        />
        <WorkoutNotesRow date={date} isToday={isToday} workout={workout} note={note} />
      </div>
    </div>
  )
}

export default HomePage
