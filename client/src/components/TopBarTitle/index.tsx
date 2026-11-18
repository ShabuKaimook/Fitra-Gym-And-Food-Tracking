import type { AppLayoutContext } from '@/components/Layouts/AppLayout'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useOutletContext } from 'react-router-dom'

// Renders its children into the left side of AppLayout's desktop top bar (hidden on mobile).
// Use it for a page's desktop title; render the mobile title in the page as usual.
export const TopBarTitle = ({ children }: { children: ReactNode }) => {
  const { titleSlot } = useOutletContext<AppLayoutContext>()
  return titleSlot ? createPortal(children, titleSlot) : null
}
