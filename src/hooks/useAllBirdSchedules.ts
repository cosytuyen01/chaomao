import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Bird, DaySchedule } from '../types'
import { parseScheduleData } from '../utils/schedule'

export interface BirdScheduleEntry {
  birdId: string
  birdName: string
  days: DaySchedule[]
}

export function useAllBirdSchedules(birds: Bird[]) {
  const [entries, setEntries] = useState<BirdScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (birds.length === 0) {
      setEntries([])
      setLoading(false)
      return
    }

    setLoading(true)
    const schedules = new Map<string, DaySchedule[]>()
    const unsubs = birds.map((bird) =>
      onSnapshot(doc(db, 'birdSchedules', bird.id), (snap) => {
        schedules.set(
          bird.id,
          snap.exists() ? parseScheduleData(snap.data() as { days: DaySchedule[] }) : [],
        )
        setEntries(
          birds.map((b) => ({
            birdId: b.id,
            birdName: b.name,
            days: schedules.get(b.id) ?? [],
          })),
        )
        setLoading(false)
      }),
    )

    return () => unsubs.forEach((u) => u())
  }, [birds])

  return { entries, loading }
}
