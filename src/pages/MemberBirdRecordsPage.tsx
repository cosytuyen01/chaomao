import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { Calendar, RECORD_ICONS } from '../components/icons'
import { db } from '../firebase/config'
import { useBirdRecords } from '../hooks/useBirdRecords'
import { useMemberProfile } from '../hooks/useMembers'
import { DEFAULT_BIRD_IMAGE, formatSeasons } from '../utils/bird'
import type { RecordType } from '../types'

const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'di-dot', label: 'Đi dợt' },
  { value: 'di-thi', label: 'Đi thi' },
]

const cardClass = 'rounded-2xl bg-surface p-5 shadow-sm'

export default function MemberBirdRecordsPage() {
  const { userId, birdId } = useParams<{ userId: string; birdId: string }>()
  const { member, loading: memberLoading } = useMemberProfile(userId)
  const { records, loading, error } = useBirdRecords(userId, birdId)
  const [birdName, setBirdName] = useState('')
  const [seasons, setSeasons] = useState(0)
  const [birdLoading, setBirdLoading] = useState(true)
  const [filter, setFilter] = useState<RecordType | 'all'>('all')

  useEffect(() => {
    if (!birdId) return

    setBirdLoading(true)
    return onSnapshot(doc(db, 'birds', birdId), (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setBirdName(data.name as string)
        setSeasons((data.seasons as number) ?? 0)
      } else {
        setBirdName('')
        setSeasons(0)
      }
      setBirdLoading(false)
    })
  }, [birdId])

  const typeLabel = (type: RecordType) =>
    RECORD_TYPES.find((t) => t.value === type)?.label ?? type

  const filterBtnClass = (active: boolean) =>
    [
      'rounded-full border px-3 py-1.5 text-xs font-medium transition',
      active
        ? 'border-primary bg-primary text-white'
        : 'border-border bg-surface text-text-muted hover:border-primary/30',
    ].join(' ')

  const filtered =
    filter === 'all' ? records : records.filter((r) => r.type === filter)

  if (memberLoading || birdLoading) {
    return <p className="py-12 text-center text-text-muted">Đang tải...</p>
  }

  if (!birdName) {
    return (
      <div className={`${cardClass} text-center`}>
        <p className="font-medium text-text">Không tìm thấy Chiến binh</p>
        {userId && (
          <Link to={`/thanh-vien/${userId}`} className="mt-4 inline-block text-sm text-primary">
            ← Quay lại profile
          </Link>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border/80 bg-white p-4 shadow-sm">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={DEFAULT_BIRD_IMAGE}
            alt={birdName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-text">{birdName}</h2>
          {member && (
            <p className="text-sm text-text-muted">
              Chủ Chiến binh: <span className="font-medium text-text">{member.displayName}</span>
            </p>
          )}
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {formatSeasons(seasons)}
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-text">Nhật ký</h3>
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
      ) : error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          Không tải được nhật ký: {error}
        </p>
      ) : filtered.length === 0 ? (
        <div className={`${cardClass} text-center text-sm text-text-muted`}>
          Chưa có nhật ký nào cho {birdName}.
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((record) => {
            const Icon = RECORD_ICONS[record.type]
            return (
              <div key={record.id} className={cardClass}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {typeLabel(record.type)}
                </span>
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
            )
          })}
        </div>
      )}

      {userId && (
        <Link
          to={`/thanh-vien/${userId}`}
          className="mt-5 block text-center text-sm font-medium text-primary"
        >
          ← Quay lại profile thành viên
        </Link>
      )}
    </div>
  )
}
