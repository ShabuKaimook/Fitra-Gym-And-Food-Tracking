import type { LucideIcon } from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon }

// shortcut: hard-coded user until auth/profile exists, then read it from a query hook.
export const USER = { name: 'Alex', initial: 'A', plan: 'Personal' }

export const avatar =
  'grid size-8 flex-none place-items-center rounded-full bg-avatar text-[13px] font-extrabold text-avatar-ink'
