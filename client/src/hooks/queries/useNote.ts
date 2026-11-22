import { QUERY_KEYS } from '@/constants/queryKeys'
import { HealthService } from '@/services/HealthService'
import { toDateKey } from '@/utils/date'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// The note written for `date`. data null = no note.
export const useNote = (date: Date) => {
  const key = toDateKey(date)
  return useQuery({
    queryKey: QUERY_KEYS.note(key),
    queryFn: ({ signal }) => HealthService.getNote(key, { signal }),
  })
}

// Replaces the day's note.
export const useSetNote = (date: Date) => {
  const key = toDateKey(date)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => HealthService.setNote({ date: key, text }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.note(key) }),
  })
}
