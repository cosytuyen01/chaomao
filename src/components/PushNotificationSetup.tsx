import { useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { useReminderBanner } from '../context/ReminderContext'
import { db } from '../firebase/config'
import { listenForForegroundPush, registerPushToken } from '../firebase/messaging'
import { showSystemNotification } from '../utils/notifications'

export default function PushNotificationSetup() {
  const { user } = useAuth()
  const { showInApp } = useReminderBanner()

  useEffect(() => {
    if (!user) return

    let enabled = false

    const unsubSettings = onSnapshot(doc(db, 'notificationSettings', user.uid), (snap) => {
      enabled = snap.exists() ? Boolean(snap.data().enabled) : false
      if (enabled && Notification.permission === 'granted') {
        void registerPushToken(user.uid)
      }
    })

    const unsubForeground = listenForForegroundPush((title, body, tag) => {
      showInApp({
        id: tag,
        title: title.replace(/^🐦\s*/, ''),
        body,
        time: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      void showSystemNotification({ title, body, tag })
    })

    return () => {
      unsubSettings()
      unsubForeground()
    }
  }, [user, showInApp])

  return null
}
