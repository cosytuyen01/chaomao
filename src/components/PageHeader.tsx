import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, ChevronLeft } from './icons'

const PAGE_META: { path: string; title: string; subtitle: string }[] = [
  { path: '/', title: 'Trang chủ', subtitle: 'Quản lý sinh hoạt CLB' },
  { path: '/birds/new', title: 'Thêm chào mào', subtitle: 'Thêm chiến binh mới' },
  { path: '/birds', title: 'Chiến binh của tôi', subtitle: 'Danh sách chiến binh' },
  { path: '/birds/:birdId', title: 'Chi tiết Chiến binh', subtitle: 'Thông tin chiến binh' },
  {
    path: '/che-do-di/tham-khao/:birdId',
    title: 'Tham khảo Chế độ',
    subtitle: 'Chế độ của thành viên khác',
  },
  { path: '/che-do-di', title: 'Chế độ', subtitle: 'Chăm sóc 7 ngày trong tuần' },
  { path: '/records', title: 'Nhật ký', subtitle: 'Ghi chép đi dợt & đi thi' },
  { path: '/thanh-vien/:userId', title: 'Thành viên', subtitle: 'Profile thành viên CLB' },
  {
    path: '/thanh-vien/:userId/chim/:birdId/nhat-ky',
    title: 'Nhật ký Chiến binh',
    subtitle: 'Nhật ký của thành viên khác',
  },
  { path: '/settings', title: 'Cài đặt', subtitle: 'Tài khoản & thông báo' },
]

const BACK_PATHS = [
  '/birds/new',
  '/birds/:birdId',
  '/che-do-di/tham-khao/:birdId',
  '/thanh-vien/:userId',
  '/thanh-vien/:userId/chim/:birdId/nhat-ky',
]

function getPageMeta(pathname: string) {
  for (const meta of PAGE_META) {
    if (matchPath(meta.path, pathname)) return meta
  }
  return PAGE_META[0]
}

function shouldShowBack(pathname: string) {
  return BACK_PATHS.some((path) => matchPath(path, pathname))
}

export default function PageHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const meta = getPageMeta(pathname)
  const showBack = shouldShowBack(pathname)

  const subtitle =
    pathname === '/' && user?.displayName
      ? `${user.displayName} · Chào mào của tôi`
      : meta.subtitle

  return (
    <div className="relative overflow-hidden bg-primary px-5 pb-4 pt-5">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-right-top"
        style={{ backgroundImage: "url('/bgpage.png')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/20 to-primary"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-1">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
              className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15"
            >
              <ChevronLeft className="h-7 w-7" strokeWidth={2} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white">{meta.title}</h1>
            <p className="mt-1 text-sm text-white/85">{subtitle}</p>
          </div>
        </div>
        {!showBack && (
          <Link
            to="/settings"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
          </Link>
        )}
      </div>
    </div>
  )
}
