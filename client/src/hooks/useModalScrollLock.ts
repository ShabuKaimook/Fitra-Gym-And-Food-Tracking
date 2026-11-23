import { useEffect } from 'react'

const SCROLL_KEYS = new Set([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'])

// Stops the page behind an open <dialog> from scrolling by cancelling the inputs that scroll it:
// wheel/trackpad, finger drags (iOS, including panning while the keyboard is up) and scroll keys.
// No styles change, so the layout never moves. Don't use overflow: hidden (Firefox drops the sticky
// sidebar and top bar) or position: fixed on the body (breaks sticky everywhere).
// Watches the DOM, so every dialog is covered without each one opting in.
export const useModalScrollLock = () => {
  useEffect(() => {
    let locked = false
    const sync = () => {
      locked = document.querySelector('dialog[open]') !== null
    }

    // shortcut: also blocks scrolling inside a dialog, fine while no dialog scrolls; allow it for a
    // scrollable dialog area once one exists.
    const block = (e: Event) => {
      if (locked) e.preventDefault()
    }
    const blockKeys = (e: KeyboardEvent) => {
      const el = e.target instanceof HTMLElement ? e.target : null
      // Fields use these keys themselves, and Space presses a focused button.
      const ownsKey =
        el?.matches('input, textarea, select, [contenteditable]') || (e.key === ' ' && el?.matches('button'))
      if (locked && !ownsKey && SCROLL_KEYS.has(e.key)) e.preventDefault()
    }

    // childList too: a dialog can be unmounted while still open.
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
    // passive: false, or the browser ignores preventDefault on these.
    document.addEventListener('wheel', block, { passive: false })
    document.addEventListener('touchmove', block, { passive: false })
    document.addEventListener('keydown', blockKeys)
    return () => {
      observer.disconnect()
      document.removeEventListener('wheel', block)
      document.removeEventListener('touchmove', block)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])
}
