import { Link } from 'react-router-dom'
import type { Bird } from '../types'
import { DEFAULT_BIRD_IMAGE, formatSeasons } from '../utils/bird'
import { X } from './icons'

interface BirdCardProps {
  bird: Bird
  onDelete?: (id: string) => void
  compact?: boolean
}

export default function BirdCard({ bird, onDelete, compact }: BirdCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.(bird.id)
  }

  return (
    <Link
      to={`/birds/${bird.id}`}
      className={[
        'relative block shrink-0 overflow-hidden bg-white transition active:scale-[0.98]',
        compact
          ? 'w-[120px] rounded-2xl shadow-sm hover:ring-2 hover:ring-primary/20'
          : 'w-full rounded-xl border border-border/80 shadow-sm hover:shadow-md',
      ].join(' ')}
    >
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className={[
            'absolute right-2 top-2 z-10 flex items-center justify-center rounded-full text-white',
            compact ? 'h-6 w-6 bg-black/40' : 'h-7 w-7 bg-black/35 backdrop-blur-sm',
          ].join(' ')}
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      )}
      <div
        className={[
          'overflow-hidden',
          compact
            ? 'aspect-square bg-gradient-to-br from-sky-100 to-blue-50'
            : 'aspect-[4/3] bg-gray-100',
        ].join(' ')}
      >
        <img
          src={DEFAULT_BIRD_IMAGE}
          alt={bird.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className={compact ? 'p-3 text-center' : 'space-y-1.5 p-3'}>
        <p
          className={[
            'truncate font-semibold text-text',
            compact ? '' : 'text-[15px]',
          ].join(' ')}
        >
          {bird.name}
        </p>
        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {formatSeasons(bird.seasons)}
        </span>
        {bird.pellets.trim() && !compact && (
          <p className="truncate text-xs text-text-muted">Cám: {bird.pellets}</p>
        )}
      </div>
    </Link>
  )
}
