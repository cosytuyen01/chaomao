import { useEffect, useState } from 'react'
import { doc, onSnapshot, writeBatch } from 'firebase/firestore'
import { db } from '../firebase/config'
import { EMPTY_SCHEDULE, type DaySchedule } from '../types'
import { parseScheduleData } from '../utils/schedule'

export interface BirdScheduleMeta {
  ownerId: string
  updatedBy: string
}

export function useBirdSchedule(birdId: string | undefined) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(EMPTY_SCHEDULE)
  const [meta, setMeta] = useState<BirdScheduleMeta>({ ownerId: '', updatedBy: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!birdId) {
      setSchedule(EMPTY_SCHEDULE)
      setMeta({ ownerId: '', updatedBy: '' })
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = onSnapshot(
      doc(db, 'birdSchedules', birdId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          setSchedule(parseScheduleData(data as { days: DaySchedule[] }))
          setMeta({
            ownerId: (data.ownerId as string) ?? '',
            updatedBy: (data.updatedBy as string) ?? '',
          })
        } else {
          setSchedule(EMPTY_SCHEDULE)
          setMeta({ ownerId: '', updatedBy: '' })
        }
        setLoading(false)
      },
      () => {
        setSchedule(EMPTY_SCHEDULE)
        setMeta({ ownerId: '', updatedBy: '' })
        setLoading(false)
      },
    )

    return unsubscribe
  }, [birdId])

  return { schedule, meta, loading, setSchedule }
}

export async function saveBirdSchedules(
  birdIds: string[],
  days: DaySchedule[],
  ownerId: string,
  updatedBy?: string,
) {
  const batch = writeBatch(db)
  const payload = {
    days,
    ownerId,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy ?? '',
  }

  for (const id of birdIds) {
    batch.set(doc(db, 'birdSchedules', id), payload)
  }

  await batch.commit()
}
