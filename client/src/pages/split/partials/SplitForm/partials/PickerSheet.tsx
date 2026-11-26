import { IconButton } from '@/components/IconButton'
import { X } from 'lucide-react'
import { useEffect, useRef, type ComponentProps } from 'react'
import { ExercisePicker } from './ExercisePicker'

type Props = Omit<ComponentProps<typeof ExercisePicker>, 'header'> & { onClose: () => void }

// Mobile: the picker as a full-screen sheet over the builder (desktop docks it beside the day instead).
// Mount it only while open: it opens on mount, and onClose is the parent's cue to unmount.
export const PickerSheet = ({ onClose, onAdd, ...picker }: Props) => {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => ref.current?.showModal(), [])

  return (
    <dialog
      ref={ref}
      aria-label={`Add to ${picker.target}`}
      onClose={onClose}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-ink backdrop:bg-ink/40"
    >
      <div className="flex h-full flex-col px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <ExercisePicker
          {...picker}
          // Adding is the end of picking: back to the day.
          onAdd={(ids) => {
            onAdd(ids)
            ref.current?.close()
          }}
          header={
            <IconButton label="Close" size="lg" onClick={() => ref.current?.close()} className="-ml-2">
              <X size={20} aria-hidden />
            </IconButton>
          }
        />
      </div>
    </dialog>
  )
}
