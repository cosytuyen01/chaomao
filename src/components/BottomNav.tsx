import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './icons'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-border/80 bg-white px-2 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:max-w-[768px]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            [
              'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition md:text-xs',
              isActive ? 'text-primary' : 'text-text-muted',
            ].join(' ')
          }
        >
          <item.icon className="h-5 w-5" strokeWidth={2} />
          <span className="truncate">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
