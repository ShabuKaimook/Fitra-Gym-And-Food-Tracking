import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { NotebookPen } from 'lucide-react'
import { useId, useState } from 'react'
import { cardLabel } from './ui'

type Props = { note: string; saving: boolean; onSave: (note: string) => void }

// The day's note: typed straight into the card; Save shows once the text differs from what's saved.
// Mount with key={date} so a draft doesn't follow you to another day. Desktop: full width when it's
// alone in its row (no workout that day); :first-child also outranks the grid-area reset.
export const NoteCard = ({ note, saving, onSave }: Props) => {
  const id = useId()
  const [text, setText] = useState(note)
  const changed = text.trim() !== note

  return (
    <Card
      as="form"
      className="flex min-w-0 flex-col gap-2 [grid-area:note] lg:[grid-area:auto] lg:first:[grid-column:1/-1]"
      onSubmit={(e) => {
        e.preventDefault()
        onSave(text.trim())
      }}
    >
      <label htmlFor={id} className={cardLabel}>
        <NotebookPen size={15} aria-hidden />
        Notes
      </label>
      <textarea
        id={id}
        rows={3}
        maxLength={1000}
        placeholder="How did today go? Mood, soreness, anything worth remembering."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-20 resize-y rounded-[14px] border border-line bg-surface-2 px-3 py-2 text-[15px] leading-5.5"
      />
      {changed && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setText(note)}>
            Discard
          </Button>
          <Button type="submit" size="sm" loading={saving}>
            {saving ? 'Saving' : 'Save note'}
          </Button>
        </div>
      )}
    </Card>
  )
}
