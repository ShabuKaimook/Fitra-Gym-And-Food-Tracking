import type { InputEvent } from 'react'

/** True if typed or pasted text may go into a number input: digits and a decimal point only. */
export const isNumberText = (data: string | null) => !data || /^[\d.]+$/.test(data)

// onBeforeInput for number inputs. Some desktop browsers let letters (and "e") into type="number"
// but report the value as empty, which would save as "no data"; this keeps them out.
export const numbersOnly = (e: InputEvent<HTMLInputElement>) => {
  if (!isNumberText(e.data)) e.preventDefault()
}
