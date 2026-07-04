type Variant = 'beige' | 'blue'

const variantClass: Record<Variant, string> = {
  beige: 'bg-input-beige',
  blue: 'bg-input-blue',
}

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  variant?: Variant
}

export default function AuthField({
  label,
  variant = 'beige',
  className = '',
  ...props
}: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-text-muted">
      {label}
      <input
        className={[
          'rounded-xl border-0 px-4 py-3.5 text-base text-text',
          'transition focus:ring-3 focus:ring-primary/15 focus:outline-none',
          variantClass[variant],
          className,
        ].join(' ')}
        {...props}
      />
    </label>
  )
}
