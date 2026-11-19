import { LogMenu } from './LogMenu'
import { avatar, USER } from './shared'

type Props = {
  /** Receives the left-side element; pages fill it through TopBarTitle. */
  setTitleSlot: (el: HTMLDivElement | null) => void
}

// Desktop only (from lg): the page's title on the left, the Log menu and avatar on the right.
export const TopBar = ({ setTitleSlot }: Props) => (
  <header className="sticky top-0 z-1 hidden h-14 items-center gap-3 border-b border-line bg-surface/85 px-8 backdrop-blur-sm lg:flex">
    <div ref={setTitleSlot} className="mr-auto flex min-w-0 items-baseline gap-2.5" />
    <LogMenu />
    <div className={avatar} aria-hidden>
      {USER.initial}
    </div>
  </header>
)
