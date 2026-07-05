type DetailTab = 'info' | 'schedule' | 'records'

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'info', label: 'Thông tin' },
  { id: 'schedule', label: 'Chế độ' },
  { id: 'records', label: 'Nhật ký' },
]

interface DetailTabsProps {
  active: DetailTab
  onChange: (tab: DetailTab) => void
}

export type { DetailTab }

export default function DetailTabs({ active, onChange }: DetailTabsProps) {
  return (
    <div className="mb-5 grid grid-cols-3 rounded-xl bg-white p-1 shadow-sm">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            'rounded-lg py-2.5 text-sm font-semibold transition',
            active === tab.id
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-primary',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
