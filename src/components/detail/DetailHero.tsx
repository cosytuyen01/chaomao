import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from '../icons'

interface DetailHeroProps {
  imageUrl: string
  imageAlt: string
  title: string
  subtitle: string
  showBack?: boolean
}

export default function DetailHero({
  imageUrl,
  imageAlt,
  title,
  subtitle,
  showBack = true,
}: DetailHeroProps) {
  const navigate = useNavigate()

  return (
    <div className="relative h-52 overflow-hidden">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55"
        aria-hidden
      />

      <div className="relative flex h-full flex-col px-4 pb-14 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-start gap-3">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2} />
            </button>
          )}

          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              {title}
            </h1>
            <p className="mt-0.5 text-sm text-white/85 drop-shadow-sm">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
