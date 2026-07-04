import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import BirdSelector from '../components/BirdSelector'
import { Calendar, RECORD_ICONS, X } from '../components/icons'
import { useBirdRecords } from '../hooks/useBirdRecords'
import { useBirds } from '../hooks/useBirds'
import type { RecordType } from '../types'

const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'di-dot', label: 'Đi dợt' },
  { value: 'di-thi', label: 'Đi thi' },
]

const labelClass = 'flex flex-col gap-1.5 text-sm font-medium text-text-muted'
const inputClass =
  'rounded-xl border-0 bg-input-blue px-3 py-2.5 text-base text-text transition focus:ring-3 focus:ring-primary/15 focus:outline-none'
const cardClass = 'rounded-2xl bg-surface p-5 shadow-sm'

export default function RecordsPage() {
  const { user } = useAuth()
  const { birds, loading: birdsLoading } = useBirds(user?.uid)
  const [selectedBirdId, setSelectedBirdId] = useState('')
  const activeBirdId = selectedBirdId || birds[0]?.id
  const selectedBird = birds.find((b) => b.id === activeBirdId)

  const { records, loading, error: recordsError } = useBirdRecords(
    user?.uid,
    activeBirdId,
  )
  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [filter, setFilter] = useState<RecordType | 'all'>('all')

  const [form, setForm] = useState({
    type: 'di-dot' as RecordType,
    title: '',
    date: new Date().toISOString().split('T')[0],
    videoUrl: '',
    notes: '',
  })

  useEffect(() => {
    if (birds.length && !selectedBirdId) {
      setSelectedBirdId(birds[0].id)
    }
  }, [birds, selectedBirdId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !form.title.trim() || !selectedBird) return

    setSubmitting(true)
    setSaveError('')
    try {
      await addDoc(collection(db, 'records'), {
        type: form.type,
        title: form.title.trim(),
        date: form.date,
        videoUrl: form.videoUrl.trim(),
        notes: form.notes.trim(),
        birdId: selectedBird.id,
        birdName: selectedBird.name,
        ownerId: user.uid,
        createdBy: user.uid,
        createdByName: user.displayName || user.email || '',
        createdAt: serverTimestamp(),
      })
      setForm({
        type: form.type,
        title: '',
        date: new Date().toISOString().split('T')[0],
        videoUrl: '',
        notes: '',
      })
    } catch (err) {
      console.error('save record:', err)
      setSaveError('Không lưu được ghi chép. Kiểm tra kết nối hoặc quyền Firestore.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa ghi chép này?')) return
    await deleteDoc(doc(db, 'records', id))
  }

  const filtered =
    filter === 'all' ? records : records.filter((r) => r.type === filter)

  const typeLabel = (type: RecordType) =>
    RECORD_TYPES.find((t) => t.value === type)?.label ?? type

  const TypeIcon = ({ type }: { type: RecordType }) => {
    const Icon = RECORD_ICONS[type]
    return <Icon className="h-4 w-4" strokeWidth={2} />
  }

  const filterBtnClass = (active: boolean) =>
    [
      'rounded-full border px-3 py-1.5 text-xs font-medium transition',
      active
        ? 'border-primary bg-primary text-white'
        : 'border-border bg-surface text-text-muted hover:border-primary/30',
    ].join(' ')

  if (birdsLoading) {
    return <p className="py-12 text-center text-text-muted">Đang tải...</p>
  }

  if (birds.length === 0) {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
        <p className="font-medium text-text">Chưa có chiến binh nào</p>
        <p className="mt-1 text-sm text-text-muted">
          Thêm chào mào trước khi ghi nhật ký.
        </p>
        <Link
          to="/birds"
          className="mt-5 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
        >
          Thêm chiến binh
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm text-text-muted">
          Ghi chép đi dợt & đi thi của{' '}
          <strong>{selectedBird?.name ?? 'chiến binh'}</strong>
        </p>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-text-muted">Chọn chiến binh</p>
        <BirdSelector
          birds={birds}
          selectedId={activeBirdId}
          onSelect={setSelectedBirdId}
        />
      </div>

      <form className={`${cardClass} mb-6 flex flex-col gap-4`} onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold">
          Thêm ghi chép — {selectedBird?.name}
        </h3>

        <div className="flex flex-wrap gap-2">
          {RECORD_TYPES.map((t) => {
            const Icon = RECORD_ICONS[t.value]
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, type: t.value })}
                className={[
                  'inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition',
                  form.type === t.value
                    ? 'border-primary bg-primary/8 text-primary'
                    : 'border-border bg-bg text-text hover:border-primary/30',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Tiêu đề *
            <input
              type="text"
              className={inputClass}
              placeholder="VD: Dợt Hà Nội, Thi cúc..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
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
          <label className={`${labelClass} md:col-span-2`}>
            Link video
            <input
              type="url"
              className={inputClass}
              placeholder="Dán link YouTube, TikTok, Facebook..."
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />
          </label>
        </div>

        <label className={labelClass}>
          Ghi chú
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Kết quả, cảm nhận, thông tin thêm..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </label>

        <button
          type="submit"
          disabled={submitting || !form.title.trim()}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Đang lưu...' : 'Lưu ghi chép'}
        </button>
        {saveError && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {saveError}
          </p>
        )}
      </form>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            Nhật ký {selectedBird?.name}
          </h3>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              className={filterBtnClass(filter === 'all')}
              onClick={() => setFilter('all')}
            >
              Tất cả
            </button>
            {RECORD_TYPES.map((t) => {
              const Icon = RECORD_ICONS[t.value]
              return (
                <button
                  key={t.value}
                  type="button"
                  className={filterBtnClass(filter === t.value)}
                  onClick={() => setFilter(t.value)}
                >
                  <span className="inline-flex items-center gap-1">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                    {t.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <p className="py-8 text-center text-text-muted">Đang tải...</p>
        ) : recordsError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            Không tải được nhật ký: {recordsError}
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            Chưa có ghi chép nào cho {selectedBird?.name}.
          </p>
        ) : (
          <div className="grid gap-3">
            {filtered.map((record) => (
              <div key={record.id} className={cardClass}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <TypeIcon type={record.type} />
                    {typeLabel(record.type)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(record.id)}
                    title="Xóa"
                    className="rounded-md p-1 text-text-muted transition hover:bg-primary/10 hover:text-primary"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <h4 className="mt-2 text-lg font-semibold">{record.title}</h4>
                <div className="mt-1 flex flex-wrap gap-4 text-sm text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                    {new Date(record.date).toLocaleDateString('vi-VN')}
                  </span>
                  {record.videoUrl && (
                    <a
                      href={record.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Xem video
                    </a>
                  )}
                </div>
                {record.notes && (
                  <p className="mt-2 text-sm text-text">{record.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
