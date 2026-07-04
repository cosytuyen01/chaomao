import type { DayKey } from '../types'

interface CopyDayCareSelectProps {
  currentDay: DayKey
  options: { day: DayKey; label: string }[]
  onCopyFrom: (sourceDay: DayKey) => void
}

export default function CopyDayCareSelect({
  currentDay,
  options,
  onCopyFrom,
}: CopyDayCareSelectProps) {
  const otherDays = options.filter((d) => d.day !== currentDay)
  if (otherDays.length === 0) return null

  return (
    <label className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-white/90">
      <span className="whitespace-nowrap">Giống</span>
      <select
        className="max-w-[6.5rem] truncate rounded-lg border border-white/30 bg-white/15 px-2 py-1 text-xs text-white backdrop-blur-sm transition hover:bg-white/25 focus:border-white/50 focus:outline-none"
        defaultValue=""
        onChange={(e) => {
          const source = e.target.value as DayKey
          if (source) {
            onCopyFrom(source)
            e.target.value = ''
          }
        }}
      >
        <option value="" disabled className="text-text">
          Chọn ngày...
        </option>
        {otherDays.map((d) => (
          <option key={d.day} value={d.day} className="text-text">
            {d.label}
          </option>
        ))}
      </select>
    </label>
  )
}
