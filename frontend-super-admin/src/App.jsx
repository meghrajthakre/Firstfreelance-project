import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminsPage from './pages/AdminsPage'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"         element={<DashboardPage />} />
              <Route path="admins"            element={<AdminsPage />} />
              <Route path="collection-report" element={<PlaceholderPage />} />
              <Route path="matches"           element={<PlaceholderPage />} />
              <Route path="matka"             element={<PlaceholderPage />} />
              <Route path="cup-rates"         element={<PlaceholderPage />} />
              <Route path="in-play-bet-fair"  element={<PlaceholderPage />} />
              <Route path="change-password"   element={<PlaceholderPage />} />
              <Route path="settings"          element={<PlaceholderPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
