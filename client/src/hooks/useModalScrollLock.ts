import { useEffect } from 'react'

// iOS Safari keeps scrolling the page behind a modal <dialog>, even with overflow: hidden. While any
// dialog is open the body is pinned (position: fixed) at the current scroll, then put back on close.
// With the keyboard up iOS also lets a drag pan the visible area, which only blocking touchmove stops.
// Watches the DOM, so every dialog is covered without each one opting in.
export const useModalScrollLock = () => {
  useEffect(() => {
    const body = document.body
    let lockedAt: number | null = null

    const sync = () => {
      const open = document.querySelector('dialog[open]') !== null
      if (open && lockedAt === null) {
        lockedAt = window.scrollY
        Object.assign(body.style, { position: 'fixed', top: `-${lockedAt}px`, left: '0', right: '0' })
      } else if (!open && lockedAt !== null) {
        Object.assign(body.style, { position: '', top: '', left: '', right: '' })
        window.scrollTo(0, lockedAt)
        lockedAt = null
      }
    }

    // shortcut: blocks every drag while a dialog is open, fine while no dialog scrolls inside; allow
    // drags within a scrollable dialog area once one exists.
    const blockDrag = (e: TouchEvent) => {
      if (lockedAt !== null) e.preventDefault()
    }

    // childList too: a dialog can be unmounted while still open.
    const observer = new MutationObserver(sync)
    observer.observe(body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
    document.addEventListener('touchmove', blockDrag, { passive: false })
    return () => {
      observer.disconnect()
      document.removeEventListener('touchmove', blockDrag)
      if (lockedAt !== null) {
        Object.assign(body.style, { position: '', top: '', left: '', right: '' })
        window.scrollTo(0, lockedAt)
      }
    }
  }, [])
}
