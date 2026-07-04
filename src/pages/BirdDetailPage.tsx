import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bird as BirdIcon, Wheat } from '../components/icons'
import { useBirds } from '../hooks/useBirds'

const labelClass = 'flex flex-col gap-2 text-sm font-medium text-text-muted'
const inputClass =
  'rounded-xl border-0 bg-input-blue px-4 py-3 text-base text-text focus:ring-3 focus:ring-primary/15 focus:outline-none'

export default function BirdDetailPage() {
  const { birdId } = useParams<{ birdId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { birds, loading, updateBird, removeBird } = useBirds(user?.uid)

  const bird = birds.find((b) => b.id === birdId)

  const [name, setName] = useState('')
  const [seasons, setSeasons] = useState('0')
  const [pellets, setPellets] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bird) return
    setName(bird.name)
    setSeasons(String(bird.seasons))
    setPellets(bird.pellets)
  }, [bird])

  if (loading) {
    return <p className="py-12 text-center text-text-muted">Đang tải...</p>
  }

  if (!bird) {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
        <p className="font-medium text-text">Không tìm thấy chim</p>
        <Link to="/birds" className="mt-4 inline-block text-sm text-primary">
          ← Quay lại
        </Link>
      </div>
    )
  }

  const seasonsNum = Number(seasons)
  const seasonHint =
    seasons === '' || Number.isNaN(seasonsNum)
      ? ''
      : seasonsNum === 0
        ? '→ Bổi rừng'
        : `→ ${seasonsNum} mùa`

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!name.trim()) {
      setError('Vui lòng nhập tên chim.')
      return
    }
    if (Number.isNaN(seasonsNum) || seasonsNum < 0) {
      setError('Số mùa phải là số từ 0 trở lên.')
      return
    }

    setSaving(true)
    try {
      await updateBird(bird.id, {
        name: name.trim(),
        seasons: seasonsNum,
        pellets: pellets.trim(),
      })
      setMessage('Đã lưu thông tin chim!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Không thể lưu. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Xóa ${bird.name}?`)) return
    await removeBird(bird.id)
    navigate('/birds')
  }

  return (
    <div>
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-50 text-primary">
          <BirdIcon className="h-14 w-14" strokeWidth={1.5} />
        </div>
        <h1 className="mt-3 text-xl font-bold text-text">{bird.name}</h1>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-2xl bg-surface p-5 shadow-sm"
      >
        <label className={labelClass}>
          Tên chim
          <input
            type="text"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Bổi Mặn, Bổi Chay,.."
            required
          />
        </label>

        <label className={labelClass}>
          Số mùa
          <input
            type="number"
            min={0}
            className="rounded-xl border-0 bg-input-beige px-4 py-3 text-base text-text focus:ring-3 focus:ring-primary/15 focus:outline-none"
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
            value={pellets}
            onChange={(e) => setPellets(e.target.value)}
            placeholder="VD: Thiên Điểu Ca, Hiển Long..."
          />
        </label>

        {error && (
          <p className="rounded-xl bg-primary/8 px-3 py-2 text-sm text-primary">{error}</p>
        )}
        {message && (
          <p className="rounded-xl bg-success/10 px-3 py-2 text-sm text-success">{message}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </form>

      <Link
        to="/che-do-di"
        className="mt-4 block w-full rounded-xl border border-primary/20 bg-surface py-3.5 text-center text-sm font-semibold text-primary"
      >
        Xem chế độ
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        className="mt-3 w-full rounded-xl py-3 text-sm font-medium text-primary/80 hover:bg-primary/5"
      >
        Xóa chim
      </button>
    </div>
  )
}
