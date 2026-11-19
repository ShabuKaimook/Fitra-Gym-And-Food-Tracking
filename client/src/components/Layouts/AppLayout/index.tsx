import { useFullScreen } from '@/hooks/useFullScreen'
import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './partials/BottomNav'
import { LogSheet } from './partials/LogSheet'
import { Sidebar } from './partials/Sidebar'
import { TopBar } from './partials/TopBar'

/** Passed to pages through <Outlet context>; read it with TopBarTitle. */
export type AppLayoutContext = { titleSlot: HTMLElement | null }

// Mobile first: bottom nav. From lg: sidebar + top bar.
export const AppLayout = () => {
  // The top bar's left side is filled by the page (TopBarTitle portals into it).
  const [titleSlot, setTitleSlot] = useState<HTMLDivElement | null>(null)
  const logSheetRef = useRef<HTMLDialogElement>(null)
  // Full-screen pages (e.g. New food) hide the mobile bottom nav, so main needs no room for it.
  const fullScreen = useFullScreen()

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[220px_1fr]">
      <Sidebar />

      <div className="min-w-0">
        <TopBar setTitleSlot={setTitleSlot} />
        <main
          className={`mx-auto max-w-300 px-4 pt-5 lg:px-8 lg:pt-6 lg:pb-8 ${fullScreen ? 'pb-[calc(16px+env(safe-area-inset-bottom))]' : 'pb-[calc(96px+env(safe-area-inset-bottom))]'}`}
        >
          <Outlet context={{ titleSlot } satisfies AppLayoutContext} />
        </main>
      </div>

      <BottomNav onLog={() => logSheetRef.current?.showModal()} hidden={fullScreen} />
      <LogSheet ref={logSheetRef} />
    </div>
  )
}
