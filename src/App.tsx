import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReminderProvider } from './context/ReminderContext'
import MobileShell from './components/MobileShell'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import BirdsPage from './pages/BirdsPage'
import AddBirdPage from './pages/AddBirdPage'
import BirdDetailPage from './pages/BirdDetailPage'
import ReferenceSchedulePage from './pages/ReferenceSchedulePage'
import SchedulePage from './pages/SchedulePage'
import ExpensesPage from './pages/ExpensesPage'
import SettingsPage from './pages/SettingsPage'
import MemberProfilePage from './pages/MemberProfilePage'
import MemberBirdRecordsPage from './pages/MemberBirdRecordsPage'

export default function App() {
  return (
    <AuthProvider>
      <ReminderProvider>
        <MobileShell>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/birds" element={<BirdsPage />} />
              <Route path="/birds/new" element={<AddBirdPage />} />
              <Route path="/birds/:birdId" element={<BirdDetailPage />} />
              <Route path="/che-do-di" element={<SchedulePage />} />
              <Route
                path="/che-do-di/tham-khao/:birdId"
                element={<ReferenceSchedulePage />}
              />
              <Route path="/schedule" element={<Navigate to="/che-do-di" replace />} />
              <Route path="/chi-tieu" element={<ExpensesPage />} />
              <Route path="/records" element={<Navigate to="/chi-tieu" replace />} />
              <Route path="/thanh-vien/:userId" element={<MemberProfilePage />} />
              <Route
                path="/thanh-vien/:userId/chim/:birdId/nhat-ky"
                element={<MemberBirdRecordsPage />}
              />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </MobileShell>
      </ReminderProvider>
    </AuthProvider>
  )
}
