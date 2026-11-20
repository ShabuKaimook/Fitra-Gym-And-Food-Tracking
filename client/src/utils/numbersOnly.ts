import type { ChangeEvent, InputEvent } from 'react'

/** True if typed or pasted text may go into a number input: digits and a decimal point only. */
export const isNumberText = (data: string | null) => !data || /^[\d.]+$/.test(data)

// onBeforeInput for number inputs. Some desktop browsers let letters (and "e") into type="number"
// but report the value as empty, which would save as "no data"; this keeps them out.
export const numbersOnly = (e: InputEvent<HTMLInputElement>) => {
  if (!isNumberText(e.data)) e.preventDefault()
}

/** True if `value` would go past `max` (an input's max attribute; '' = no limit). */
export const isOverMax = (value: string, max: string) => max !== '' && Number(value) > Number(max)

// Wraps a controlled number input's onChange so a keystroke or paste past `max` is dropped: state
// isn't updated, so React puts the previous value back ("10000" + "0" stays "10000").
// Done here, not in onBeforeInput: type="number" hides the cursor position, so the result can't be known before.
export const capAtMax =
  (onChange?: (e: ChangeEvent<HTMLInputElement>) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    if (!isOverMax(e.currentTarget.value, e.currentTarget.max)) onChange?.(e)
  }
