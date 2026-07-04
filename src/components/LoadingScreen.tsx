export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-text-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary" />
      {message && <p>{message}</p>}
    </div>
  )
}
