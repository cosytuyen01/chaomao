import { Cat } from '../icons'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-primary">
      <div className="relative overflow-hidden px-5 pb-14 pt-8">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-right-top opacity-30"
          style={{ backgroundImage: "url('/bgpage.png')" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/20 to-primary"
          aria-hidden
        />
        <div className="relative text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            <Cat className="h-9 w-9" strokeWidth={1.75} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm text-white/85">{subtitle}</p>
        </div>
      </div>

      <div className="relative bg-white px-5 py-8">
        {children}
        <div className="mt-7 text-center text-sm text-text-muted">{footer}</div>
      </div>
    </div>
  )
}
