import { Button } from '@/components/Button'
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
      <Button variant="outline" to={backTo} className="ml-auto max-lg:hidden">
        Cancel
      </Button>
      <Button type="submit" form={formId} loading={saving} className="max-lg:min-h-10">
        {saving ? (
          'Saving'
        ) : (
          <>
            <span className="max-lg:hidden">{saveLabel}</span>
            <span className="lg:hidden">Save</span>
          </>
        )}
      </Button>
    </header>
  </>
)
