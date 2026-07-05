import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions/v2'

initializeApp()

const DAY_INDEX_TO_KEY = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

type DayKey = (typeof DAY_INDEX_TO_KEY)[number]

interface Reminder {
  id: string
  time: string
  title: string
  body: string
}

function getVnDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    dayIndex: new Date(
      `${get('year')}-${get('month')}-${get('day')}T12:00:00+07:00`,
    ).getUTCDay(),
  }
}

function buildReminders(
  birdId: string,
  birdName: string,
  todayKey: DayKey,
  days: Array<{ day: string; care: Record<string, string> }>,
): Reminder[] {
  const today = days.find((d) => d.day === todayKey)
  if (!today) return []

  const care = today.care ?? {}
  const reminders: Reminder[] = []

  if (care.sunbathingTime) {
    reminders.push({
      id: `${birdId}-sun-${todayKey}`,
      time: care.sunbathingTime,
      title: `Phơi nắng — ${birdName}`,
      body: care.sunbathingDuration
        ? `Đến giờ phơi nắng ${care.sunbathingDuration} phút`
        : 'Đến giờ phơi nắng cho chào mào',
    })
  }

  if (care.bathingTime) {
    reminders.push({
      id: `${birdId}-bath-${todayKey}`,
      time: care.bathingTime,
      title: `Tắm — ${birdName}`,
      body: 'Đến giờ tắm cho chào mào',
    })
  }

  return reminders
}

function matchesMinute(time: string, hour: number, minute: number): boolean {
  const [h, m] = time.split(':').map(Number)
  return h === hour && m === minute
}

export const sendScheduleReminders = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'Asia/Ho_Chi_Minh',
    region: 'asia-southeast1',
  },
  async () => {
    const db = getFirestore()
    const messaging = getMessaging()
    const { dateKey, hour, minute, dayIndex } = getVnDateParts()
    const todayKey = DAY_INDEX_TO_KEY[dayIndex]

    const settingsSnap = await db
      .collection('notificationSettings')
      .where('enabled', '==', true)
      .get()

    if (settingsSnap.empty) return

    for (const settingDoc of settingsSnap.docs) {
      const userId = settingDoc.id

      const [birdsSnap, tokensSnap] = await Promise.all([
        db.collection('birds').where('ownerId', '==', userId).get(),
        db.collection('users').doc(userId).collection('fcmTokens').get(),
      ])

      if (birdsSnap.empty || tokensSnap.empty) continue

      const tokens = tokensSnap.docs
        .map((d) => d.data().token as string)
        .filter(Boolean)

      if (tokens.length === 0) continue

      const dueReminders: Reminder[] = []

      for (const birdDoc of birdsSnap.docs) {
        const bird = birdDoc.data()
        const scheduleSnap = await db.collection('birdSchedules').doc(birdDoc.id).get()
        const days = (scheduleSnap.data()?.days as Array<{
          day: string
          care: Record<string, string>
        }>) ?? []

        const reminders = buildReminders(
          birdDoc.id,
          (bird.name as string) ?? 'Chào mào',
          todayKey,
          days,
        )

        for (const reminder of reminders) {
          if (!matchesMinute(reminder.time, hour, minute)) continue

          const logId = `${userId}_${dateKey}_${reminder.id}`
          const logRef = db.collection('reminderLogs').doc(logId)
          const logSnap = await logRef.get()
          if (logSnap.exists) continue

          dueReminders.push(reminder)
          await logRef.set({
            userId,
            reminderId: reminder.id,
            dateKey,
            sentAt: Timestamp.now(),
          })
        }
      }

      if (dueReminders.length === 0) continue

      for (const reminder of dueReminders) {
        try {
          await messaging.sendEachForMulticast({
            tokens,
            notification: {
              title: `🐦 ${reminder.title}`,
              body: reminder.body,
            },
            data: {
              tag: reminder.id,
              title: reminder.title,
              body: reminder.body,
            },
            webpush: {
              fcmOptions: { link: 'https://chaomao.vercel.app/' },
            },
          })
          logger.info('Sent reminder', { userId, reminderId: reminder.id })
        } catch (error) {
          logger.error('Failed to send reminder', { userId, error })
        }
      }
    }
  },
)
