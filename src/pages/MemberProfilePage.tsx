import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import DetailHero from '../components/detail/DetailHero'
import MemberProfileCard from '../components/member-detail/MemberProfileCard'
import SectionHeader from '../components/SectionHeader'
import { useAuth } from '../context/AuthContext'
import { useBirdRecords } from '../hooks/useBirdRecords'
import { useBirds } from '../hooks/useBirds'
import { useMemberProfile } from '../hooks/useMembers'
import { HOME_BG } from '../utils/branding'
import { DEFAULT_BIRD_IMAGE, formatSeasons } from '../utils/bird'

export default function MemberProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { user } = useAuth()
  const { member, loading: memberLoading, notFound } = useMemberProfile(userId)
  const { birds, loading: birdsLoading } = useBirds(userId)
  const { records } = useBirdRecords(userId)

  const stats = useMemo(
    () => ({
      birds: birds.length,
      diDot: records.filter((r) => r.type === 'di-dot').length,
      diThi: records.filter((r) => r.type === 'di-thi').length,
      journals: records.length,
    }),
    [birds.length, records],
  )

  if (memberLoading || birdsLoading) {
    return (
      <div className="px-4 py-12 text-center text-text-muted">Đang tải...</div>
    )
  }

  if (notFound || !member) {
    return (
      <div className="mx-4 mt-8 rounded-3xl bg-surface p-8 text-center shadow-sm">
        <p className="font-medium text-text">Không tìm thấy thành viên</p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary">
          ← Về trang chủ
        </Link>
      </div>
    )
  }

  const isSelf = user?.uid === userId

  return (
    <div className="bg-page">
      <DetailHero
        imageUrl={HOME_BG}
        imageAlt={member.displayName}
        title="Thành viên"
        subtitle="Chi tiết thành viên Chào Mào"
      />

      <div className="relative z-10 space-y-5 px-4 pb-2 -mt-30">
        <MemberProfileCard member={member} stats={stats} isSelf={isSelf} />

        <section>
          <SectionHeader title="Chiến binh" />

          {birds.length === 0 ? (
            <div className="card-modern p-6 text-center text-sm text-text-muted">
              Thành viên chưa thêm chiến binh nào.
            </div>
          ) : (
            <div className="space-y-3">
              {birds.map((bird) => (
                <Link
                  key={bird.id}
                  to={`/che-do-di/tham-khao/${bird.id}`}
                  className="card-modern flex items-center gap-3.5 p-3.5 transition active:scale-[0.99] hover:shadow-lg"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100">
                    <img
                      src={DEFAULT_BIRD_IMAGE}
                      alt={bird.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-text">{bird.name}</p>
                    <span className="badge-pill mt-1">{formatSeasons(bird.seasons)}</span>
                    {bird.pellets.trim() && (
                      <p className="mt-1 truncate text-xs text-text-muted">
                        Cám: {bird.pellets}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
