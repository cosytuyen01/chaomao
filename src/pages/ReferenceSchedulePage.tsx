import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import DetailHero from '../components/detail/DetailHero'
import MemberBirdTabs, {
  type MemberBirdTab,
} from '../components/member-detail/MemberBirdTabs'
import ScheduleReadOnlyView from '../components/ScheduleReadOnlyView'
import SectionHeader from '../components/SectionHeader'
import { RECORD_ICONS } from '../components/icons'
import { db } from '../firebase/config'
import { useBirdRecords } from '../hooks/useBirdRecords'
import { useBirdSchedule } from '../hooks/useBirdSchedule'
import type { RecordType } from '../types'
import { HOME_BG } from '../utils/branding'
import { DEFAULT_BIRD_IMAGE, formatSeasons } from '../utils/bird'
import { resolveOwnerName } from '../utils/user'

const RECORD_TYPES: { value: RecordType; label: string }[] = [
  { value: 'di-dot', label: 'Đi dợt' },
  { value: 'di-thi', label: 'Đi thi' },
]

const TAB_SUBTITLES: Record<MemberBirdTab, string> = {
  schedule: 'Chế độ chiến binh',
  records: 'Nhật ký chiến binh',
}

const TAB_PARAM_MAP: Record<string, MemberBirdTab> = {
  schedule: 'schedule',
  'che-do': 'schedule',
  records: 'records',
  'nhat-ky': 'records',
}

function parseTabParam(value: string | null): MemberBirdTab {
  if (!value) return 'schedule'
  return TAB_PARAM_MAP[value] ?? 'schedule'
}

function typeLabel(type: RecordType) {
  return RECORD_TYPES.find((t) => t.value === type)?.label ?? type
}

function formatRecordDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}

export default function ReferenceSchedulePage() {
  const { birdId } = useParams<{ birdId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { schedule, meta, loading: scheduleLoading } = useBirdSchedule(birdId)
  const [birdName, setBirdName] = useState('')
  const [seasons, setSeasons] = useState(0)
  const [ownerId, setOwnerId] = useState('')
  const [ownerProfile, setOwnerProfile] = useState<{
    displayName?: string
    phone?: string
  } | null>(null)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState<MemberBirdTab>(() =>
    parseTabParam(searchParams.get('tab')),
  )

  const { records, loading: recordsLoading, error: recordsError } = useBirdRecords(
    ownerId,
    birdId,
  )

  const ownerName = resolveOwnerName(ownerProfile, { updatedBy: meta.updatedBy })

  useEffect(() => {
    setActiveTab(parseTabParam(searchParams.get('tab')))
  }, [searchParams])

  const handleTabChange = (tab: MemberBirdTab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'schedule' ? {} : { tab: 'nhat-ky' }, { replace: true })
  }

  useEffect(() => {
    if (!birdId) return

    setLoadingMeta(true)
    let unsubUser: (() => void) | undefined

    const unsubBird = onSnapshot(doc(db, 'birds', birdId), (snap) => {
      if (!snap.exists()) {
        setNotFound(true)
        setLoadingMeta(false)
        return
      }

      const data = snap.data()
      setBirdName(data.name as string)
      setSeasons((data.seasons as number) ?? 0)
      setNotFound(false)

      const nextOwnerId = (data.ownerId as string) || meta.ownerId
      setOwnerId(nextOwnerId)

      unsubUser?.()
      if (!nextOwnerId) {
        setOwnerProfile(null)
        setLoadingMeta(false)
        return
      }

      unsubUser = onSnapshot(doc(db, 'users', nextOwnerId), (userSnap) => {
        if (userSnap.exists()) {
          const userData = userSnap.data()
          setOwnerProfile({
            displayName: userData.displayName as string | undefined,
            phone: userData.phone as string | undefined,
          })
        } else {
          setOwnerProfile(null)
        }
        setLoadingMeta(false)
      })
    })

    return () => {
      unsubBird()
      unsubUser?.()
    }
  }, [birdId, meta.ownerId])

  if (loadingMeta || scheduleLoading) {
    return (
      <div className="bg-page px-4 py-12 text-center text-text-muted">
        Đang tải...
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-page px-4 py-8">
        <div className="card-modern p-8 text-center">
          <p className="font-bold text-text">Không tìm thấy chiến binh</p>
          <p className="mt-1 text-sm text-text-muted">
            Chiến binh có thể đã bị xóa.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-page">
      <DetailHero
        imageUrl={HOME_BG}
        imageAlt={birdName}
        title="Chi tiết chiến binh"
        subtitle={TAB_SUBTITLES[activeTab]}
      />

      <div className="relative z-10 px-4 pb-2">
        <div className="card-modern -mt-30 p-4">
          <div className="flex items-center gap-3.5">
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-4 ring-white">
              <img
                src={DEFAULT_BIRD_IMAGE}
                alt={birdName}
                className="h-full w-full object-cover"
              />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-text">{birdName}</h2>
              {ownerName && (
                <p className="mt-0.5 text-sm text-text-muted">
                  Chủ Chiến binh:{' '}
                  <span className="font-medium text-text">{ownerName}</span>
                </p>
              )}
              <span className="badge-pill mt-1.5">{formatSeasons(seasons)}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-border/60 pt-4">
            <MemberBirdTabs active={activeTab} onChange={handleTabChange} />
          </div>

          <div className="mt-4 border-t border-border/60 pt-4">
            {activeTab === 'schedule' ? (
              <>
                <SectionHeader title="Chế độ trong tuần" className="!mb-3" />
                <ScheduleReadOnlyView schedule={schedule} embedded />
              </>
            ) : (
              <>
                <SectionHeader
                  title="Nhật ký"
                  subtitle={
                    records.length > 0 ? `${records.length} mục nhật ký` : undefined
                  }
                  className="!mb-3"
                />

                {recordsLoading ? (
                  <p className="py-6 text-center text-sm text-text-muted">Đang tải...</p>
                ) : recordsError ? (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                    Không tải được nhật ký: {recordsError}
                  </p>
                ) : records.length === 0 ? (
                  <p className="rounded-2xl bg-page py-8 text-center text-sm text-text-muted">
                    Chưa có nhật ký nào cho {birdName}.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {records.map((record) => {
                      const Icon = RECORD_ICONS[record.type]
                      return (
                        <div
                          key={record.id}
                          className="flex items-start gap-3.5 rounded-2xl bg-page p-3.5"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
