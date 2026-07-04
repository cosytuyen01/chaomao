import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Bird } from '../types'

export function useBirds(userId: string | undefined) {
  const [birds, setBirds] = useState<Bird[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setBirds([])
      setLoading(false)
      return
    }

    const q = query(collection(db, 'birds'), where('ownerId', '==', userId))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((d) => {
            const item = d.data()
            return {
              id: d.id,
              name: item.name,
              seasons: item.seasons ?? 0,
              pellets: item.pellets ?? '',
              ownerId: item.ownerId,
              createdAt: item.createdAt?.toDate?.()?.toISOString() ?? '',
            } as Bird
          })
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        setBirds(data)
        setLoading(false)
      },
      () => setLoading(false),
    )

    return unsubscribe
  }, [userId])

  const addBird = async (
    name: string,
    seasons: number,
    ownerId: string,
    pellets = '',
  ) => {
    await addDoc(collection(db, 'birds'), {
      name: name.trim(),
      seasons,
      pellets: pellets.trim(),
      ownerId,
      createdAt: serverTimestamp(),
    })
  }

  const updateBird = async (
    id: string,
    data: Pick<Bird, 'name' | 'seasons' | 'pellets'>,
  ) => {
    await updateDoc(doc(db, 'birds', id), {
      name: data.name.trim(),
      seasons: data.seasons,
      pellets: data.pellets.trim(),
    })
  }

  const removeBird = async (id: string) => {
    await deleteDoc(doc(db, 'birds', id))
    try {
      await deleteDoc(doc(db, 'birdSchedules', id))
    } catch {
      // schedule doc may not exist
    }
  }

  return { birds, loading, addBird, updateBird, removeBird }
}
