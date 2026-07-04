import { useEffect } from 'react'
import type { BirdScheduleEntry } from './useAllBirdSchedules'
import type { DaySchedule } from '../types'
import { DAY_INDEX_TO_KEY } from '../utils/schedule'

const NOTIFIED_PREFIX = 'ccm_notified_'

interface ScheduleReminder {
  id: string
  time: string
  title: string
  body: string
}

function getTodayKey(): string {
  return DAY_INDEX_TO_KEY[new Date().getDay()]
}

function buildReminders(entries: BirdScheduleEntry[]): ScheduleReminder[] {
  const todayKey = getTodayKey()
  const reminders: ScheduleReminder[] = []

  for (const entry of entries) {
    const today = entry.days.find((d) => d.day === todayKey)
    if (!today) continue

    const care = today.care

    if (care.sunbathingTime) {
      reminders.push({
        id: `${entry.birdId}-sun-${todayKey}`,
        time: care.sunbathingTime,
        title: `Phơi nắng — ${entry.birdName}`,
        body: care.sunbathingDuration
          ? `Đến giờ phơi nắng ${care.sunbathingDuration} phút`
          : 'Đến giờ phơi nắng cho chào mào',
      })
    }

    if (care.bathingTime) {
      reminders.push({
        id: `${entry.birdId}-bath-${todayKey}`,
        time: care.bathingTime,
        title: `Tắm — ${entry.birdName}`,
        body: 'Đến giờ tắm cho chào mào',
      })
    }
  }

  return reminders
}

function isSameMinute(time: string, now: Date): boolean {
  const [hours, minutes] = time.split(':').map(Number)
  return now.getHours() === hours && now.getMinutes() === minutes
}

function todayDateKey(): string {
  return new Date().toISOString().split('T')[0]
}

function showReminder(reminder: ScheduleReminder) {
  new Notification(`🐦 ${reminder.title}`, {
    body: reminder.body,
    icon: '/favicon.svg',
    tag: reminder.id,
  })
}

export function useScheduleReminders(
  enabled: boolean,
  entries: BirdScheduleEntry[],
) {
  useEffect(() => {
    if (!enabled || !('Notification' in window)) return

    const checkAndNotify = () => {
      const now = new Date()
      const dateKey = todayDateKey()
      const reminders = buildReminders(entries)

      for (const reminder of reminders) {
        if (!isSameMinute(reminder.time, now)) continue

        const storageKey = `${NOTIFIED_PREFIX}${reminder.id}_${dateKey}`
        if (localStorage.getItem(storageKey)) continue

        if (Notification.permission === 'granted') {
          showReminder(reminder)
          localStorage.setItem(storageKey, '1')
        }
      }
    }

    const interval = setInterval(checkAndNotify, 30_000)
    checkAndNotify()

    return () => clearInterval(interval)
  }, [enabled, entries])
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function sendTestNotification(day: DaySchedule, birdName = 'Chào mào') {
  if (Notification.permission !== 'granted') return

  const care = day.care
  if (care.sunbathingTime) {
    showReminder({
      id: 'test-sun',
      time: care.sunbathingTime,
      title: `Phơi nắng — ${birdName}`,
      body: care.sunbathingDuration
        ? `Phơi nắng ${care.sunbathingDuration} phút`
        : 'Đến giờ phơi nắng',
    })
    return
  }

  new Notification('🐦 Chào Chào Mao — Hôm nay', {
    body: care.fruit.trim() || 'Chưa có lịch phơi nắng hôm nay',
    icon: '/favicon.svg',
  })
}

export function getTodayRemindersPreview(entries: BirdScheduleEntry[]): ScheduleReminder[] {
  return buildReminders(entries)
}
