import { Link } from 'react-router-dom'
import type { Bird } from '../types'
import { formatSeasons } from '../utils/bird'
import { Bird as BirdIcon, X } from './icons'

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
          'flex items-center justify-center text-primary/40',
          compact
            ? 'aspect-square bg-gradient-to-br from-sky-100 to-blue-50 text-primary'
            : 'aspect-[4/3] bg-gray-100',
        ].join(' ')}
      >
        <BirdIcon
          className={compact ? 'h-12 w-12 text-primary' : 'h-14 w-14'}
          strokeWidth={1.5}
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
