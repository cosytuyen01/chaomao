interface ApplySharedSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function ApplySharedSwitch({
  checked,
  onChange,
}: ApplySharedSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-surface p-4 shadow-sm">
      <div>
        <p className="font-semibold text-text">Áp dụng chế độ chung</p>
        <p className="mt-0.5 text-xs text-text-muted">
          Bật để dùng cùng một chế độ cho tất cả
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-border',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </label>
  )
}
