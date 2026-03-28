import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Activity } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const orgRef = await addDoc(collection(db, 'organizations'), {
        name: clinicName, plan: 'free', maxUsers: 5, createdAt: new Date(),
        settings: { autoConfirmAppointments: false, requireConsent: true, allowPublicBooking: true }
      })
      await signUp(email, password, name, orgRef.id)
      navigate('/dashboard')
    } catch (err) {
      setError('Error al crear cuenta')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Activity className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre completo" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
          <input type="text" placeholder="Nombre de la clínica" className="input-field" value={clinicName} onChange={e => setClinicName(e.target.value)} required />
          <input type="email" placeholder="Email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn-primary w-full">Crear Cuenta</button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-semibold">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  )
}