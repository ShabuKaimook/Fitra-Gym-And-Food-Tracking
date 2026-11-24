import type { DateKey } from '@/utils/date'

// Every key starts with its resource name, so invalidating ['calories'] refreshes every calories range.
export const QUERY_KEYS = {
  calories: (from: DateKey, to: DateKey) => ['calories', from, to] as const,
  macros: (from: DateKey, to: DateKey) => ['macros', from, to] as const,
  micronutrients: (from: DateKey, to: DateKey) => ['micronutrients', from, to] as const,
  water: (date: DateKey) => ['water', date] as const,
  sleep: (date: DateKey) => ['sleep', date] as const,
  weight: (date: DateKey) => ['weight', date] as const,
  weightBefore: (date: DateKey) => ['weight', 'before', date] as const,
  waist: (date: DateKey) => ['waist', date] as const,
  waistBefore: (date: DateKey) => ['waist', 'before', date] as const,
  energy: (date: DateKey) => ['energy', date] as const,
  recovery: (date: DateKey) => ['recovery', date] as const,
  note: (date: DateKey) => ['note', date] as const,
  activity: (date: DateKey) => ['activity', date] as const,
  plannedWorkout: (date: DateKey) => ['planned-workout', date] as const,
  activePlan: ['active-plan'] as const,
  splits: ['splits'] as const,
  templates: ['templates'] as const,
  lastSession: (date: DateKey) => ['sessions', 'last-before', date] as const,
  meals: ['meals'] as const,
  units: ['units'] as const,
  foods: ['foods'] as const,
  foodSearch: (query: string) => ['foods', 'search', query] as const,
  recentFoods: ['foods', 'recent'] as const,
  food: (id: string) => ['foods', 'id', id] as const,
}
