import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { Patient, ClinicalRecord } from '../../types'
import { FileText, Save, Printer } from 'lucide-react'
import PhotoGallery from './PhotoGallery'
import SignaturePad from './SignaturePad'
import jsPDF from 'jspdf'

const CATALOGO_DIAGNOSTICOS = [
  "Onicocriptosis", "Onicomicosis", "Onicogrifosis", "Onicolisis", "Onicodistrofia",
  "Heloma duro", "Heloma blando", "Hiperqueratosis plantar", "Queratosis por presión",
  "Tinea pedis", "Verruga plantar", "Pie plano", "Pie cavo", "Metatarsalgia",
  "Fascitis plantar", "Hallux valgus", "Pie diabético", "Neuropatía periférica",
  "Espolón calcáneo", "Dedos en garra", "Dedos en martillo", "Úlcera neuropática"
];

export default function ClinicalPage() {
  const { patientId } = useParams()
  const { user } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [records, setRecords] = useState<ClinicalRecord[]>([])
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<string[]>([])
  const [formData, setFormData] = useState({
    chiefComplaint: '', findings: '', diagnosis: '', treatment: '', procedures: ''
  })
  const [signatures, setSignatures] = useState({ patient: '', fingerprint: '', doctor: '' })
  const [sugerenciasDiag, setSugerenciasDiag] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!user || !patientId) return
      const patDoc = await getDoc(doc(db, 'organizations', user.organizationId, 'patients', patientId))
      if (patDoc.exists()) setPatient({ id: patDoc.id, ...patDoc.data() } as Patient)
      
      const q = query(collection(db, 'organizations', user.organizationId, 'clinicalRecords'), where('patientId', '==', patientId))
      const snap = await getDocs(q)
      setRecords(snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date.toDate() } as ClinicalRecord)))
    }
    loadData()
  }, [user, patientId])

  const generatePDF = () => {
    if (!patient) return
    
    const doc = new jsPDF()
    
    doc.setFontSize(16)
    doc.text('MI CLINICA PODOLOGICA - REPORTE DE ATENCION', 20, 20)
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)
    
    doc.setFontSize(12)
    doc.text(`PACIENTE: ${patient.name}`, 20, 35)
    doc.text(`ID PACIENTE: ${patient.cedula}`, 20, 42)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es')}`, 20, 49)
    
    doc.setFontSize(14)
    doc.text('1. Motivo de Consulta y Hallazgos', 20, 65)
    doc.setFontSize(11)
    const complaint = doc.splitTextToSize(formData.chiefComplaint || 'N/A', 170)
    doc.text(complaint, 20, 75)
    
    const findingsY = 75 + (complaint.length * 5)
    doc.text('Hallazgos:', 20, findingsY + 5)
    const findings = doc.splitTextToSize(formData.findings || 'N/A', 170)
    doc.text(findings, 20, findingsY + 12)
    
    const consentY = findingsY + 12 + (findings.length * 5) + 10
    doc.setFontSize(14)
    doc.text('2. Consentimiento Informado', 20, consentY)
    doc.setFontSize(11)
    doc.text('Firmado: ' + (signatures.patient ? 'Si' : 'No'), 20, consentY + 10)
    if (signatures.patient) {
      doc.text('Fecha firma: ' + new Date().toLocaleDateString('es'), 20, consentY + 17)
    }
    
    const treatmentY = consentY + 30
    doc.setFontSize(14)
    doc.text('3. Tratamiento Realizado', 20, treatmentY)
    doc.setFontSize(11)
    doc.text(`Diagnostico: ${formData.diagnosis || 'N/A'}`, 20, treatmentY + 10)
    doc.text(`Procedimientos: ${formData.procedures || 'N/A'}`, 20, treatmentY + 17)
    const treatment = doc.splitTextToSize(formData.treatment || 'N/A', 170)
    doc.text('Descripcion:', 20, treatmentY + 24)
    doc.text(treatment, 20, treatmentY + 31)
    
    doc.setFontSize(8)
    doc.text('Generado por Mi Clinica Podologica', 20, 280)
    
    doc.save(`expediente-${patient.cedula}-${Date.now()}.pdf`)
  }

  const generateConsentPDF = () => {
    if (!patient) return
    
    const doc = new jsPDF()
    
    doc.setFontSize(16)
    doc.text('CONSENTIMIENTO INFORMADO', 20, 20)
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)
    
    doc.setFontSize(12)
    doc.text(`Paciente: ${patient.name}`, 20, 35)
    doc.text(`Cedula: ${patient.cedula}`, 20, 42)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es')}`, 20, 49)
    
    doc.setFontSize(11)
    const consentText = doc.splitTextToSize(
      'Con base a toda la información y explicación que se me ha brindado por parte del profesional de Mi Clinica ' +
      'respecto a la efectividad y complicaciones más probables del procedimiento y/o la propuesta del tratamiento a seguir, ' +
      'declaro que todos los datos sobre mi condición de salud es cierta y que no he omitido ningún aspecto sobre ello, ' +
      'además autorizo el uso de las fotografías durante el tratamiento para el fin que el profesional considere necesario.',
      170
    )
    doc.text(consentText, 20, 65)
    
    const y1 = 65 + (consentText.length * 5) + 10
    const consentText2 = doc.splitTextToSize(
      'Entiendo de forma clara lo que me han explicado de manera verbal respecto al procedimiento o tratamiento que ' +
      'recibiré; entre ello: como se realiza, los riesgos, complicaciones, las alternativas, garantías, políticas de ' +
      'reagendamiento y me han sido aclaradas todas las dudas; además, que conozco la posibilidad de cambiar de opinión ' +
      'sobre la realización del procedimiento o tratamiento.',
      170
    )
    doc.text(consentText2, 20, y1)
    
    const y2 = y1 + (consentText2.length * 5) + 15
    doc.setFontSize(12)
    doc.text('Firmo conforme, de manera libre y voluntaria:', 20, y2)
    
    doc.setFontSize(11)
    doc.text('_________________________________', 20, y2 + 30)
    doc.text('Firma del Paciente', 20, y2 + 36)
    
    doc.text('_________________________________', 120, y2 + 30)
    doc.text('Firma del Especialista', 120, y2 + 36)
    
    doc.setFontSize(8)
    doc.text('Mi Clinica Podologica', 20, 280)
    
    doc.save(`consentimiento-${patient.cedula}-${Date.now()}.pdf`)
  }

  const handleBusquedaDiagnostico = (valor: string) => {
    setFormData({ ...formData, diagnosis: valor })
    if (valor.length > 1) {
      const filtrados = CATALOGO_DIAGNOSTICOS.filter(d => 
        d.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 8)
      setSugerenciasDiag(filtrados)
    } else {
      setSugerenciasDiag([])
    }
  }

  const saveRecord = async () => {
    if (!user || !patient || !signatures.patient || !signatures.doctor) {
      alert('Faltan firmas requeridas')
      return
    }

    await addDoc(collection(db, 'organizations', user.organizationId, 'clinicalRecords'), {
      organizationId: user.organizationId, patientId: patient.id, appointmentId: 'manual-' + Date.now(),
      date: new Date(),
      preClinic: { chiefComplaint: formData.chiefComplaint, findings: formData.findings },
      consent: { signed: true, signatureUrl: signatures.patient, fingerprintUrl: signatures.fingerprint,
        doctorSignatureUrl: signatures.doctor, signedAt: new Date(), signedBy: patient.name },
      treatment: { description: formData.treatment, diagnosis: formData.diagnosis,
        procedures: formData.procedures.split(',').map(p => p.trim()).filter(Boolean) },
      photos, doctorId: user.id, createdAt: new Date()
    })
    
    alert('✅ Expediente guardado')
    setFormData({ chiefComplaint: '', findings: '', diagnosis: '', treatment: '', procedures: '' })
    setSignatures({ patient: '', fingerprint: '', doctor: '' })
    setPhotos([])
    setStep(1)
    
    const q = query(collection(db, 'organizations', user.organizationId, 'clinicalRecords'), where('patientId', '==', patientId))
    const snap = await getDocs(q)
    setRecords(snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date.toDate() } as ClinicalRecord)))
  }

  if (!patient) return <div className="p-6">Cargando...</div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Expediente Clínico</h1>
          <p className="text-gray-600 mt-1"><span className="font-semibold">ID PACIENTE:</span> {patient.cedula} | {patient.name}</p>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={generatePDF} className="btn-secondary flex items-center gap-2">
            <Printer className="h-5 w-5" /> Imprimir Reporte
          </button>
          <FileText className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {[{ num: 1, label: '1. Pre Clínica' }, { num: 2, label: '2. Consentimiento' },
          { num: 3, label: '3. Tratamiento' }, { num: 4, label: '4. Fotografías' }].map(s => (
          <button key={s.num} onClick={() => setStep(s.num)}
            className={`px-4 py-2 rounded font-semibold transition ${step === s.num ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="card mb-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. Motivo de Consulta y Hallazgos</h2>
            <div>
              <label className="block font-semibold mb-2">Detalle del Motivo de Consulta</label>
              <textarea className="input-field" rows={4} placeholder="Describa el motivo..."
                value={formData.chiefComplaint} onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })} />
            </div>
            <div>
              <label className="block font-semibold mb-2">Hallazgos Clínicos</label>
              <textarea className="input-field" rows={4} placeholder="Hallazgos encontrados..."
                value={formData.findings} onChange={e => setFormData({ ...formData, findings: e.target.value })} />
            </div>
            <button onClick={() => setStep(2)} className="btn-primary">Guardar Pre Clínica y Continuar ➡️</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">2. Consentimiento Informado</h2>
              <button onClick={generateConsentPDF} className="btn-secondary text-sm flex items-center gap-2">
                <Printer className="h-4 w-4" /> Imprimir Consentimiento
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded text-sm">
              <p className="mb-4">Con base a toda la información y explicación que se me ha brindado por parte del profesional de Mi Clinica respecto a la efectividad y complicaciones más probables del procedimiento...</p>
              <p className="font-semibold">Firmo conforme, de manera libre y voluntaria aceptando el procedimiento o tratamiento propuesto:</p>
            </div>
            <SignaturePad title="FIRMA O HUELLA DEL PACIENTE"
              onSave={sig => setSignatures({ ...signatures, patient: sig })}
              onClear={() => setSignatures({ ...signatures, patient: '' })} />
            {signatures.patient && <div className="text-green-600 font-semibold">✓ Firma del paciente confirmada</div>}
            <SignaturePad title="HUELLA DIGITAL (Opcional)"
              onSave={sig => setSignatures({ ...signatures, fingerprint: sig })}
              onClear={() => setSignatures({ ...signatures, fingerprint: '' })} />
            <SignaturePad title="Firma del Especialista Autorizado"
              onSave={sig => setSignatures({ ...signatures, doctor: sig })}
              onClear={() => setSignatures({ ...signatures, doctor: '' })} />
            {signatures.doctor && <div className="text-green-600 font-semibold">✓ Firma del especialista confirmada</div>}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-secondary">← Anterior</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1" disabled={!signatures.patient || !signatures.doctor}>
                Continuar al Tratamiento ➡️
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. Tratamiento Realizado</h2>
            <div className="relative">
              <label className="block font-semibold mb-2">Diagnóstico</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Buscar diagnóstico..."
                value={formData.diagnosis} 
                onChange={e => handleBusquedaDiagnostico(e.target.value)} 
              />
              {sugerenciasDiag.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {sugerenciasDiag.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-primary-50 text-sm transition"
                      onClick={() => {
                        setFormData({ ...formData, diagnosis: d })
                        setSugerenciasDiag([])
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Procedimientos (separados por coma)</label>
              <input type="text" className="input-field" placeholder="Quiropodia, Órtesis plantar..."
                value={formData.procedures} onChange={e => setFormData({ ...formData, procedures: e.target.value })} />
            </div>
            <div>
              <label className="block font-semibold mb-2">Descripción del Tratamiento</label>
              <textarea className="input-field" rows={6} placeholder="Describa el tratamiento..."
                value={formData.treatment} onChange={e => setFormData({ ...formData, treatment: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-secondary">← Anterior</button>
              <button onClick={() => setStep(4)} className="btn-primary flex-1">Continuar a Fotografías ➡️</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Fotografías Clínicas</h2>
            <PhotoGallery patientId={patient.id} organizationId={user!.organizationId} photos={photos} onPhotosUpdate={setPhotos} />
            <div className="flex gap-2 pt-4">
              <button onClick={() => setStep(3)} className="btn-secondary">← Anterior</button>
              <button onClick={saveRecord} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="h-5 w-5" /> Guardar y Finalizar Atención
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">📜 Historial Clínico</h2>
        {records.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Sin citas previas</p>
        ) : (
          <div className="space-y-3">
            {records.map(r => (
              <div key={r.id} className="p-4 bg-gray-50 rounded border-l-4 border-primary">
                <p className="font-bold text-lg">{r.date.toLocaleDateString('es')}</p>
                <p className="text-gray-700 mt-2"><span className="font-semibold">Motivo:</span> {r.preClinic.chiefComplaint}</p>
                <p className="text-gray-700"><span className="font-semibold">Diagnóstico:</span> {r.treatment.diagnosis}</p>
                {r.photos.length > 0 && <p className="text-sm text-primary mt-1">📷 {r.photos.length} fotografías</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}