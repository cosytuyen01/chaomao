import { PiggyBank, Receipt, Wallet } from 'lucide-react'
import { ChevronLeft, ChevronRight } from '../icons'
import { formatMonthLabel } from '../../types/expenses'
import { formatVnd } from '../../utils/money'

interface ExpenseSummaryCardProps {
  month: string
  onPrevMonth: () => void
  onNextMonth: () => void
  salary: number
  salaryInput: string
  onSalaryInputChange: (value: string) => void
  onSaveSalary: () => void
  savingSalary: boolean
  budgetLoading: boolean
  salaryMessage: string
  totalSpent: number
  remaining: number
}

const STAT_ITEMS = [
  { key: 'salary' as const, label: 'Lương', icon: Wallet },
  { key: 'spent' as const, label: 'Đã chi', icon: Receipt },
  { key: 'remaining' as const, label: 'Còn lại', icon: PiggyBank },
]

export default function ExpenseSummaryCard({
  month,
  onPrevMonth,
  onNextMonth,
  salary,
  salaryInput,
  onSalaryInputChange,
  onSaveSalary,
  savingSalary,
  budgetLoading,
  salaryMessage,
  totalSpent,
  remaining,
}: ExpenseSummaryCardProps) {
  const statValues = {
    salary: salary > 0 ? formatVnd(salary) : '—',
    spent: formatVnd(totalSpent),
    remaining: salary > 0 ? formatVnd(remaining) : '—',
  }

  const statColors = {
    salary: 'text-text',
    spent: 'text-amber-600',
    remaining:
      salary <= 0 ? 'text-text' : remaining >= 0 ? 'text-emerald-600' : 'text-red-600',
  }

  return (
    <div className="card-modern -mt-30 p-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary/15"
          aria-label="Tháng trước"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <p className="text-center font-bold text-text">{formatMonthLabel(month)}</p>
        <button
          type="button"
          onClick={onNextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary/15"
          aria-label="Tháng sau"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-4 border-t border-border/60 pt-4">
        <p className="font-bold text-text">Lương tháng</p>
        <p className="mt-0.5 text-sm text-text-muted">
          Nhập tổng thu nhập để theo dõi còn lại bao nhiêu.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            className="w-full rounded-2xl border border-border/60 bg-input-blue px-4 py-3 text-base text-text transition focus:ring-3 focus:ring-primary/15 focus:outline-none"
            placeholder="VD: 15000000"
            value={salaryInput}
            onChange={(e) => onSalaryInputChange(e.target.value.replace(/\D/g, ''))}
          />
          <button
            type="button"
            onClick={onSaveSalary}
            disabled={savingSalary || budgetLoading}
            className="btn-primary shrink-0 px-4 disabled:opacity-60"
          >
            Lưu
          </button>
        </div>
        {/* {salary > 0 && (
          <p className="mt-2 text-sm font-semibold text-primary">
            Đã lưu: {formatVnd(salary)}
          </p>
        )} */}
        {salaryMessage && (
          <p className="mt-2 text-sm text-success">{salaryMessage}</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-4">
        {STAT_ITEMS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <p className={['mt-1.5 text-sm font-bold', statColors[key]].join(' ')}>
              {statValues[key]}
            </p>
            <p className="text-[10px] leading-tight text-text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
