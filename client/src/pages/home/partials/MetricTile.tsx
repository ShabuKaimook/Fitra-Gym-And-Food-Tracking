import { FormDialog, type DialogField } from '@/components/FormDialog'
import { Skeleton } from '@/components/Skeleton'
import { useState, type ComponentProps } from 'react'
import { toast } from 'react-toastify'
import { StatTile } from './StatTile'
import { cardSkeleton } from './ui'

type Edit = {
  title: string
  rows: DialogField[][]
  initial?: Record<string, string>
  saving: boolean
  /** Resolves once saved; the dialog then closes with a toast. */
  save: (values: Record<string, number>) => Promise<unknown>
}

type Props = Omit<ComponentProps<typeof StatTile>, 'onEdit' | 'className'> & {
  loading: boolean
  /** Full class, e.g. '[grid-area:steps]', so Tailwind can find it. Mobile only; desktop rows use auto. */
  area: string
  /** Leave out for a tile that can't be edited yet. */
  edit?: Edit
}

// One Home tile with everything around it: a skeleton while loading, the tile, and its edit dialog.
export const MetricTile = ({ loading, area, edit, ...tile }: Props) => {
  const [open, setOpen] = useState(false)

  if (loading) return <Skeleton className={`${cardSkeleton} min-h-28 ${area}`} />

  const save = (values: Record<string, number>) =>
    edit!.save(values).then(
      () => {
        toast.success(`${tile.label} updated`)
        setOpen(false)
      },
      () => toast.error(`${tile.label} not saved, try again`),
    )

  return (
    <>
      <StatTile {...tile} className={`${area} lg:[grid-area:auto]`} onEdit={edit && (() => setOpen(true))} />
      {open && edit && (
        <FormDialog
          title={edit.title}
          rows={edit.rows}
          initial={edit.initial}
          saving={edit.saving}
          onSave={save}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
