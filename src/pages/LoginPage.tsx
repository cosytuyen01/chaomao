import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/LoadingScreen'
import AuthField from '../components/auth/AuthField'
import AuthLayout from '../components/auth/AuthLayout'
import { isValidVietnamesePhone } from '../utils/phone'

export default function LoginPage() {
  const { user, login, loading } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <LoadingScreen />

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidVietnamesePhone(phone)) {
      setError('Số điện thoại không hợp lệ. Nhập số VN 10 chữ số (VD: 0901234567).')
      return
    }

    setSubmitting(true)
    try {
      await login(phone, password)
    } catch {
      setError('Số điện thoại hoặc mật khẩu không đúng.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Chào Chào Mao"
      subtitle="Đăng nhập để quản lý sinh hoạt CLB"
      footer={
        <>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthField
          label="Số điện thoại"
          variant="blue"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0901234567"
          required
        />
        <AuthField
          label="Mật khẩu"
          variant="beige"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="rounded-xl bg-primary/8 px-4 py-2.5 text-sm text-primary">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </AuthLayout>
  )
}
