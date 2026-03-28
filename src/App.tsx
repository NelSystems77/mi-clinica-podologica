import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'
import PublicBooking from './components/appointments/PublicBooking'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardHome from './components/dashboard/DashboardHome'
import PatientsPage from './components/patients/PatientsPage'
import AppointmentsPage from './components/appointments/AppointmentsPage'
import ClinicalPage from './components/clinical/ClinicalPage'
import ReportsPage from './components/reports/ReportsPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  return user ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reservar-cita" element={<PublicBooking />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="clinical/:patientId" element={<ClinicalPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
