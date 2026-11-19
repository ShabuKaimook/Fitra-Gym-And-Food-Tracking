import { useCallback, useState } from 'react'

// Replaces the browser's validation bubble (some browsers leave an empty box on screen after it)
// with our own message. The native checks (required, min, max, pattern) still run on submit; for
// the first failing field we focus it and return "Label: browser's message" to show in the page.
// Pass `attach` as the <form>'s ref and call `clear` from its onInput.
export const useInlineValidation = () => {
  const [message, setMessage] = useState('')

  // Callback ref: attaches when the form mounts, the returned cleanup runs when it unmounts.
  const attach = useCallback((form: HTMLFormElement | null) => {
    if (!form) return
    let handled = false
    // `invalid` doesn't bubble, so listen in the capture phase. It fires once per bad field.
    const onInvalid = (e: Event) => {
      e.preventDefault()
      if (handled) return
      handled = true
      setTimeout(() => (handled = false))
      const field = e.target as HTMLInputElement
      field.focus()
      // The first element in the field's <label> holds its name; aria-label covers unlabelled inputs.
      const name = field.labels?.[0]?.firstElementChild?.textContent || field.getAttribute('aria-label')
      setMessage(name ? `${name}: ${field.validationMessage}` : field.validationMessage)
    }
    form.addEventListener('invalid', onInvalid, true)
    return () => form.removeEventListener('invalid', onInvalid, true)
  }, [])

  const clear = useCallback(() => setMessage(''), [])

  return { attach, message, clear }
}
