import { ROUTE_PATHS } from '@/constants/routePaths'
import { useCreateSplit, usePlansUsingSplit, useUpdatePlansFromSplit, useUpdateSplit } from '@/hooks/queries/useGym'
import type { Split, SplitDay } from '@/services/WorkoutService/types/Workout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { dayLabel } from '@/pages/split/split'

const trainingDay = (): SplitDay => ({ name: '', exerciseIds: [] })
// Starts as Mon / Wed / Fri; the user taps days to change it.
const START: (SplitDay | null)[] = [trainingDay(), null, trainingDay(), null, trainingDay(), null, null]

// State and saving for the split builder (1f): the name, which weekdays train, and each day's name
// and exercises. `selected` is the weekday being edited; it is always a training day.
// `split`: edit it (one of the user's own) or start a copy of it (built-in). None: a new split.
export const useSplitForm = (split?: Split) => {
  const mode = !split ? 'new' : split.kind === 'builtin' ? 'copy' : 'edit'
  const navigate = useNavigate()
  const createSplit = useCreateSplit()
  const updateSplit = useUpdateSplit()
  const updatePlans = useUpdatePlansFromSplit()
  // Only an edit can touch plans: a new split or a copy has none yet.
  const plans = usePlansUsingSplit(mode === 'edit' ? split!.id : undefined)
  const [name, setName] = useState(!split ? '' : mode === 'copy' ? `${split.name} (copy)` : split.name)
  const [days, setDays] = useState(() => (split ? structuredClone(split.days) : START))
  const [selected, setSelected] = useState(() => Math.max(0, days.findIndex(Boolean)))
  const [askingPlans, setAskingPlans] = useState(false)

  const updateDay = (i: number, change: (day: SplitDay) => SplitDay) =>
    setDays((ds) => ds.map((d, j) => (j === i && d ? change(d) : d)))

  // Training ↔ rest. The last training day can't be rested: a split needs one. Resting the
  // selected day moves the selection to the first training day left.
  const toggleDay = (i: number) => {
    const next = days.map((d, j) => (j === i ? (d ? null : trainingDay()) : d))
    if (!next.some(Boolean)) return
    setDays(next)
    if (!next[i] && selected === i) setSelected(next.findIndex(Boolean))
    if (next[i]) setSelected(i)
  }

  const renameDay = (dayName: string) => updateDay(selected, (d) => ({ ...d, name: dayName }))
  const removeExercise = (id: string) =>
    updateDay(selected, (d) => ({ ...d, exerciseIds: d.exerciseIds.filter((e) => e !== id) }))
  const addExercises = (ids: string[]) =>
    updateDay(selected, (d) => ({
      ...d,
      exerciseIds: [...d.exerciseIds, ...ids.filter((id) => !d.exerciseIds.includes(id))],
    }))

  // The selected day's name and exercises onto other weekdays, replacing what they had; a rest day
  // among them becomes a training day.
  const copyDay = (to: number[]) => {
    const source = days[selected]!
    setDays((ds) =>
      ds.map((d, i) => (to.includes(i) ? { name: source.name, exerciseIds: [...source.exerciseIds] } : d)),
    )
  }

  // Unnamed days get the label they show ("Day 2").
  const fields = () => ({ name: name.trim(), days: days.map((d, i) => d && { ...d, name: dayLabel(days, i) }) })
  const done = (message: string) => {
    toast.success(message)
    navigate(ROUTE_PATHS.GYM, { replace: true })
  }
  const notSaved = () => toast.error('Split not saved, try again')

  // An edited split with plans on it asks first (UpdatePlansDialog, then saveEdit); otherwise it saves now.
  const save = () => {
    if (mode !== 'edit') {
      return createSplit.mutate(fields(), { onSuccess: (s) => done(`Saved ${s.name}`), onError: notSaved })
    }
    if (plans.data?.length) return setAskingPlans(true)
    saveEdit([])
  }

  // Saves the split, then gives the picked plans its new days.
  const saveEdit = async (planIds: string[]) => {
    try {
      const saved = await updateSplit.mutateAsync({ ...split!, ...fields() })
      if (planIds.length) await updatePlans.mutateAsync({ splitId: saved.id, planIds })
      setAskingPlans(false)
      done(
        planIds.length
          ? `Saved ${saved.name}, updated ${planIds.length} plan${planIds.length === 1 ? '' : 's'}`
          : `Saved ${saved.name}`,
      )
    } catch {
      notSaved()
    }
  }

  return {
    name,
    setName,
    days,
    selected,
    setSelected,
    day: days[selected]!,
    toggleDay,
    renameDay,
    removeExercise,
    addExercises,
    copyDay,
    mode,
    save,
    // Edit: wait for the plan list, so Save knows whether to ask.
    saving: createSplit.isPending || updateSplit.isPending || updatePlans.isPending || plans.isLoading,
    plans: plans.data ?? [],
    askingPlans,
    closePlans: () => setAskingPlans(false),
    saveEdit,
  }
}
