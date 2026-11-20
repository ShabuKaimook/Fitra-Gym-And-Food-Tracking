import { expect, test } from 'bun:test'
import { isNumberText, isOverMax } from './numbersOnly'

test('only digits and a decimal point get into number inputs', () => {
  for (const ok of ['5', '.', '12.5', null, '']) expect(isNumberText(ok)).toBe(true)
  for (const bad of ['a', 'e', '-', '1e5', ' ']) expect(isNumberText(bad)).toBe(false)
})

test('values past max are refused; no max means no limit', () => {
  expect(isOverMax('10000', '10000')).toBe(false)
  expect(isOverMax('100000', '10000')).toBe(true)
  expect(isOverMax('99999999', '')).toBe(false)
  expect(isOverMax('', '10000')).toBe(false)
})
