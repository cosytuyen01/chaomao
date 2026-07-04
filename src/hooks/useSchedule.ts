import { useAuth } from '../context/AuthContext'
import { useBirds } from './useBirds'
import { useBirdSchedule } from './useBirdSchedule'
import { getTodaySchedule } from '../utils/schedule'

export function useSchedule() {
  const { user } = useAuth()
  const { birds, loading: birdsLoading } = useBirds(user?.uid)
  const firstBird = birds[0]
  const { schedule, loading: scheduleLoading } = useBirdSchedule(firstBird?.id)

  return {
    schedule,
    today: getTodaySchedule(schedule),
    birdName: firstBird?.name,
    loading: birdsLoading || scheduleLoading,
  }
}
