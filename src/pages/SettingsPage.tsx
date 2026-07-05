import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountTabs, { type AccountTab } from '../components/account/AccountTabs'
import DetailHero from '../components/detail/DetailHero'
import InstallAppSection from '../components/InstallAppSection'
import MemberProfileCard from '../components/member-detail/MemberProfileCard'
import { useAuth } from '../context/AuthContext'
import { useBirdRecords } from '../hooks/useBirdRecords'
import { useBirds } from '../hooks/useBirds'
import { useMemberProfile } from '../hooks/useMembers'
import { HOME_BG } from '../utils/branding'
import { formatPhoneFromAuthEmail } from '../utils/phone'
import NotificationsPage from './NotificationsPage'

const TAB_SUBTITLES: Record<AccountTab, string> = {
  info: 'Thông tin tài khoản',
  notifications: 'Thông báo & nhắc lịch',
}

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { member } = useMemberProfile(user?.uid)
  const { birds } = useBirds(user?.uid)
  const { records } = useBirdRecords(user?.uid)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AccountTab>('info')

  const stats = useMemo(
    () => ({
      birds: birds.length,
      diDot: records.filter((r) => r.type === 'di-dot').length,
      diThi: records.filter((r) => r.type === 'di-thi').length,
      journals: records.length,
    }),
    [birds.length, records],
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const displayName = member?.displayName ?? user?.displayName ?? 'Chiến binh'
  const phone =
    member?.phone || formatPhoneFromAuthEmail(user?.email) || ''

  const profileMember = member ?? {
    id: user?.uid ?? '',
    displayName,
    phone,
    avatarUrl: '',
  }

  return (
    <div className="bg-page">
      <DetailHero
        imageUrl={HOME_BG}
        imageAlt={displayName}
        title="Tài khoản"
        subtitle={TAB_SUBTITLES[activeTab]}
        showBack={false}
      />

      <div className="relative z-10 space-y-4 px-4 pb-2">
        <MemberProfileCard member={profileMember} stats={stats} isSelf />

        <AccountTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === 'info' && (
          <div className="space-y-4">
            <InstallAppSection />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl border border-primary/20 bg-white py-3.5 text-sm font-semibold text-primary shadow-[var(--shadow-card)] transition hover:bg-primary/5"
            >
              Đăng xuất
            </button>
          </div>
        )}

        {activeTab === 'notifications' && <NotificationsPage embedded />}
      </div>
    </div>
  )
}
