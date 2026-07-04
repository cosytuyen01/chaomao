import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import ScheduleReadOnlyView from '../components/ScheduleReadOnlyView'
import { Bird as BirdIcon } from '../components/icons'
import { useBirdSchedule } from '../hooks/useBirdSchedule'
import { formatSeasons } from '../utils/bird'
import { resolveOwnerName } from '../utils/user'

export default function ReferenceSchedulePage() {
  const { birdId } = useParams<{ birdId: string }>()
  const { schedule, meta, loading: scheduleLoading } = useBirdSchedule(birdId)
  const [birdName, setBirdName] = useState('')
  const [seasons, setSeasons] = useState(0)
  const [ownerProfile, setOwnerProfile] = useState<{
    displayName?: string
    phone?: string
  } | null>(null)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const ownerName = resolveOwnerName(ownerProfile, { updatedBy: meta.updatedBy })

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
    return <p className="py-12 text-center text-text-muted">Đang tải...</p>
  }

  if (notFound) {
    return (
      <div className="rounded-xl border border-border/80 bg-white p-8 text-center shadow-sm">
        <p className="font-medium text-text">Không tìm thấy chiến binh</p>
        <p className="mt-1 text-sm text-text-muted">
          Chế độ đi tham khảo có thể đã bị xóa.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-border/80 bg-white p-4 shadow-sm">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BirdIcon className="h-8 w-8" strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-text">{birdName}</h2>
          {ownerName && (
            <p className="text-sm text-text-muted">
              Chủ chim: <span className="font-medium text-text">{ownerName}</span>
            </p>
          )}
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {formatSeasons(seasons)}
          </span>
        </div>
      </div>

      <ScheduleReadOnlyView schedule={schedule} />
    </div>
  )
}
