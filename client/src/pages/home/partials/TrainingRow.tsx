import type { DailyActivity } from '@/services/HealthService/types/Health'
import type { PlannedWorkout } from '@/services/WorkoutService/types/Workout'
import type { Loadable } from '@/types/Loadable'
import { Bike } from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'
import { StatTile } from './StatTile'
import { WorkoutCard } from './WorkoutCard'
import { cardSkeleton, row } from './ui'

type Props = {
  workout: Loadable<PlannedWorkout | null>
  activity: Loadable<DailyActivity | null>
  isToday: boolean
}

// Planned workout (hidden on rest days) and cardio. Cardio is desktop only: wireframe 1a leaves it out on mobile.
export const TrainingRow = ({ workout, activity, isToday }: Props) => {
  const minutes = activity.data?.cardioMinutes

  return (
    <div className={`${row} lg:grid-cols-[1.25fr_1fr]`}>
      {workout.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-24 [grid-area:workout]`} />
      ) : (
        workout.data && <WorkoutCard workout={workout.data} isToday={isToday} />
      )}
      {activity.isPending ? (
        <Skeleton className={`${cardSkeleton} min-h-28 max-lg:hidden`} />
      ) : (
        <StatTile
          className="max-lg:hidden"
          label="Cardio"
          icon={Bike}
          value={minutes ? `${minutes} min` : null}
          addLabel="Add cardio"
        />
      )}
    </div>
  )
}
