import { Link } from 'react-router-dom'
import { CARE_ITEMS, type DaySchedule } from '../types'
import { getCareDisplayValue, hasCareContent } from '../utils/care'
import { CARE_ICONS } from './icons'

interface TodayScheduleCardProps {
  today?: DaySchedule
  birdName?: string
}

export default function TodayScheduleCard({ today, birdName }: TodayScheduleCardProps) {
  const care = today?.care
  const hasCare = care && hasCareContent(care)

  return (
    <div className="overflow-hidden rounded-2xl shadow-xs bg-white">
      <div className="bg-primary px-4 py-3 rounded-t-2xl">
        <h2 className="font-bold text-white">Chế độ hôm nay</h2>
        <p className="text-xs text-white/80">
          {birdName ? `${birdName} · ` : ''}
          {today?.label ?? 'Hôm nay'}
        </p>
      </div>

      <div className="space-y-3 p-4">
        {hasCare ? (
          CARE_ITEMS.map((item) => {
            const value = getCareDisplayValue(care, item.key)
            if (!value) return null
            const Icon = CARE_ICONS[item.key]
            return (
              <div key={item.key} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-muted">{item.label}</p>
                  <p className="font-medium text-text">{value}</p>
                </div>
              </div>
            )
          })
        ) : (
          <p className="py-2 text-sm text-text-muted">
            Chưa có Chế độ cho hôm nay. Hãy cập nhật Chế độ.
          </p>
        )}

        <Link
          to="/che-do-di"
          className="mt-2 block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Xem Chế độ 7 ngày
        </Link>
      </div>
    </div>
  )
}
