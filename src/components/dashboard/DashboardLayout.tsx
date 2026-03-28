import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Calendar, BarChart3, LogOut, Activity, Menu, X } from 'lucide-react'

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = [
    { to: '/dashboard', icon: Activity, label: 'Inicio' },
    { to: '/dashboard/patients', icon: Users, label: 'Pacientes' },
    { to: '/dashboard/appointments', icon: Calendar, label: 'Citas' },
    { to: '/dashboard/reports', icon: BarChart3, label: 'Reportes' }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-primary text-white fixed md:relative h-full z-40 transform transition-transform ${
        menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 border-b border-primary-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" /> MCP
          </h1>
          <p className="text-sm text-primary-100 mt-1">{user?.name}</p>
        </div>
        <nav className="p-4 space-y-2">
          {nav.map(item => (
            <Link 
              key={item.to} 
              to={item.to} 
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.to ? 'bg-primary-700' : 'hover:bg-primary-700/50'
              }`}
            >
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

      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  )
}