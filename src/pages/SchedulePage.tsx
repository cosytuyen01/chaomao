import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DetailHero from '../components/detail/DetailHero'
import SectionHeader from '../components/SectionHeader'
import { useAuth } from '../context/AuthContext'
import { useBirds } from '../hooks/useBirds'
import { saveBirdSchedules, useBirdSchedule } from '../hooks/useBirdSchedule'
import ApplySharedSwitch from '../components/ApplySharedSwitch'
import BirdSelector from '../components/BirdSelector'
import CopyDayCareSelect from '../components/CopyDayCareSelect'
import TimedCareFields from '../components/TimedCareFields'
import { CARE_ICONS } from '../components/icons'
import {
  EMPTY_SCHEDULE,
  SIMPLE_CARE_ITEMS,
  type DayCare,
  type DayKey,
  type DaySchedule,
} from '../types'
import { HOME_BG } from '../utils/branding'

const labelClass = 'flex flex-col gap-1.5 text-sm font-medium text-text-muted'
const inputClass =
  'w-full rounded-2xl border border-border/60 bg-input-blue px-4 py-3 text-base text-text transition focus:ring-3 focus:ring-primary/15 focus:outline-none'

export default function SchedulePage() {
  const { user } = useAuth()
  const { birds, loading: birdsLoading } = useBirds(user?.uid)
  const [selectedBirdId, setSelectedBirdId] = useState('')
  const [applyToAll, setApplyToAll] = useState(false)
  const [schedule, setSchedule] = useState<DaySchedule[]>(EMPTY_SCHEDULE)
  const [loadingSchedule, setLoadingSchedule] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const activeBirdId = selectedBirdId || birds[0]?.id
  const { schedule: loadedSchedule, loading: birdScheduleLoading } =
    useBirdSchedule(activeBirdId)

  useEffect(() => {
    if (birds.length && !selectedBirdId) {
      setSelectedBirdId(birds[0].id)
    }
  }, [birds, selectedBirdId])

  useEffect(() => {
    if (!activeBirdId) {
      setSchedule(EMPTY_SCHEDULE)
      setLoadingSchedule(false)
      return
    }
    if (!birdScheduleLoading) {
      setSchedule(loadedSchedule)
      setLoadingSchedule(false)
    }
  }, [activeBirdId, loadedSchedule, birdScheduleLoading])

  const updateCare = (dayKey: string, field: keyof DayCare, value: string) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.day === dayKey
          ? { ...day, care: { ...day.care, [field]: value } }
          : day,
      ),
    )
  }

  const copyCareFromDay = (targetDay: DayKey, sourceDay: DayKey) => {
    setSchedule((prev) => {
      const source = prev.find((d) => d.day === sourceDay)?.care
      if (!source) return prev
      return prev.map((day) =>
        day.day === targetDay ? { ...day, care: { ...source } } : day,
      )
    })
  }

  const handleSave = async () => {
    if (!user || birds.length === 0) return

    setSaving(true)
    setMessage('')

    try {
      const targetIds = applyToAll ? birds.map((b) => b.id) : [activeBirdId]
      await saveBirdSchedules(
        targetIds,
        schedule,
        user.uid,
        user.displayName ?? undefined,
      )
      setMessage(
        applyToAll
          ? `Đã lưu chế độ chung cho ${birds.length} Chiến binh!`
          : 'Đã lưu chế độ!',
      )
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Lỗi khi lưu. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const selectedBird = birds.find((b) => b.id === activeBirdId)

  const modeLabel = applyToAll
    ? 'Chế độ chung cho tất cả chiến binh'
    : `Chế độ riêng cho ${selectedBird?.name ?? 'Chiến binh'}`

  return (
    <div className="bg-page">
      <DetailHero
        imageUrl={HOME_BG}
        imageAlt="Chế độ"
        title="Chế độ"
        subtitle="Chăm sóc 7 ngày trong tuần"
        showBack={false}
      />

      <div className="relative z-10 space-y-4 px-4 pb-2">
        {birdsLoading ? (
          <p className="-mt-8 py-12 text-center text-text-muted">Đang tải...</p>
        ) : birds.length === 0 ? (
          <div className="card-modern -mt-12 p-8 text-center">
            <p className="font-bold text-text">Chưa có Chiến binh nào</p>
            <p className="mt-1 text-sm text-text-muted">
              Thêm chào mào trước khi tạo chế độ.
            </p>
            <Link
              to="/birds"
              className="btn-primary mt-5 inline-block px-6"
            >
              Thêm chiến binh
            </Link>
          </div>
        ) : (
          <>
            <div className="card-modern -mt-30 space-y-4 p-4">
              <p className="text-sm font-medium text-text-muted">{modeLabel}</p>
              <ApplySharedSwitch checked={applyToAll} onChange={setApplyToAll} />

              {!applyToAll && (
                <div>
                  <p className="mb-2 text-sm font-medium text-text-muted">
                    Chọn Chiến binh
                  </p>
                  <BirdSelector
                    birds={birds}
                    selectedId={activeBirdId}
                    onSelect={setSelectedBirdId}
                  />
                </div>
              )}
            </div>

            {loadingSchedule ? (
              <p className="py-12 text-center text-text-muted">Đang tải chế độ...</p>
            ) : (
              <section className="space-y-4">
                <SectionHeader title="Lịch trong tuần" />

                {schedule.map((day) => (
                  <div key={day.day} className="card-modern overflow-hidden">
                    <div className="flex items-center justify-between gap-2 bg-primary px-4 py-2.5">
                      <span className="font-semibold text-white">{day.label}</span>
                      <CopyDayCareSelect
                        currentDay={day.day}
                        options={schedule.map((d) => ({ day: d.day, label: d.label }))}
                        onCopyFrom={(source) => copyCareFromDay(day.day, source)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
                      {SIMPLE_CARE_ITEMS.map((item) => {
                        const Icon = CARE_ICONS[item.key]
                        return (
                          <label key={item.key} className={labelClass}>
                            <span className="inline-flex items-center gap-1.5">
                              <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                              {item.label}
                            </span>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder={`Nhập ${item.label.toLowerCase()}...`}
                              value={day.care[item.key]}
                              onChange={(e) =>
                                updateCare(day.day, item.key, e.target.value)
                              }
                            />
                          </label>
                        )
                      })}
                      <TimedCareFields
                        care={day.care}
                        onChange={(field, value) => updateCare(day.day, field, value)}
                      />
                    </div>
                  </div>
                ))}
              </section>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loadingSchedule}
                className="btn-primary w-full disabled:opacity-60"
              >
                {saving
                  ? 'Đang lưu...'
                  : applyToAll
                    ? 'Lưu chế độ chung'
                    : 'Lưu chế độ'}
              </button>
              {message && (
                <p className="rounded-2xl bg-success/10 px-4 py-2.5 text-center text-sm text-success">
                  {message}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
