import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheat } from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { useBirds } from '../hooks/useBirds'

const labelClass = 'flex flex-col gap-2 text-sm font-medium text-text-muted'
const inputClass =
  'rounded-xl border-0 bg-input-blue px-4 py-3 text-base text-text focus:ring-3 focus:ring-primary/15 focus:outline-none'

export default function AddBirdPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addBird } = useBirds(user?.uid)

  const [name, setName] = useState('')
  const [seasons, setSeasons] = useState('0')
  const [pellets, setPellets] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const seasonsNum = Number(seasons)
  const seasonHint =
    seasons === '' || Number.isNaN(seasonsNum)
      ? ''
      : seasonsNum === 0
        ? '→ Hiển thị: Bổi rừng'
        : `→ Hiển thị: ${seasonsNum} mùa`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Vui lòng nhập tên chim.')
      return
    }

    if (Number.isNaN(seasonsNum) || seasonsNum < 0) {
      setError('Số mùa phải là số từ 0 trở lên.')
      return
    }

    if (!user) return

    setSubmitting(true)
    try {
      await addBird(name.trim(), seasonsNum, user.uid, pellets)
      navigate(-1)
    } catch {
      setError('Không thể thêm chiến binh. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-border/80 bg-white p-5 shadow-sm"
    >
      <label className={labelClass}>
        Tên chim
        <input
          type="text"
          className={inputClass}
          placeholder="VD: Bổi Mặn, Bổi Chay,.."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
      </label>

      <label className={labelClass}>
        Số mùa
        <input
          type="number"
          min={0}
          className="rounded-xl border-0 bg-input-beige px-4 py-3 text-base text-text focus:ring-3 focus:ring-primary/15 focus:outline-none"
          placeholder="0"
          value={seasons}
          onChange={(e) => setSeasons(e.target.value)}
        />
        <span className="text-xs font-normal text-primary">{seasonHint}</span>
      </label>

      <label className={labelClass}>
        <span className="inline-flex items-center gap-1.5">
          <Wheat className="h-4 w-4 text-primary" strokeWidth={2} />
          Cám đang dùng
        </span>
        <input
          type="text"
          className={inputClass}
          placeholder="VD: Văn Toại 2N1, Thiên Điểu Ca..."
          value={pellets}
          onChange={(e) => setPellets(e.target.value)}
        />
      </label>

      <p className="text-xs text-text-muted">
        Nhập <strong>0</strong> nếu chim là <strong>bổi rừng</strong>.
      </p>

      {error && (
        <p className="rounded-xl bg-primary/8 px-3 py-2 text-sm text-primary">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {submitting ? 'Đang lưu...' : 'Thêm chiến binh'}
      </button>
    </form>
  )
}
