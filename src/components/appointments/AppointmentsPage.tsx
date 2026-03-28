import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { Appointment, Patient } from '../../types'
import { Plus, Calendar as CalIcon, Check } from 'lucide-react'
import { format } from 'date-fns'

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [showModal, setShowModal] = useState(false)

  const loadData = async () => {
    if (!user) return
    const [apptSnap, patSnap] = await Promise.all([
      getDocs(collection(db, 'organizations', user.organizationId, 'appointments')),
      getDocs(collection(db, 'organizations', user.organizationId, 'patients'))
    ])
    setAppointments(apptSnap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date.toDate() } as Appointment)))
    setPatients(patSnap.docs.map(d => ({ id: d.id, ...d.data() } as Patient)))
  }

  useEffect(() => { loadData() }, [user])

  const pending = appointments.filter(a => a.status === 'pending')

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Citas</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> Nueva Cita
        </button>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Pendientes de Confirmar</h2>
        {pending.length === 0 ? <p className="text-gray-500">No hay citas pendientes</p> : (
          <div className="space-y-2">
            {pending.map(appt => (
              <div key={appt.id} className="flex justify-between items-center p-4 bg-yellow-50 rounded">
                <div>
                  <p className="font-bold">{appt.patientName}</p>
                  <p className="text-sm text-gray-600">{format(appt.date, 'dd/MM/yyyy')} - {appt.time}</p>
                </div>
                <button onClick={async () => {
                  await updateDoc(doc(db, 'organizations', user!.organizationId, 'appointments', appt.id), { status: 'confirmed' })
                  loadData()
                }} className="btn-primary text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" /> Confirmar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Todas las Citas</h2>
        <div className="space-y-2">
          {appointments.map(appt => (
            <div key={appt.id} className={`p-4 rounded ${appt.status === 'confirmed' ? 'bg-green-50' : appt.status === 'completed' ? 'bg-gray-50' : 'bg-white border'}`}>
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{appt.patientName}</p>
                  <p className="text-sm text-gray-600">{format(appt.date, 'dd/MM/yyyy')} - {appt.time}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${appt.status === 'confirmed' ? 'bg-green-200 text-green-800' : appt.status === 'completed' ? 'bg-gray-200' : 'bg-yellow-200'}`}>
                  {appt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <AppointmentModal patients={patients} onClose={() => { setShowModal(false); loadData() }} />}
    </div>
  )
}

function AppointmentModal({ patients, onClose }: { patients: Patient[], onClose: () => void }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({ patientId: '', date: '', time: '', type: 'general' as const })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const patient = patients.find(p => p.id === formData.patientId)!
    await addDoc(collection(db, 'organizations', user.organizationId, 'appointments'), {
      ...formData, organizationId: user.organizationId, patientName: patient.name, doctorId: user.id,
      status: 'pending', date: new Date(formData.date), createdAt: new Date()
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Nueva Cita</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select className="input-field" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} required>
            <option value="">Seleccionar paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          <input type="time" className="input-field" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">Agendar</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}