export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-shell-outer">
      <div className="mx-auto min-h-screen w-full max-w-[480px] md:max-w-[768px]">
        {children}
      </div>
    </div>
  )
}
