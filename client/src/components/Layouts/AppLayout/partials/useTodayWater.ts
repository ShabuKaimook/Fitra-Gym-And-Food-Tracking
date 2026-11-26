import { useAddWater, useWater } from '@/hooks/queries/useWater'
import { startOfToday } from '@/utils/date'
import { toast } from 'react-toastify'

// Today's water line and the one-tap add used by both logging hubs. Results show as toasts.
export const useTodayWater = () => {
  const today = startOfToday()
  const water = useWater(today)
  const add = useAddWater(today)

  const status = water.isPending
    ? ''
    : water.data
      ? `${water.data.liters.toFixed(1)} / ${water.data.target} L today`
      : 'Not recorded today'

  const addMl = (ml: number) =>
    add.mutate(ml, {
      onSuccess: () => toast.success(`Added ${ml} ml water`),
      onError: () => toast.error('Water not saved, try again'),
    })

  // addingMl: the amount being saved, so only the button that added it shows the spinner.
  return { status, add: addMl, adding: add.isPending, addingMl: add.isPending ? add.variables : undefined }
}
