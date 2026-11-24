import type { SplitDay } from '@/services/WorkoutService/types/Workout'

// "Upper", or "Day 2" for a training day left unnamed (the 2nd training day of the week).
export const dayLabel = (days: (SplitDay | null)[], i: number) =>
  days[i]?.name.trim() || `Day ${days.slice(0, i + 1).filter(Boolean).length}`
