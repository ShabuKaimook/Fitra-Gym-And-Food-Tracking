import type { ReactNode } from 'react'

type Props = {
  /** Read by screen readers on the hidden file input. */
  label: string
  onPick: (url: string) => void
  className?: string
  children: ReactNode
}

// Tap target that opens the photo library or camera. The real input is hidden but still takes keyboard focus.
// className must position it (relative or absolute): the sr-only input is placed against it.
export const PhotoInput = ({ label, onPick, className = '', children }: Props) => (
  <label className={`cursor-pointer has-focus-visible:outline-2 ${className}`}>
    {children}
    <input
      type="file"
      accept="image/*"
      aria-label={label}
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0]
        e.target.value = '' // so picking the same file again still fires change
        // shortcut: the object URL lives only in this tab, like the in-memory mock; upload the file once the API exists.
        if (file?.type.startsWith('image/')) onPick(URL.createObjectURL(file))
      }}
    />
  </label>
)
