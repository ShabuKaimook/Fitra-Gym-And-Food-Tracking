import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/Button'
import { ExerciseForm } from '@/components/ExerciseForm'
import type { Exercise } from '@/services/WorkoutService/types/Workout'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

const FORM_ID = 'new-exercise-form'

type Props = {
  /** "Mon, Upper": where the new exercise goes once saved. */
  target: string
  onCreated: (exercise: Exercise) => void
  onClose: () => void
}

// The new exercise form (1n) over the split builder, so the split being built isn't lost. Full screen on
// phones, a large dialog on desktop. Mount it only while open: it opens on mount.
export const NewExerciseSheet = ({ target, onCreated, onClose }: Props) => {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => ref.current?.showModal(), [])
  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      aria-label="New exercise"
      onClose={onClose}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-ink backdrop:bg-ink/40 lg:m-auto lg:h-[90dvh] lg:max-w-5xl lg:rounded-[26px]"
    >
      {/* data-scroll-area: the one place that scrolls while the sheet locks the page. */}
      <div
        data-scroll-area
        className="h-full overflow-y-auto overscroll-contain px-4 pb-[calc(16px+env(safe-area-inset-bottom))] lg:px-6 lg:pb-6"
      >
        <ExerciseForm
          formId={FORM_ID}
          onSaved={(exercise) => {
            onCreated(exercise)
            close()
          }}
          header={(saving) => (
            // Pinned: title and Save stay in reach while the fields scroll under it (canvas background hides them).
            <header className="sticky top-0 z-10 -mx-4 flex items-center gap-2 bg-canvas px-4 py-3 lg:-mx-6 lg:px-6 lg:pt-6 lg:pb-4">
              <IconButton label="Close" size="lg" onClick={close} className="-ml-2">
                <X size={20} aria-hidden />
              </IconButton>
              <div className="min-w-0 flex-1">
                <h2 className="m-0 truncate text-xl font-extrabold tracking-[-0.4px]">New exercise</h2>
                <p className="m-0 truncate text-xs text-ink-2">Saved to your library and added to {target}</p>
              </div>
              <Button type="submit" form={FORM_ID} loading={saving} className="min-h-10">
                {saving ? 'Saving' : 'Save'}
              </Button>
            </header>
          )}
        />
      </div>
    </dialog>
  )
}
