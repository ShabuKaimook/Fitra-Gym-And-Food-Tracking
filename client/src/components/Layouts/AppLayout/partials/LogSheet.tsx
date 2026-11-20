import { capAtMax, numbersOnly } from '@/utils/numbersOnly'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { Bike, Droplets, Dumbbell, Footprints, Moon, Scale, Utensils, type LucideIcon } from 'lucide-react'
import { useState, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { useTodayWater } from './useTodayWater'

// shortcut: tiles without a log form yet open their module's page; link each to its form once built.
const TILES: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Food', to: ROUTE_PATHS.FOOD_LOG, icon: Utensils },
  { label: 'Workout', to: ROUTE_PATHS.GYM, icon: Dumbbell },
  { label: 'Cardio', to: ROUTE_PATHS.ACTIVITY, icon: Bike },
  { label: 'Weight', to: ROUTE_PATHS.BODY, icon: Scale },
  { label: 'Sleep', to: ROUTE_PATHS.RECOVERY, icon: Moon },
  { label: 'Steps', to: ROUTE_PATHS.ACTIVITY, icon: Footprints },
]

// Slide up plays each time the dialog is shown (it goes from display:none to visible);
// data-closing plays the slide down, and closeSheet waits for it before closing.
const sheetMotion =
  'animate-sheet-up data-closing:animate-sheet-down backdrop:animate-fade-in data-closing:backdrop:animate-fade-out motion-reduce:animate-none motion-reduce:backdrop:animate-none'

// Plays the slide down, then really closes. With no animation running (reduced motion) it closes at once.
const closeSheet = (dialog: HTMLDialogElement | null) => {
  if (!dialog?.open || dialog.dataset.closing !== undefined) return
  dialog.dataset.closing = ''
  Promise.all(dialog.getAnimations().map((a) => a.finished)).finally(() => {
    delete dialog.dataset.closing
    dialog.close()
  })
}

const waterBtn = 'min-h-11 rounded-xl text-[13px] font-bold disabled:opacity-60'
const waterQuick = `${waterBtn} bg-water-tint text-water-ink`
const waterPlain = `${waterBtn} border border-line bg-surface-2 text-ink`

// Mobile logging hub (1d): a bottom sheet opened by the centre + button. Native <dialog> gives
// focus trapping, Esc to close and an inert page behind it.
export const LogSheet = ({ ref }: { ref: Ref<HTMLDialogElement> }) => {
  const { status, add, adding } = useTodayWater()
  const [custom, setCustom] = useState(false)
  const [ml, setMl] = useState('')

  const addCustom = () => {
    add(Number(ml))
    setMl('')
    setCustom(false)
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="log-sheet-title"
      className={`mt-auto mb-0 w-full max-w-none rounded-t-[26px] bg-surface text-ink shadow-[0_-10px_40px_rgba(0,0,0,0.12)] backdrop:bg-ink/40 ${sheetMotion}`}
      // A click on the dialog itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && closeSheet(e.currentTarget)}
      // Esc: animate out instead of the browser's instant close.
      onCancel={(e) => {
        e.preventDefault()
        closeSheet(e.currentTarget)
      }}
      onClose={() => setCustom(false)}
    >
      <div className="flex flex-col gap-3 px-4 pt-3.5 pb-[calc(22px+env(safe-area-inset-bottom))]">
        <div className="h-1 w-10 self-center rounded-sm bg-track" aria-hidden />
        <h2 id="log-sheet-title" className="m-0 text-[21px] leading-[1.15] font-extrabold tracking-[-0.6px]">
          Log something
        </h2>

        <div className="grid grid-cols-3 gap-2.5">
          {TILES.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={(e) => closeSheet(e.currentTarget.closest('dialog'))}
              className="flex h-19.5 flex-col items-center justify-center gap-1.75 rounded-[18px] border border-line/80 bg-surface text-[13px] font-extrabold"
            >
              <span className="grid size-8.5 place-items-center rounded-xl bg-primary-50 text-primary-ink">
                <Icon size={17} aria-hidden />
              </span>
              {label}
            </Link>
          ))}
        </div>

        <section aria-label="Water" className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[13px] font-bold">
            <Droplets size={15} className="text-water-ink" aria-hidden />
            Water
            <span className="ml-auto text-[13px] font-medium text-ink-2 tabular-nums" aria-live="polite">
              {status}
            </span>
          </div>
          {custom ? (
            <form
              className="grid grid-cols-[1fr_auto_auto] gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                addCustom()
              }}
            >
              <label htmlFor="water-ml" className="sr-only">
                Water in millilitres
              </label>
              <input
                id="water-ml"
                type="number"
                onBeforeInput={numbersOnly}
                inputMode="numeric"
                min={1}
                max={5000}
                required
                autoFocus
                placeholder="ml"
                value={ml}
                onChange={capAtMax((e) => setMl(e.target.value))}
                className="min-h-11 min-w-0 rounded-[14px] border border-line bg-surface-2 px-3 tabular-nums focus-visible:outline-2"
              />
              <button type="submit" className={`${waterQuick} px-4`} disabled={adding}>
                Add
              </button>
              <button type="button" className={`${waterPlain} px-3`} onClick={() => setCustom(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button type="button" className={waterQuick} disabled={adding} onClick={() => add(250)}>
                +250 ml
              </button>
              <button type="button" className={waterQuick} disabled={adding} onClick={() => add(500)}>
                +500 ml
              </button>
              <button type="button" className={waterPlain} onClick={() => setCustom(true)}>
                Custom
              </button>
            </div>
          )}
        </section>
      </div>
    </dialog>
  )
}
