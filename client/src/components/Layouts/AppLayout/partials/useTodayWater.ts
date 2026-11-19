import { useAddWater, useWater } from '@/hooks/queries/useWater'
import { startOfToday } from '@/utils/date'

// Today's water line and the one-tap add used by both logging hubs.
export const useTodayWater = () => {
  const today = startOfToday()
  const water = useWater(today)
  const add = useAddWater(today)

  const status = add.isError
    ? 'Not saved, try again'
    : water.isPending
      ? ''
      : water.data
        ? `${water.data.liters.toFixed(1)} / ${water.data.target} L today`
        : 'Not recorded today'

  return { status, add: add.mutate, adding: add.isPending }
}
