import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/LoadingScreen'
import AuthField from '../components/auth/AuthField'
import AuthLayout from '../components/auth/AuthLayout'
import { isValidVietnamesePhone } from '../utils/phone'

export default function RegisterPage() {
  const { user, register, loading } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setSubmitting(true)
    try {
      await register(phone, password, displayName)
    } catch {
      setError('Không thể đăng ký. Số điện thoại có thể đã được sử dụng.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Đăng ký"
      subtitle="Tạo tài khoản thành viên CLB Chào Chào Mao"
      footer={
        <>
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-auth-primary hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthField
          label="Họ tên"
          variant="beige"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nguyễn Văn A"
          required
        />
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
          variant="blue"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ít nhất 6 ký tự"
          required
        />
        <AuthField
          label="Xác nhận mật khẩu"
          variant="beige"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu"
          required
        />

        {error && (
          <p className="rounded-xl bg-auth-primary/8 px-4 py-2.5 text-sm text-auth-primary">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full rounded-xl bg-auth-primary px-4 py-3.5 text-base font-semibold text-white transition hover:bg-auth-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </AuthLayout>
  )
}
