import type { DayCare } from '../types'

type LegacyCare = Partial<DayCare> & {
  pellets?: string
  sunbathing?: string
  bathing?: string
  bathingDuration?: string
}

export function normalizeCare(care?: LegacyCare): DayCare {
  const c = care ?? {}
  return {
    fruit: c.fruit ?? '',
    liveFood: c.liveFood ?? '',
    vitamin: c.vitamin ?? '',
    sunbathingTime: c.sunbathingTime ?? '',
    sunbathingDuration: c.sunbathingDuration ?? legacyDuration(c.sunbathing),
    bathingTime: c.bathingTime ?? legacyBathingTime(c.bathing),
  }
}

function legacyDuration(value?: string): string {
  if (!value?.trim()) return ''
  const match = value.match(/(\d+)/)
  return match ? match[1] : value.trim()
}

function legacyBathingTime(bathing?: string): string {
  if (bathing?.includes(':')) return bathing
  return ''
}

export function formatTimedCare(time: string, duration?: string): string {
  const parts: string[] = []
  if (time) parts.push(time)
  if (duration) parts.push(`${duration} phút`)
  return parts.join(' · ')
}

export function hasCareContent(care: DayCare): boolean {
  return (
    !!care.fruit.trim() ||
    !!care.liveFood.trim() ||
    !!care.vitamin.trim() ||
    !!care.sunbathingTime.trim() ||
    !!care.sunbathingDuration.trim() ||
    !!care.bathingTime.trim()
  )
}

export function getCareDisplayValue(care: DayCare, key: string): string {
  switch (key) {
    case 'fruit':
      return care.fruit.trim()
    case 'liveFood':
      return care.liveFood.trim()
    case 'vitamin':
      return care.vitamin.trim()
    case 'sunbathing':
      return formatTimedCare(care.sunbathingTime, care.sunbathingDuration)
    case 'bathing':
      return care.bathingTime.trim()
    default:
      return ''
  }
}
