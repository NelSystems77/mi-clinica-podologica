import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { FileDown, BarChart3, TrendingUp } from 'lucide-react'
import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function ReportsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ patients: 0, appointments: 0, records: 0, topDiagnosis: '' })

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return
      const [p, a, r] = await Promise.all([
        getDocs(collection(db, 'organizations', user.organizationId, 'patients')),
        getDocs(collection(db, 'organizations', user.organizationId, 'appointments')),
        getDocs(collection(db, 'organizations', user.organizationId, 'clinicalRecords'))
      ])
      
      const diagnoses: Record<string, number> = {}
      r.docs.forEach(d => {
        const diag = d.data().treatment?.diagnosis
        if (diag) diagnoses[diag] = (diagnoses[diag] || 0) + 1
      })
      const topDiag = Object.entries(diagnoses).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
      
      setStats({ patients: p.size, appointments: a.size, records: r.size, topDiagnosis: topDiag })
    }
    loadStats()
  }, [user])

  const generateMonthlyReport = () => {
    const doc = new jsPDF()
    const now = new Date()
    
    doc.setFontSize(18)
    doc.text('REPORTE MENSUAL DE GESTIÓN', 20, 20)
    doc.setFontSize(12)
    doc.text('Mi Clínica Podológica', 20, 30)
    doc.text(`Fecha: ${format(now, "d 'de' MMMM 'de' yyyy", { locale: es })}`, 20, 38)
    doc.setLineWidth(0.5)
    doc.line(20, 42, 190, 42)
    
    doc.setFontSize(14)
    doc.text('RESUMEN EJECUTIVO', 20, 55)
    doc.setFontSize(11)
    doc.text(`Organización: ${user?.organizationId}`, 25, 65)
    doc.text(`Período: ${format(now, 'MMMM yyyy', { locale: es })}`, 25, 72)
    
    doc.setFontSize(14)
    doc.text('VOLUMEN DE PACIENTES', 20, 90)
    doc.setFontSize(11)
    doc.text(`Pacientes Atendidos: ${stats.patients}`, 25, 100)
    doc.text(`Citas Realizadas: ${stats.appointments}`, 25, 107)
    doc.text(`Expedientes Generados: ${stats.records}`, 25, 114)
    
    doc.setFontSize(14)
    doc.text('TRATAMIENTO MÁS SOLICITADO', 20, 130)
    doc.setFontSize(11)
    doc.text(`Diagnóstico principal: ${stats.topDiagnosis}`, 25, 140)
    
    doc.setFontSize(8)
    doc.text('Generado automáticamente por Mi Clínica Podológica', 20, 280)
    
    doc.save(`reporte-mensual-${format(now, 'yyyy-MM')}.pdf`)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" /> 📊 Reportes
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-600 mb-2">PACIENTES ATENDIDOS</h3>
          <p className="text-4xl font-bold text-primary">{stats.patients}</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-600 mb-2">Citas Realizadas</h3>
          <p className="text-4xl font-bold text-secondary">{stats.appointments}</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-600 mb-2">Expedientes</h3>
          <p className="text-4xl font-bold text-gray-700">{stats.records}</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">Tratamiento Más Solicitado</h2>
        </div>
        <p className="text-2xl font-semibold text-primary">{stats.topDiagnosis}</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Generar Reportes</h2>
        <button onClick={generateMonthlyReport} className="btn-primary flex items-center gap-2">
          <FileDown className="h-5 w-5" /> Generar PDF Mensual
        </button>
      </div>
    </div>
  )
}