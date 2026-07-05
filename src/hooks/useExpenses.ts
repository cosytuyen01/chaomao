import { useEffect, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Expense, ExpenseBudget } from '../types/expenses'

function mapExpense(id: string, data: Record<string, unknown>): Expense {
  return {
    id,
    userId: data.userId as string,
    month: data.month as string,
    category: data.category as Expense['category'],
    amount: Number(data.amount) || 0,
    title: (data.title as string) ?? '',
    date: data.date as string,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? '',
  }
}

export function budgetDocId(userId: string, month: string) {
  return `${userId}_${month}`
}

export function useExpenseBudget(userId: string | undefined, month: string) {
  const [budget, setBudget] = useState<ExpenseBudget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setBudget(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = doc(db, 'expenseBudgets', budgetDocId(userId, month))
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setBudget({ userId, month, salary: 0 })
      } else {
        const data = snap.data()
        setBudget({
          userId,
          month,
          salary: Number(data.salary) || 0,
          updatedAt: data.updatedAt as string | undefined,
        })
      }
      setLoading(false)
    })
  }, [userId, month])

  const saveSalary = async (salary: number) => {
    if (!userId) return
    await setDoc(
      doc(db, 'expenseBudgets', budgetDocId(userId, month)),
      {
        userId,
        month,
        salary,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )
  }

  return { budget, loading, saveSalary }
}

export function useExpenses(userId: string | undefined, month: string) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setExpenses([])
      setLoading(false)
      return
    }

    setLoading(true)
    const q = query(collection(db, 'expenses'), where('userId', '==', userId))

    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((d) => mapExpense(d.id, d.data()))
          .filter((e) => e.month === month)
          .sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date))
        setExpenses(data)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('useExpenses:', err)
        setExpenses([])
        setLoading(false)
        setError(err.message)
      },
    )
  }, [userId, month])

  const removeExpense = async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id))
  }

  return { expenses, loading, error, removeExpense }
}
