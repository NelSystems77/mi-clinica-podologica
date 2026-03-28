import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { Users, Calendar, FileText } from 'lucide-react'

export default function DashboardHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ patients: 0, appointments: 0, records: 0 })

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return
      const [p, a, r] = await Promise.all([
        getDocs(collection(db, 'organizations', user.organizationId, 'patients')),
        getDocs(collection(db, 'organizations', user.organizationId, 'appointments')),
        getDocs(collection(db, 'organizations', user.organizationId, 'clinicalRecords'))
      ])
      setStats({ patients: p.size, appointments: a.size, records: r.size })
    }
    loadStats()
  }, [user])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {user?.name}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <Users className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">{stats.patients}</h3>
          <p className="text-gray-600">Pacientes</p>
        </div>
        <div className="card">
          <Calendar className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">{stats.appointments}</h3>
          <p className="text-gray-600">Citas</p>
        </div>
        <div className="card">
          <FileText className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">{stats.records}</h3>
          <p className="text-gray-600">Expedientes</p>
        </div>
      </div>
    </div>
  )
}