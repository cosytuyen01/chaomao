import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { runScheduleReminders } from '../../shared/reminders'

function initAdmin() {
  if (getApps().length) return

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!raw) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY')
  }

  initializeApp({
    credential: cert(JSON.parse(raw) as Parameters<typeof cert>[0]),
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.authorization
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  try {
    initAdmin()
    const result = await runScheduleReminders(getFirestore(), getMessaging())
    return res.status(200).json({ ok: true, ...result })
  } catch (error) {
    console.error('reminder cron failed:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Cron failed',
    })
  }
}
