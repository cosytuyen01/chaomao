type AccountTab = 'info' | 'notifications'

const TABS: { id: AccountTab; label: string }[] = [
  { id: 'info', label: 'Thông tin' },
  { id: 'notifications', label: 'Thông báo' },
]

interface AccountTabsProps {
  active: AccountTab
  onChange: (tab: AccountTab) => void
}

export type { AccountTab }

export default function AccountTabs({ active, onChange }: AccountTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-1 shadow-[var(--shadow-card)]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            'rounded-xl py-2.5 text-sm font-semibold transition',
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
