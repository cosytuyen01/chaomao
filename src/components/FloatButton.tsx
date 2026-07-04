import { Plus } from './icons'

interface FloatButtonProps {
  onClick: () => void
  label?: string
}

export default function FloatButton({
  onClick,
  label = 'Thêm mới',
}: FloatButtonProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[9.75rem] z-40 mx-auto w-full max-w-[480px] md:max-w-[768px]">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="pointer-events-auto absolute right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_20px_rgba(26,115,232,0.45)] transition hover:bg-primary-dark active:scale-95"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>
    </div>
  )
}
