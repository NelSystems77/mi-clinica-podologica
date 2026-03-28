import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Calendar, BarChart3, LogOut, Activity } from 'lucide-react'

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const nav = [
    { to: '/dashboard', icon: Activity, label: 'Inicio' },
    { to: '/dashboard/patients', icon: Users, label: 'Pacientes' },
    { to: '/dashboard/appointments', icon: Calendar, label: 'Citas' },
    { to: '/dashboard/reports', icon: BarChart3, label: 'Reportes' }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-primary text-white">
        <div className="p-4 border-b border-primary-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" /> MCP
          </h1>
          <p className="text-sm text-primary-100 mt-1">{user?.name}</p>
        </div>
        <nav className="p-4 space-y-2">
          {nav.map(item => (
            <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.to ? 'bg-primary-700' : 'hover:bg-primary-700/50'
            }`}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-700/50 w-full transition">
            <LogOut className="h-5 w-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}