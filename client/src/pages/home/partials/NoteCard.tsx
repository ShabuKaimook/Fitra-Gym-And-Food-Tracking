import { NotebookPen } from 'lucide-react'
import { useId, useState } from 'react'
import { btnBase, card, cardLabel, cardSurface } from './ui'

type Props = { note: string; saving: boolean; onSave: (note: string) => void }

// The day's note: typed straight into the card; Save shows once the text differs from what's saved.
// Mount with key={date} so a draft doesn't follow you to another day.
export const NoteCard = ({ note, saving, onSave }: Props) => {
  const id = useId()
  const [text, setText] = useState(note)
  const changed = text.trim() !== note

  return (
    <form
      className={`${card} ${cardSurface} [grid-area:note] lg:col-span-3 lg:[grid-area:auto]`}
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
          <button
            type="button"
            onClick={() => setText(note)}
            className={`${btnBase} min-h-9 rounded-xl border border-line bg-surface-2 px-3 text-[13px]`}
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`${btnBase} min-h-9 rounded-xl bg-primary px-4 text-[13px] text-on-primary hover:bg-primary-hover disabled:opacity-60`}
          >
            {saving ? 'Saving…' : 'Save note'}
          </button>
        </div>
      )}
    </form>
  )
}
