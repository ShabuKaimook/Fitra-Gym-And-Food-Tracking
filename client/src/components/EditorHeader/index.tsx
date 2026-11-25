import { TopBarTitle } from '@/components/TopBarTitle'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  /** Shown before the title in the desktop top bar, e.g. "Gym /". */
  crumb: string
  /** Where Back and Cancel go. */
  backTo: string
  /** The form the Save button submits (it sits outside it). */
  formId: string
  saving: boolean
  /** Desktop Save label, e.g. "Save split"; phones show "Save". */
  saveLabel: string
}

// Header of a full-screen editor (split builder, new exercise). Mobile: back, title, Save.
// Desktop: the title goes in the top bar; Cancel and Save here.
export const EditorHeader = ({ title, crumb, backTo, formId, saving, saveLabel }: Props) => (
  <>
    <TopBarTitle>
      <span className="text-sm text-ink-2">{crumb}</span>
      <h1 className="m-0 text-xl font-extrabold tracking-[-0.4px]">{title}</h1>
    </TopBarTitle>

    <header className="flex items-center gap-2">
      <Link
        to={backTo}
        aria-label="Back"
        className="-ml-2.5 grid size-11 place-items-center rounded-full text-ink-2 hover:bg-surface-2 lg:hidden"
      >
        <ChevronLeft size={22} aria-hidden />
      </Link>
      <h1 className="m-0 min-w-0 flex-1 truncate text-xl font-extrabold tracking-[-0.4px] lg:hidden">{title}</h1>
      <Link
        to={backTo}
        className="ml-auto inline-flex min-h-11 items-center rounded-2xl border border-line bg-surface px-4 text-sm font-extrabold hover:bg-surface-2 max-lg:hidden"
      >
        Cancel
      </Link>
      <button
        type="submit"
        form={formId}
        disabled={saving}
        className="min-h-10 rounded-2xl bg-primary px-4 text-sm font-extrabold text-on-primary hover:bg-primary-hover disabled:opacity-60 lg:min-h-11"
      >
        {saving ? (
          'Saving…'
        ) : (
          <>
            <span className="max-lg:hidden">{saveLabel}</span>
            <span className="lg:hidden">Save</span>
          </>
        )}
      </button>
    </header>
  </>
)
