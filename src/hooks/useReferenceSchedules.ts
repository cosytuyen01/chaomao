import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Bird, DaySchedule } from '../types'
import { hasCareContent } from '../utils/care'
import { parseScheduleData } from '../utils/schedule'
import { resolveOwnerName } from '../utils/user'

export interface ReferenceScheduleEntry {
  birdId: string
  birdName: string
  seasons: number
  pellets: string
  ownerId: string
  ownerName: string
  days: DaySchedule[]
}

function mapBird(id: string, data: Record<string, unknown>): Bird {
  return {
    id,
    name: data.name as string,
    seasons: (data.seasons as number) ?? 0,
    pellets: (data.pellets as string) ?? '',
    ownerId: data.ownerId as string,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? '',
  }
}

function hasScheduleContent(days: DaySchedule[]): boolean {
  return days.some((day) => hasCareContent(day.care))
}

export function useReferenceSchedules(userId: string | undefined) {
  const [entries, setEntries] = useState<ReferenceScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setEntries([])
      setLoading(false)
      return
    }

    setLoading(true)
    const schedules = new Map<string, DaySchedule[]>()
    const ownerProfiles = new Map<string, { displayName?: string; phone?: string }>()
    const scheduleOwnerNames = new Map<string, string>()
    let birds: Bird[] = []
    const scheduleUnsubs = new Map<string, () => void>()
    const ownerUnsubs = new Map<string, () => void>()

    const getOwnerName = (ownerId: string) =>
      resolveOwnerName(ownerProfiles.get(ownerId), {
        updatedBy: scheduleOwnerNames.get(ownerId),
      })

    const rebuild = () => {
      setEntries(
        birds
          .map((bird) => ({
            birdId: bird.id,
            birdName: bird.name,
            seasons: bird.seasons,
            pellets: bird.pellets,
            ownerId: bird.ownerId,
            ownerName: getOwnerName(bird.ownerId),
            days: schedules.get(bird.id) ?? [],
          }))
          .filter((entry) => hasScheduleContent(entry.days))
          .sort((a, b) => a.birdName.localeCompare(b.birdName, 'vi')),
      )
      setLoading(false)
    }

    const syncScheduleListeners = (nextBirds: Bird[]) => {
      const nextIds = new Set(nextBirds.map((b) => b.id))

      for (const [id, unsub] of scheduleUnsubs) {
        if (!nextIds.has(id)) {
          unsub()
          scheduleUnsubs.delete(id)
          schedules.delete(id)
        }
      }

      for (const bird of nextBirds) {
        if (scheduleUnsubs.has(bird.id)) continue
        const unsub = onSnapshot(doc(db, 'birdSchedules', bird.id), (snap) => {
          if (snap.exists()) {
            const data = snap.data()
            schedules.set(
              bird.id,
              parseScheduleData(data as { days: DaySchedule[] }),
            )
            const ownerId = (data.ownerId as string) || bird.ownerId
            const updatedBy = (data.updatedBy as string)?.trim()
            if (ownerId && updatedBy) {
              scheduleOwnerNames.set(ownerId, updatedBy)
            }
          } else {
            schedules.set(bird.id, [])
          }
          rebuild()
        })
        scheduleUnsubs.set(bird.id, unsub)
      }

      const ownerIds = new Set(nextBirds.map((b) => b.ownerId))
      for (const [id, unsub] of ownerUnsubs) {
        if (!ownerIds.has(id)) {
          unsub()
          ownerUnsubs.delete(id)
          ownerProfiles.delete(id)
        }
      }

      for (const ownerId of ownerIds) {
        if (ownerUnsubs.has(ownerId)) continue
        const unsub = onSnapshot(doc(db, 'users', ownerId), (snap) => {
          if (snap.exists()) {
            const data = snap.data()
            ownerProfiles.set(ownerId, {
              displayName: data.displayName as string | undefined,
              phone: data.phone as string | undefined,
            })
          } else {
            ownerProfiles.delete(ownerId)
          }
          rebuild()
        })
        ownerUnsubs.set(ownerId, unsub)
      }
    }

    const unsubBirds = onSnapshot(
      query(collection(db, 'birds'), where('ownerId', '!=', userId)),
      (snapshot) => {
        birds = snapshot.docs.map((d) => mapBird(d.id, d.data()))
        syncScheduleListeners(birds)
        rebuild()
      },
      () => setLoading(false),
    )

    return () => {
      unsubBirds()
      scheduleUnsubs.forEach((unsub) => unsub())
      ownerUnsubs.forEach((unsub) => unsub())
    }
  }, [userId])

  return { entries, loading }
}
