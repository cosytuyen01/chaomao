import { useState } from 'react'
import { Eye, EyeOff, Lock, Smartphone, User, X } from 'lucide-react'

type FieldIcon = 'phone' | 'lock' | 'user'

const labelIcons: Record<FieldIcon, typeof Smartphone> = {
  phone: Smartphone,
  lock: Lock,
  user: User,
}

interface AuthFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  icon?: FieldIcon
  type?: 'text' | 'tel' | 'password'
  showClear?: boolean
}

export default function AuthField({
  label,
  icon,
  type = 'text',
  showClear = false,
  className = '',
  value,
  onChange,
  ...props
}: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && revealed ? 'text' : type
  const stringValue = typeof value === 'string' ? value : String(value ?? '')
  const LabelIcon = icon ? labelIcons[icon] : null
  const canClear = showClear && stringValue.length > 0 && !props.disabled && !props.readOnly

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-sm font-semibold text-text">
        {LabelIcon && (
          <LabelIcon className="h-4 w-4 text-primary" strokeWidth={2.25} aria-hidden />
        )}
        {label}
      </span>

      <div className="relative">
        {icon === 'phone' && (
          <Smartphone
            className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-text-muted/70"
            strokeWidth={2}
            aria-hidden
          />
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          className={[
            'w-full rounded-2xl border-2 border-primary/20 bg-white py-3.5 text-base text-text transition',
            'placeholder:text-text-muted/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none',
            icon === 'phone' ? 'pl-11' : 'px-4',
            (canClear || isPassword) ? 'pr-11' : icon === 'phone' ? 'pr-4' : '',
            className,
          ].join(' ')}
          {...props}
        />

        {canClear && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              onChange?.({
                target: { value: '' },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition hover:bg-slate-100 hover:text-text"
            aria-label="Xóa"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setRevealed((v) => !v)}
            className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition hover:bg-slate-100 hover:text-text"
            aria-label={revealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {revealed ? (
              <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
            ) : (
              <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
