export type MemberBirdTab = 'schedule' | 'records'

const TABS: { id: MemberBirdTab; label: string }[] = [
  { id: 'schedule', label: 'Chế độ' },
  { id: 'records', label: 'Nhật ký' },
]

interface MemberBirdTabsProps {
  active: MemberBirdTab
  onChange: (tab: MemberBirdTab) => void
}

export default function MemberBirdTabs({ active, onChange }: MemberBirdTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-page p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            'rounded-xl py-2.5 text-sm font-semibold transition',
            active === tab.id
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:bg-white hover:text-primary',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
