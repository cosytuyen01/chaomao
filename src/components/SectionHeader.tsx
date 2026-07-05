import { Link } from 'react-router-dom'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  linkTo?: string
  linkLabel?: string
  /** Extra classes on the root wrapper (e.g. `!mb-0` to tighten spacing below title). */
  className?: string
  /** Extra classes on the title element. */
  titleClassName?: string
  style?: React.CSSProperties
}

export default function SectionHeader({
  title,
  subtitle,
  linkTo,
  linkLabel = 'Xem tất cả',
  className = '',
  titleClassName = '',
  style,
}: SectionHeaderProps) {
  return (
    <div
      className={['mb-3 flex items-end justify-between gap-3', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className="min-w-0">
        <h2
          className={[
            'text-[17px] font-bold tracking-tight text-text',
            titleClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
        )}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="shrink-0 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          {linkLabel} &rsaquo;
        </Link>
      )}
    </div>
  )
}
