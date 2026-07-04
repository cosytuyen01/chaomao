import {
  EMPTY_SCHEDULE,
  type DayKey,
  type DaySchedule,
  type WeeklySchedule,
} from '../types'
import { normalizeCare } from './care'

export const DAY_INDEX_TO_KEY: DayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export function normalizeScheduleDays(days?: DaySchedule[]): DaySchedule[] {
  if (!days?.length) return EMPTY_SCHEDULE
  return days.map((day) => ({
    ...day,
    care: normalizeCare(day.care),
  }))
}

export function parseScheduleData(data: WeeklySchedule | undefined): DaySchedule[] {
  return normalizeScheduleDays(data?.days)
}

export function getTodaySchedule(schedule: DaySchedule[]): DaySchedule | undefined {
  const dayKey = DAY_INDEX_TO_KEY[new Date().getDay()]
  return schedule.find((d) => d.day === dayKey)
}
