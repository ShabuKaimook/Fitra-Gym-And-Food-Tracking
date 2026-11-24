import { describe, expect, test } from 'bun:test'
import { planScheduleAfter } from './plans'
import type { TrainingPlan } from './types/Workout'

const oldDays = [{ name: 'Upper', exerciseIds: ['bench-press'] }, null]
const newDays = [{ name: 'Upper', exerciseIds: ['bench-press', 'pull-up'] }, null]
const plan = (status: TrainingPlan['status'], currentWeek = 3): TrainingPlan => ({
  id: 'p',
  name: 'Plan',
  splitId: 's',
  split: 'S',
  status,
  weeks: 8,
  currentWeek,
  schedule: [{ fromWeek: 1, days: oldDays }],
})

describe('planScheduleAfter', () => {
  test('active: played weeks keep the old days, new days start next week', () => {
    expect(planScheduleAfter(plan('active', 3), newDays)).toEqual([
      { fromWeek: 1, days: oldDays },
      { fromWeek: 4, days: newDays },
    ])
  })

  test('active: a second update for the same week replaces the first', () => {
    const once = { ...plan('active', 3), schedule: planScheduleAfter(plan('active', 3), oldDays) }
    expect(planScheduleAfter(once, newDays)).toEqual([
      { fromWeek: 1, days: oldDays },
      { fromWeek: 4, days: newDays },
    ])
  })

  test('upcoming: the new days are the whole plan', () => {
    expect(planScheduleAfter(plan('upcoming', 0), newDays)).toEqual([{ fromWeek: 1, days: newDays }])
  })

  test('finished: unchanged', () => {
    const p = plan('finished', 8)
    expect(planScheduleAfter(p, newDays)).toBe(p.schedule)
  })

  test('copies the days, so later edits to the split do not leak in', () => {
    const days = [{ name: 'Upper', exerciseIds: ['bench-press'] }]
    const [entry] = planScheduleAfter(plan('upcoming', 0), days)
    days[0].exerciseIds.push('pull-up')
    expect(entry.days[0]?.exerciseIds).toEqual(['bench-press'])
  })
})
