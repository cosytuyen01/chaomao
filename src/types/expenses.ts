import type { LucideIcon } from 'lucide-react'
import {
  Bird,
  Car,
  Ellipsis,
  Gamepad2,
  GraduationCap,
  ShoppingBag,
  Users,
  Utensils,
} from 'lucide-react'

export type ExpenseCategory =
  | 'an-uong'
  | 'mua-sam'
  | 'chim-canh'
  | 'giai-tri'
  | 'hoc-tap'
  | 'di-lai'
  | 'ban-be'
  | 'khac'

export interface Expense {
  id: string
  userId: string
  month: string
  category: ExpenseCategory
  amount: number
  title: string
  date: string
  createdAt: string
}

export interface ExpenseBudget {
  userId: string
  month: string
  salary: number
  updatedAt?: string
}

export const EXPENSE_CATEGORIES: {
  id: ExpenseCategory
  label: string
  icon: LucideIcon
}[] = [
  { id: 'an-uong', label: 'Ăn uống', icon: Utensils },
  { id: 'mua-sam', label: 'Mua sắm', icon: ShoppingBag },
  { id: 'chim-canh', label: 'Chim cảnh', icon: Bird },
  { id: 'giai-tri', label: 'Giải trí', icon: Gamepad2 },
  { id: 'hoc-tap', label: 'Học tập', icon: GraduationCap },
  { id: 'di-lai', label: 'Đi lại', icon: Car },
  { id: 'ban-be', label: 'Bạn bè', icon: Users },
  { id: 'khac', label: 'Khác', icon: Ellipsis },
]

export function getExpenseCategoryLabel(id: ExpenseCategory): string {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export function formatMonthKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-')
  return `Tháng ${Number(m)}/${y}`
}
