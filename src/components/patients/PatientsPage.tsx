import { useState, useEffect } from 'react'
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { Patient } from '../../types'
import { Plus, Search, Trash2, FileText, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PatientsPage() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [searchByCedula, setSearchByCedula] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const loadPatients = async () => {
    if (!user) return
    const q = query(collection(db, 'organizations', user.organizationId, 'patients'))
    const snap = await getDocs(q)
    setPatients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Patient)))
  }

  useEffect(() => { loadPatients() }, [user])

  const filteredPatients = patients.filter(p => {
    const matchesGeneral = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cedula.includes(search) || p.phone.includes(search)
    const matchesCedula = searchByCedula ? p.cedula.includes(searchByCedula) : true
    return matchesGeneral && matchesCedula
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">📇 Directorio de Pacientes</h1>
          <p className="text-gray-600">Gestión completa de pacientes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> Nuevo Paciente
        </button>
      </div>

      <div className="card mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Buscar por Nombre, Cédula o Tel..." className="input-field pl-10"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="BUSCAR POR CÉDULA..." className="input-field pl-10"
            value={searchByCedula} onChange={e => setSearchByCedula(e.target.value)} />
        </div>
        {(search || searchByCedula) && (
          <p className="text-sm text-gray-600">{filteredPatients.length} pacientes encontrados</p>
        )}
      </div>

      {filteredPatients.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No se encontraron pacientes</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="card flex justify-between items-center hover:shadow-lg transition">
              <div>
                <h3 className="font-bold text-lg">{patient.name}</h3>
                <p className="text-gray-600">Cédula: {patient.cedula} | Tel: {patient.phone}</p>
                {patient.email && <p className="text-sm text-gray-500">{patient.email}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/dashboard/clinical/${patient.id}`)}
                  className="btn-primary flex items-center gap-2">
                  <FileText className="h-4 w-4" /> EXPEDIENTE →
                </button>
                <button onClick={async () => {
                  if (confirm('¿Eliminar paciente y registros asociados?')) {
                    await deleteDoc(doc(db, 'organizations', user!.organizationId, 'patients', patient.id))
                    loadPatients()
                    alert('Paciente y registros eliminados.')
                  }
                }} className="text-red-600 hover:text-red-800 px-3">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <PatientModal onClose={() => { setShowModal(false); loadPatients() }} />}
    </div>
  )
}

function PatientModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({ name: '', cedula: '', phone: '', email: '', address: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    await addDoc(collection(db, 'organizations', user.organizationId, 'patients'), {
      ...formData, organizationId: user.organizationId, createdAt: new Date(), updatedAt: new Date()
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Nuevo Paciente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre completo *" className="input-field"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="text" placeholder="Cédula *" className="input-field"
            value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} required />
          <input type="tel" placeholder="Teléfono *" className="input-field"
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <input type="email" placeholder="Email" className="input-field"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <textarea placeholder="Dirección" className="input-field" rows={2}
            value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">Guardar Nuevo</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}