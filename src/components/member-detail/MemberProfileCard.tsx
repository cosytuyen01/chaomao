import { Bird, Bike, ClipboardList, NotebookPen } from '../icons'
import UserAvatar from '../UserAvatar'
import type { MemberProfile } from '../../hooks/useMembers'

interface MemberProfileCardProps {
  member: MemberProfile
  stats: {
    birds: number
    diDot: number
    diThi: number
    journals: number
  }
  isSelf?: boolean
}

const STAT_ITEMS = [
  { key: 'birds' as const, label: 'Chiến binh', icon: Bird },
  { key: 'diDot' as const, label: 'Đi dợt', icon: Bike },
  { key: 'diThi' as const, label: 'Đi thi', icon: ClipboardList },
  { key: 'journals' as const, label: 'Nhật ký', icon: NotebookPen },
]

export default function MemberProfileCard({
  member,
  stats,
  isSelf,
}: MemberProfileCardProps) {
  return (
    <div className="card-modern -mt-12 p-4">
      <div className="flex items-center gap-3.5">
        <UserAvatar
          avatarUrl={member.avatarUrl}
          alt={member.displayName}
          className="!h-[72px] !w-[72px] ring-4 ring-white"
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-text">{member.displayName}</h2>
          {member.phone && (
            <p className="mt-0.5 text-sm text-text-muted">{member.phone}</p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="badge-pill">{stats.birds} chiến binh</span>
            {isSelf && (
              <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                Tài khoản của bạn
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border/60 pt-4">
        {STAT_ITEMS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <p className="mt-1.5 text-base font-bold text-text">{stats[key]}</p>
            <p className="text-[10px] leading-tight text-text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
