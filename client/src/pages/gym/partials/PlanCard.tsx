import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import type { TrainingPlan } from '@/services/WorkoutService/types/Workout'
import { muted } from '@/pages/home/partials/ui'
import { tag } from './ui'

// The active plan (1e) and how far through it you are. Mobile: stacked. Desktop: one row.
// plan null = no plan yet.
export const PlanCard = ({ plan }: { plan: TrainingPlan | null }) => {
  if (!plan) {
    return (
      <Card as="section" className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center">
        <p className={`${muted} m-0 flex-1`}>No active plan. A plan runs a split for a set number of weeks.</p>
        <Button variant="soft" size="sm" className="self-start">
          Create plan
        </Button>
      </Card>
    )
  }

  const progress = `Week ${plan.currentWeek} of ${plan.weeks}`
  return (
    <Card
      as="section"
      aria-label="Active plan"
      className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4 lg:px-5"
    >
      <div className="flex items-center justify-between">
        <span className={`${tag} bg-activity-tint text-activity-ink`}>Active plan</span>
        <Button variant="ghost" size="sm" className="px-1 text-ink-2 hover:bg-transparent hover:text-ink lg:hidden">
          Edit<span className="sr-only"> plan</span>
        </Button>
      </div>
      <div className="min-w-0">
        <h2 className="m-0 truncate text-[15px] font-extrabold">{plan.name}</h2>
        <div className={muted}>
          {plan.split}, {plan.weeks} weeks
        </div>
      </div>
      <div className="flex items-center gap-2.5 lg:max-w-60 lg:flex-1">
        <ProgressBar value={plan.currentWeek} max={plan.weeks} color="var(--color-activity)" className="flex-1" />
        <span className={`${muted} whitespace-nowrap`}>{progress}</span>
      </div>
      <Button variant="outline" size="sm" className="ml-auto max-lg:hidden">
        Edit plan
      </Button>
    </Card>
  )
}
