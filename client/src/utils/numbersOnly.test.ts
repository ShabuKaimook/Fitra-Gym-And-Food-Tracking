import { expect, test } from 'bun:test'
import { isNumberText } from './numbersOnly'

test('only digits and a decimal point get into number inputs', () => {
  for (const ok of ['5', '.', '12.5', null, '']) expect(isNumberText(ok)).toBe(true)
  for (const bad of ['a', 'e', '-', '1e5', ' ']) expect(isNumberText(bad)).toBe(false)
})
