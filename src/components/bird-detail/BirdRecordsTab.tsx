import { useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import {
  Link2,
  PenLine,
  RECORD_ICONS,
  Save,
  X,
} from '../icons'
import { useBirdRecords } from '../../hooks/useBirdRecords'
import type { RecordType } from '../../types'

const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'di-dot', label: 'Đi dợt' },
  { value: 'di-thi', label: 'Đi thi' },
]

const labelClass = 'flex flex-col gap-1.5 text-sm font-medium text-text-muted'
const inputClass =
  'w-full rounded-2xl border border-border/60 bg-input-blue px-4 py-3 text-base text-text transition focus:ring-3 focus:ring-primary/15 focus:outline-none'

interface BirdRecordsTabProps {
  birdId: string
  birdName: string
}

export default function BirdRecordsTab({ birdId, birdName }: BirdRecordsTabProps) {
  const { user } = useAuth()
  const { records, loading, error: recordsError } = useBirdRecords(user?.uid, birdId)
  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({
    type: 'di-dot' as RecordType,
    title: '',
    date: new Date().toISOString().split('T')[0],
    videoUrl: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !form.title.trim()) return

    setSubmitting(true)
    setSaveError('')
    try {
      await addDoc(collection(db, 'records'), {
        type: form.type,
        title: form.title.trim(),
        date: form.date,
        videoUrl: form.videoUrl.trim(),
        notes: form.notes.trim(),
        birdId,
        birdName,
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
      setSaveError('Không lưu được Nhật ký. Kiểm tra kết nối hoặc quyền Firestore.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa Nhật ký này?')) return
    await deleteDoc(doc(db, 'records', id))
  }

  const typeLabel = (type: RecordType) =>
    RECORD_TYPES.find((t) => t.value === type)?.label ?? type

  const formatRecordDate = (date: string) =>
    new Date(date).toLocaleDateString('vi-VN')

  return (
    <div className="space-y-5">
      <form className="card-modern flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold text-text">Thêm Nhật ký — {birdName}</h3>

        <div className="flex gap-2">
          {RECORD_TYPES.map((t) => {
            const Icon = RECORD_ICONS[t.value]
            const active = form.type === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, type: t.value })}
                className={[
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition',
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-text-muted hover:border-primary/30',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {t.label}
              </button>
            )
          })}
        </div>

        <label className={labelClass}>
          Tiêu đề *
          <div className="relative">
            <input
              type="text"
              className={`${inputClass} pr-11`}
              placeholder="VD: Đợt Hà Nội, Thi cúc..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <PenLine
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              strokeWidth={2}
            />
          </div>
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

        <label className={labelClass}>
          Link video
          <div className="relative">
            <input
              type="url"
              className={`${inputClass} pr-11`}
              placeholder="Dán link YouTube, TikTok..."
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />
            <Link2
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              strokeWidth={2}
            />
          </div>
        </label>

        <label className={labelClass}>
          Ghi chú
          <textarea
            className={`${inputClass} min-h-[88px] resize-y`}
            placeholder="Kết quả, cảm nhận, thông tin thêm..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </label>

        <button
          type="submit"
          disabled={submitting || !form.title.trim()}
          className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
        >
          <Save className="h-4 w-4" strokeWidth={2} />
          {submitting ? 'Đang lưu...' : 'Lưu Nhật ký'}
        </button>
        {saveError && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {saveError}
          </p>
        )}
      </form>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-text">
            Nhật ký
            {records.length > 0 && (
              <span className="ml-2 text-sm font-semibold text-text-muted">
                ({records.length})
              </span>
            )}
          </h3>
        </div>

        {loading ? (
          <p className="py-8 text-center text-text-muted">Đang tải...</p>
        ) : recordsError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            Không tải được nhật ký: {recordsError}
          </p>
        ) : records.length === 0 ? (
          <div className="card-modern p-6 text-center text-sm text-text-muted">
            Chưa có Nhật ký nào cho {birdName}.
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const Icon = RECORD_ICONS[record.type]
              return (
                <div
                  key={record.id}
                  className="group card-modern p-3.5"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-text">
                        {typeLabel(record.type)} · {record.title}
                      </p>
                      <p className="mt-0.5 text-sm text-text-muted">
                        {formatRecordDate(record.date)}
                      </p>
                      {record.videoUrl && (
                        <a
                          href={record.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-sm font-medium text-primary underline"
                        >
                          Xem video
                        </a>
                      )}
                      {record.notes.trim() && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-text">
                          {record.notes.trim()}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      title="Xóa"
                      className="shrink-0 rounded-xl p-1.5 text-text-muted transition hover:bg-primary/10 hover:text-primary"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
