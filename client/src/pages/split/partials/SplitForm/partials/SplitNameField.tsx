import { inputBase } from '@/components/Form'

type Props = {
  value: string
  onChange: (name: string) => void
  /** Set when editing a copy of a built-in split: its name, for the note above the field. */
  copyOf?: string
}

// The split's name (required). A copy of a built-in split says first that saving won't change the original.
export const SplitNameField = ({ value, onChange, copyOf }: Props) => (
  <>
    {copyOf && (
      <p className="m-0 rounded-xl bg-surface px-3 py-2 text-[13px] text-ink-2">
        {copyOf} is built in, so saving makes your own copy. {copyOf} stays as it is.
      </p>
    )}
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-ink-2">Split name</span>
      <input
        // White on the grey page; inputBase's own grey is swapped out, not overridden (CSS order would win).
        className={`${inputBase.replace('bg-surface-2', 'bg-surface')} min-h-11 text-base font-bold`}
        required
        // Spaces only would pass `required` but save an empty name.
        pattern=".*\S.*"
        maxLength={60}
        placeholder="My 4-day"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  </>
)
