import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Activity } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Error al iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Activity className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn-primary w-full">Ingresar</button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          ¿No tienes cuenta? <Link to="/register" className="text-primary font-semibold">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}