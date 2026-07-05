import { CARE_ICONS } from './icons'
import type { DayCare } from '../types'
import { TIMED_CARE_ITEMS } from '../types'

const labelClass = 'flex flex-col gap-1.5 text-sm font-medium text-text-muted'
const inputClass =
  'rounded-xl border-0 bg-input-blue px-3 py-2.5 text-base text-text transition focus:ring-3 focus:ring-primary/15 focus:outline-none'

interface TimedCareFieldsProps {
  care: DayCare
  onChange: (field: keyof DayCare, value: string) => void
}

export default function TimedCareFields({ care, onChange }: TimedCareFieldsProps) {
  return (
    <>
      {TIMED_CARE_ITEMS.map((item) => {
        const Icon = CARE_ICONS[item.iconKey]
        return (
          <div key={item.iconKey} className="col-span-1 md:col-span-2">
            <div className="rounded-xl bg-input-beige/60 p-3">
              <span className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted">
                <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                {item.label}
              </span>
              {item.hasDuration ? (
                <div className="grid grid-cols-2 gap-3">
                  <label className={labelClass}>
                    Giờ
                    <input
                      type="time"
                      className={inputClass}
                      value={care[item.timeKey]}
                      onChange={(e) => onChange(item.timeKey, e.target.value)}
                    />
                  </label>
                  <label className={labelClass}>
                    Bao lâu (phút)
                    <input
                      type="number"
                      min={1}
                      className={inputClass}
                      placeholder="VD: 20"
                      value={item.durationKey ? care[item.durationKey] : ''}
                      onChange={(e) =>
                        item.durationKey && onChange(item.durationKey, e.target.value)
                      }
                    />
                  </label>
                </div>
              ) : (
                <label className={labelClass}>
                  Giờ
                  <input
                    type="time"
                    className={inputClass}
                    value={care[item.timeKey]}
                    onChange={(e) => onChange(item.timeKey, e.target.value)}
                  />
                </label>
              )}
              <p className="mt-2 text-xs text-primary">
                Hệ thống sẽ nhắc đúng giờ{' '}
                {item.label === 'Phơi nắng' ? 'phơi nắng' : 'tắm'}
              </p>
            </div>
          </div>
        )
      })}
      <div className="col-span-1 md:col-span-2">
        <label className={labelClass}>
          <span className="inline-flex items-center gap-1.5">
            <CARE_ICONS.notes className="h-4 w-4 text-primary" strokeWidth={2} />
            Ghi chú
          </span>
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Ghi chú thêm cho ngày này..."
            value={care.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            rows={3}
          />
        </label>
      </div>
    </>
  )
}
