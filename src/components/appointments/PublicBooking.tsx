import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { Calendar, User, Phone } from 'lucide-react'

export default function PublicBooking() {
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await addDoc(collection(db, 'publicBookings'), {
      ...formData,
      status: 'pending',
      needsConfirmation: true,
      createdAt: new Date()
    })
    
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4">¡Solicitud Enviada!</h2>
          <p className="text-gray-600 mb-2">Cita agendada y solicitud procesada.</p>
          <p className="text-sm text-gray-500">
            📅 Prefiere: {new Date(formData.date).toLocaleDateString()}<br />
            Un especialista revisará la disponibilidad y te contactará para confirmar la hora exacta.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-6">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Reservar Cita Pública</h1>
        <p className="text-gray-600 mb-6">Complete el formulario para solicitar una cita</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Nombre completo" className="input-field pl-10"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="tel" placeholder="Teléfono" className="input-field pl-10"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="date" className="input-field pl-10"
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>

          <textarea placeholder="Motivo de la consulta (opcional)" className="input-field" rows={3}
            value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />

          <p className="text-xs text-gray-500">
            * Al enviar, un especialista revisará la disponibilidad y te contactará para confirmar la hora exacta.
          </p>

          <button type="submit" className="btn-primary w-full">💬 Confirmar</button>
        </form>
      </div>
    </div>
  )
}