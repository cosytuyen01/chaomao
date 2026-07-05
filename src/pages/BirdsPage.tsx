import { useNavigate } from 'react-router-dom'
import DetailHero from '../components/detail/DetailHero'
import SectionHeader from '../components/SectionHeader'
import { Bird } from '../components/icons'
import BirdCard from '../components/BirdCard'
import FloatButton from '../components/FloatButton'
import { useAuth } from '../context/AuthContext'
import { useBirds } from '../hooks/useBirds'
import { HOME_BG } from '../utils/branding'

export default function BirdsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { birds, loading, removeBird } = useBirds(user?.uid)

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa Chiến binh này?')) return
    await removeBird(id)
  }

  return (
    <div className="bg-page">
      <DetailHero
        imageUrl={HOME_BG}
        imageAlt="Chiến binh"
        title="Chiến binh của tôi"
        subtitle="Danh sách chiến binh"
        showBack={false}
      />

      <div className="relative z-10 space-y-4 px-4 pb-2">
        <div className="card-modern -mt-12 flex items-center gap-3.5 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bird className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">{loading ? '—' : birds.length}</p>
            <p className="text-sm text-text-muted">chiến binh</p>
          </div>
        </div>

        <section>
          <SectionHeader title="Danh sách" />

          {loading ? (
            <div className="grid grid-cols-2 gap-3.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-3xl bg-white/70"
                />
              ))}
            </div>
          ) : birds.length === 0 ? (
            <div className="card-modern p-10 text-center">
              <Bird className="mx-auto h-14 w-14 text-primary/40" strokeWidth={1.5} />
              <p className="mt-3 font-bold text-text">Chưa có Chiến binh nào</p>
              <p className="mt-1 text-sm text-text-muted">
                Nhấn nút + góc dưới để thêm chiến binh
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {birds.map((bird) => (
                <BirdCard key={bird.id} bird={bird} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </div>

      {!loading && (
        <FloatButton
          onClick={() => navigate('/birds/new')}
          label="Thêm chiến binh"
        />
      )}
    </div>
  )
}
