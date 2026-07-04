import { Link } from 'react-router-dom'
import { Bird, Calendar } from './icons'
import type { ReferenceScheduleEntry } from '../hooks/useReferenceSchedules'
import { formatSeasons } from '../utils/bird'
import { getTodaySchedule } from '../utils/schedule'
import { getCareDisplayValue, hasCareContent } from '../utils/care'

interface ReferenceScheduleSectionProps {
  entries: ReferenceScheduleEntry[]
  loading: boolean
}

export default function ReferenceScheduleSection({
  entries,
  loading,
}: ReferenceScheduleSectionProps) {
  if (loading) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-bold text-text">Tham khảo chế độ</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-36 w-[220px] shrink-0 animate-pulse rounded-xl bg-white"
            />
          ))}
        </div>
      </section>
    )
  }

  if (entries.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-bold text-text">Tham khảo chế độ</h2>
        <div className="rounded-xl border border-border/80 bg-white p-6 text-center text-sm text-text-muted shadow-sm">
          Chưa có chế độ tham khảo từ thành viên khác.
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-text">Tham khảo chế độ</h2>
        <p className="mt-0.5 text-sm text-text-muted">
          Xem chế độ của chiến binh từ thành viên khác
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {entries.map((entry) => {
          const today = getTodaySchedule(entry.days)
          const todayCare = today?.care
          const todayPreview =
            todayCare && hasCareContent(todayCare)
              ? getCareDisplayValue(todayCare, 'sunbathing') ||
                getCareDisplayValue(todayCare, 'fruit') ||
                getCareDisplayValue(todayCare, 'liveFood') ||
                'Có chế độ hôm nay'
              : 'Xem chi tiết 7 ngày'

          return (
            <Link
              key={entry.birdId}
              to={`/che-do-di/tham-khao/${entry.birdId}`}
              className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm transition hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 bg-primary/8 px-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bird className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text">{entry.birdName}</p>
                  <p className="truncate text-xs text-text-muted">
                    {entry.ownerName ? `Chủ: ${entry.ownerName}` : '\u00A0'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 p-3">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {formatSeasons(entry.seasons)}
                </span>
                <p className="line-clamp-2 text-sm text-text-muted">
                  <Calendar className="mr-1 inline h-3.5 w-3.5 -translate-y-px" strokeWidth={2} />
                  {today?.label}: {todayPreview}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
