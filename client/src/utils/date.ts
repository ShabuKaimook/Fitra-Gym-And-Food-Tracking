// Local-time date helpers. Dates are kept at midnight; API/URL dates are 'YYYY-MM-DD' strings.

export type DateKey = string // 'YYYY-MM-DD'

export const toDateKey = (d: Date): DateKey =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export const addDays = (d: Date, n: number) => {
  const next = new Date(d)
  next.setDate(d.getDate() + n)
  return next
}

// Monday of d's week. getDay() is Sun=0…Sat=6; (+6)%7 turns it into days since Monday (Sun → 6).
export const mondayOf = (d: Date) => addDays(d, -((d.getDay() + 6) % 7))
