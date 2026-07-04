import { CARE_ICONS } from './icons'
import { SIMPLE_CARE_ITEMS, TIMED_CARE_ITEMS, type DaySchedule } from '../types'
import { getCareDisplayValue, hasCareContent } from '../utils/care'

interface ScheduleReadOnlyViewProps {
  schedule: DaySchedule[]
}

export default function ScheduleReadOnlyView({ schedule }: ScheduleReadOnlyViewProps) {
  return (
    <div className="space-y-4">
      {schedule.map((day) => {
        const care = day.care
        const hasCare = hasCareContent(care)

        return (
          <div
            key={day.day}
            className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm"
          >
            <div className="bg-primary px-4 py-2.5">
              <span className="font-semibold text-white">{day.label}</span>
            </div>
            <div className="space-y-3 p-4">
              {!hasCare ? (
                <p className="text-sm text-text-muted">Chưa có thông tin.</p>
              ) : (
                <>
                  {SIMPLE_CARE_ITEMS.map((item) => {
                    const value = care[item.key].trim()
                    if (!value) return null
                    const Icon = CARE_ICONS[item.key]
                    return (
                      <div key={item.key} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-text-muted">{item.label}</p>
                          <p className="font-medium text-text">{value}</p>
                        </div>
                      </div>
                    )
                  })}
                  {TIMED_CARE_ITEMS.map((item) => {
                    const value = getCareDisplayValue(
                      care,
                      item.iconKey,
                    )
                    if (!value) return null
                    const Icon = CARE_ICONS[item.iconKey]
                    return (
                      <div key={item.iconKey} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-text-muted">{item.label}</p>
                          <p className="font-medium text-text">{value}</p>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
