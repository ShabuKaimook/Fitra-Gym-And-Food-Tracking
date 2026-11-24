import type { PlanScheduleEntry, SplitDay, TrainingPlan } from './types/Workout'

// The plan's schedule after taking a split's new days. Weeks already played keep what they had:
// - active: the new days start next week; the week in progress stays as it began.
// - upcoming: nothing is played yet, so the new days are the whole plan.
// - finished: unchanged.
export const planScheduleAfter = (plan: TrainingPlan, days: (SplitDay | null)[]): PlanScheduleEntry[] => {
  const copy = days.map((d) => d && { ...d, exerciseIds: [...d.exerciseIds] })
  if (plan.status === 'finished') return plan.schedule
  if (plan.status === 'upcoming') return [{ fromWeek: 1, days: copy }]
  const fromWeek = plan.currentWeek + 1
  // An earlier update for the same week (or later) is replaced, not stacked.
  return [...plan.schedule.filter((e) => e.fromWeek < fromWeek), { fromWeek, days: copy }]
}
