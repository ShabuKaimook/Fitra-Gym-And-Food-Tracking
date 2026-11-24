import { QUERY_KEYS } from '@/constants/queryKeys'
import { WorkoutService } from '@/services/WorkoutService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// The plan being followed. data null = none.
export const useActivePlan = () =>
  useQuery({ queryKey: QUERY_KEYS.activePlan, queryFn: ({ signal }) => WorkoutService.getActivePlan({ signal }) })

// The user's splits, their own first.
export const useSplits = () =>
  useQuery({ queryKey: QUERY_KEYS.splits, queryFn: ({ signal }) => WorkoutService.getSplits({ signal }) })

// One split. data null = no such split.
export const useSplit = (id: string) =>
  useQuery({ queryKey: QUERY_KEYS.split(id), queryFn: ({ signal }) => WorkoutService.getSplit(id, { signal }) })

export const useUpdateSplit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: WorkoutService.updateSplit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.splits }),
  })
}

// Plans built on the split, so saving can ask which to update.
export const usePlansUsingSplit = (splitId: string | undefined) =>
  useQuery({
    queryKey: QUERY_KEYS.plansUsingSplit(splitId ?? ''),
    queryFn: ({ signal }) => WorkoutService.getPlansUsingSplit(splitId!, { signal }),
    enabled: splitId !== undefined,
  })

export const useUpdatePlansFromSplit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: WorkoutService.updatePlansFromSplit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans }),
  })
}

export const useCreateSplit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: WorkoutService.createSplit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.splits }),
  })
}

// The exercise library, by name.
export const useExercises = () =>
  useQuery({ queryKey: QUERY_KEYS.exercises, queryFn: ({ signal }) => WorkoutService.getExercises({ signal }) })

export const useTemplates = () =>
  useQuery({ queryKey: QUERY_KEYS.templates, queryFn: ({ signal }) => WorkoutService.getTemplates({ signal }) })

// The last workout finished before `date`. data null = none yet.
export const useLastSession = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.lastSession(key),
    queryFn: ({ signal }) => WorkoutService.getLastSession(key, { signal }),
  })
}
