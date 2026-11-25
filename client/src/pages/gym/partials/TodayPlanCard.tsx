import { Button } from '@/components/Button'
import type { PlannedWorkout } from '@/services/WorkoutService/types/Workout'
import { muted } from '@/pages/home/partials/ui'
import { Play, Timer } from 'lucide-react'

// How many exercises the card lists before "+3 more".
const SHOWN = 3

// 120 → "2:00", 90 → "90s": two minutes or more reads as a clock, less as seconds (as in 1e).
const formatRest = (s: number) => (s >= 120 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s}s`)

const hero =
  'flex flex-col gap-1.5 rounded-[28px] border border-primary-100 bg-linear-120 from-primary-50 to-surface to-72% p-4.5 lg:px-5.5'

// Today's planned workout (1e). Mobile: names in one line. Desktop: sets, reps and rest per exercise.
// workout null = rest day.
export const TodayPlanCard = ({ workout }: { workout: PlannedWorkout | null }) => {
  if (!workout) {
    return (
      <section className={hero} aria-labelledby="today-title">
        <div className="text-xs font-bold text-primary-ink">Today</div>
        <h2 id="today-title" className="m-0 text-xl font-extrabold tracking-[-0.4px]">
          Rest day
        </h2>
        <p className={`${muted} m-0`}>Nothing planned. Rest up, or start a workout from a template.</p>
      </section>
    )
  }

  const { planDay, exercises } = workout
  const more = exercises.length - SHOWN
  return (
    <section className={hero} aria-labelledby="today-title">
      <div className="text-xs font-bold text-primary-ink">
        Today{planDay && `, week ${planDay.week} day ${planDay.day}`}
      </div>
      <h2 id="today-title" className="m-0 text-xl font-extrabold tracking-[-0.4px] lg:text-[22px]">
        {workout.name}
      </h2>

      <p className={`${muted} m-0 lg:hidden`}>
        {exercises
          .slice(0, SHOWN)
          .map((e) => e.name)
          .join(', ')}
        {more > 0 && ` and ${more} more`}
      </p>

      <table className="my-1.5 border-collapse text-[13px] max-lg:hidden">
        <thead className="sr-only">
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Rest</th>
          </tr>
        </thead>
        <tbody>
          {exercises.slice(0, SHOWN).map((e) => (
            <tr key={e.name} className="text-ink-2 tabular-nums">
              <td className="py-1 pr-4 font-semibold text-ink">{e.name}</td>
              <td className="w-20 py-1">{e.sets} sets</td>
              <td className="w-20 py-1">{e.reps}</td>
              <td className="w-20 py-1">
                <span className="inline-flex items-center gap-1">
                  <Timer size={13} aria-hidden />
                  <span className="sr-only">rest</span>
                  {formatRest(e.restSeconds)}
                </span>
              </td>
            </tr>
          ))}
          {more > 0 && (
            <tr>
              <td className="pt-1 text-ink-2">+{more} more</td>
            </tr>
          )}
        </tbody>
      </table>

      <Button className="mt-1 self-start">
        <Play size={14} aria-hidden />
        Start workout
      </Button>
    </section>
  )
}
