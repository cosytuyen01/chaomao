import { formatSeasons } from '../utils/bird'
import type { Bird } from '../types'

interface BirdSelectorProps {
  birds: Bird[]
  selectedId: string
  onSelect: (id: string) => void
  disabled?: boolean
}

export default function BirdSelector({
  birds,
  selectedId,
  onSelect,
  disabled,
}: BirdSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {birds.map((bird) => {
        const active = bird.id === selectedId
        return (
          <button
            key={bird.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(bird.id)}
            className={[
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
              disabled ? 'opacity-50' : '',
              active
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-surface text-text hover:border-primary/40',
            ].join(' ')}
          >
            {bird.name}
            <span className="ml-1.5 text-xs opacity-80">
              ({formatSeasons(bird.seasons)})
            </span>
          </button>
        )
      })}
    </div>
  )
}
