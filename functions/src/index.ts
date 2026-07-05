import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions/v2'
import { runScheduleReminders } from './reminders.js'

initializeApp()

export const sendScheduleReminders = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'Asia/Ho_Chi_Minh',
    region: 'asia-southeast1',
  },
  async () => {
    try {
      const result = await runScheduleReminders(getFirestore(), getMessaging())
      logger.info('Reminders run', result)
    } catch (error) {
      logger.error('Reminders failed', error)
    }
  },
)
