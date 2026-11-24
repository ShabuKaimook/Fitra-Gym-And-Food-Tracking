import { Play } from 'lucide-react'
import type { PlannedWorkout } from '@/services/WorkoutService/types/Workout'
import { btnBase, muted } from './ui'

type Props = { workout: PlannedWorkout; isToday: boolean }

export const WorkoutCard = ({ workout, isToday }: Props) => (
  <section
    className="flex min-w-0 items-center justify-between gap-3 rounded-[28px] border border-primary-100 bg-linear-120 from-primary-50 to-surface to-72% px-4.5 py-4 [grid-area:workout] lg:[grid-area:auto]"
    aria-labelledby="workout-title"
  >
    <div>
      <div className="text-xs font-bold text-primary-ink">{isToday ? "Today's workout" : 'Workout'}</div>
      <h2 id="workout-title" className="m-0 text-xl leading-6.5 font-extrabold tracking-[-0.4px]">
        {workout.name}
      </h2>
      <div className={muted}>
        {workout.exercises.length} exercises, about {workout.minutes} min
      </div>
    </div>
    <button
      type="button"
      className={`${btnBase} min-h-11 rounded-2xl bg-primary px-4 text-sm text-on-primary hover:bg-primary-hover`}
    >
      <Play size={14} aria-hidden />
      Start workout
    </button>
  </section>
)
