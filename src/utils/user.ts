import { formatPhoneDisplay } from './phone'

type UserDoc = {
  displayName?: string
  phone?: string
}

type ScheduleMeta = {
  updatedBy?: string
}

export function resolveOwnerName(
  userData?: UserDoc | null,
  scheduleMeta?: ScheduleMeta | null,
): string {
  const displayName = userData?.displayName?.trim()
  if (displayName) return displayName

  const phone = userData?.phone?.trim()
  if (phone) return formatPhoneDisplay(phone)

  const updatedBy = scheduleMeta?.updatedBy?.trim()
  if (updatedBy) return updatedBy

  return ''
}
