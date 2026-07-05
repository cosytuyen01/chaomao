import { useMemo, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import DetailHero from '../components/detail/DetailHero'
import ExpenseSummaryCard from '../components/expenses/ExpenseSummaryCard'
import SectionHeader from '../components/SectionHeader'
import { Save, X } from '../components/icons'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { useExpenseBudget, useExpenses } from '../hooks/useExpenses'
import {
  EXPENSE_CATEGORIES,
  formatMonthKey,
  getExpenseCategoryLabel,
  type ExpenseCategory,
} from '../types/expenses'
import { HOME_BG } from '../utils/branding'
import { formatVnd, parseVndInput } from '../utils/money'

const labelClass = 'flex flex-col gap-1.5 text-sm font-medium text-text-muted'
const inputClass =
  'w-full rounded-2xl border border-border/60 bg-input-blue px-4 py-3 text-base text-text transition focus:ring-3 focus:ring-primary/15 focus:outline-none'

function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split('-').map(Number)
  const date = new Date(y, m - 1 + delta, 1)
  return formatMonthKey(date)
}

export default function ExpensesPage() {
  const { user } = useAuth()
  const [month, setMonth] = useState(formatMonthKey())
  const { budget, loading: budgetLoading, saveSalary } = useExpenseBudget(
    user?.uid,
    month,
  )
  const { expenses, loading, error, removeExpense } = useExpenses(user?.uid, month)

  const [salaryInput, setSalaryInput] = useState('')
  const [savingSalary, setSavingSalary] = useState(false)
  const [salaryMessage, setSalaryMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [form, setForm] = useState({
    category: 'an-uong' as ExpenseCategory,
    amount: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
  })

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  )

  const salary = budget?.salary ?? 0
  const remaining = salary - totalSpent

  const categoryStats = useMemo(
    () =>
      EXPENSE_CATEGORIES.map((cat) => {
        const amount = expenses
          .filter((e) => e.category === cat.id)
          .reduce((sum, e) => sum + e.amount, 0)
        const percent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
        return { ...cat, amount, percent }
      }).filter((c) => c.amount > 0),
    [expenses, totalSpent],
  )

  const handleSaveSalary = async () => {
    const value = parseVndInput(salaryInput || String(salary))
    if (value <= 0) return
    setSavingSalary(true)
    setSalaryMessage('')
    try {
      await saveSalary(value)
      setSalaryInput('')
      setSalaryMessage('Đã lưu lương tháng này!')
      setTimeout(() => setSalaryMessage(''), 2500)
    } catch {
      setSalaryMessage('Không lưu được. Thử lại sau.')
    } finally {
      setSavingSalary(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const amount = parseVndInput(form.amount)
    if (amount <= 0) {
      setSaveError('Vui lòng nhập số tiền hợp lệ.')
      return
    }

    setSubmitting(true)
    setSaveError('')
    try {
      await addDoc(collection(db, 'expenses'), {
        userId: user.uid,
        month,
        category: form.category,
        amount,
        title: form.title.trim(),
        date: form.date,
        createdAt: serverTimestamp(),
      })
      setForm({
        category: form.category,
        amount: '',
        title: '',
        date: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      console.error('save expense:', err)
      setSaveError('Không lưu được chi tiêu. Kiểm tra quyền Firestore.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa khoản chi này?')) return
    await removeExpense(id)
  }

  const displaySalary = salaryInput || (salary > 0 ? String(salary) : '')

  return (
    <div className="bg-page">
      <DetailHero
        imageUrl={HOME_BG}
        imageAlt="Chi tiêu"
        title="Chi tiêu"
        subtitle="Quản lý thu chi cá nhân"
        showBack={false}
      />

      <div className="relative z-10 space-y-4 px-4 pb-2">
        <ExpenseSummaryCard
          month={month}
          onPrevMonth={() => setMonth((m) => shiftMonth(m, -1))}
          onNextMonth={() => setMonth((m) => shiftMonth(m, 1))}
          salary={salary}
          salaryInput={displaySalary}
          onSalaryInputChange={setSalaryInput}
          onSaveSalary={handleSaveSalary}
          savingSalary={savingSalary}
          budgetLoading={budgetLoading}
          salaryMessage={salaryMessage}
          totalSpent={totalSpent}
          remaining={remaining}
        />

        {categoryStats.length > 0 && (
          <section className="card-modern p-5">
            <SectionHeader title="Thống kê theo loại" />
            <div className="space-y-3">
              {categoryStats.map((cat) => {
                const Icon = cat.icon
                return (
                  <div key={cat.id}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-medium text-text">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                        {cat.label}
                      </span>
                      <span className="font-semibold text-text">
                        {formatVnd(cat.amount)} · {cat.percent}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <form className="card-modern flex flex-col gap-3 p-5" onSubmit={handleSubmit}>
          <SectionHeader title="Thêm chi tiêu" className="!mb-0" />

          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-page p-1.5 sm:grid-cols-4">
            {EXPENSE_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const active = form.category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={[
                    'inline-flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition',
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-muted hover:bg-white hover:text-primary',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {cat.label}
                </button>
              )
            })}
          </div>

          <label className={labelClass}>
            Số tiền *
            <input
              type="text"
              inputMode="numeric"
              className={inputClass}
              placeholder="VD: 50000"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/\D/g, '') })}
              required
            />
          </label>

          <label className={labelClass}>
            Nội dung
            <input
              type="text"
              className={inputClass}
              placeholder="VD: Cám chim, cafe sáng..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label className={labelClass}>
            Ngày
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>

          <button
            type="submit"
            disabled={submitting || !form.amount}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save className="h-4 w-4" strokeWidth={2} />
            {submitting ? 'Đang lưu...' : 'Lưu chi tiêu'}
          </button>
          {saveError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</p>
          )}
        </form>

        <section>
          <SectionHeader
            title="Danh sách chi tiêu"
            subtitle={
              expenses.length > 0 ? `${expenses.length} khoản trong tháng` : undefined
            }
          />

          {loading ? (
            <p className="py-8 text-center text-text-muted">Đang tải...</p>
          ) : error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </p>
          ) : expenses.length === 0 ? (
            <div className="card-modern p-6 text-center text-sm text-text-muted">
              Chưa có chi tiêu nào trong tháng này.
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => {
                const cat = EXPENSE_CATEGORIES.find((c) => c.id === expense.category)
                const Icon = cat?.icon
                return (
                  <div key={expense.id} className="card-modern flex items-center gap-3.5 p-3.5">
                    {Icon && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-text">
                        {expense.title.trim() || getExpenseCategoryLabel(expense.category)}
                      </p>
                      <p className="text-sm text-text-muted">
                        {getExpenseCategoryLabel(expense.category)}
                        {' · '}
                        {new Date(expense.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-amber-600">
                      -{formatVnd(expense.amount)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense.id)}
                      title="Xóa"
                      className="shrink-0 rounded-xl p-1.5 text-text-muted transition hover:bg-primary/10 hover:text-primary"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
