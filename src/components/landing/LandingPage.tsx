import { Link } from 'react-router-dom'
import { Activity, Calendar, FileText, Users, Shield, Zap, Camera } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Mi Clínica Podológica</span>
        </div>
        <div className="space-x-4">
          <Link to="/reservar-cita" className="text-primary hover:underline font-semibold">Reservar Cita</Link>
          <Link to="/login" className="text-gray-700 hover:text-primary">Iniciar Sesión</Link>
          <Link to="/register" className="btn-primary">Registrarse</Link>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Gestión Clínica Podológica <span className="text-primary">Completa</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sistema multi-tenant profesional con expediente digital, firma electrónica, fotografías clínicas y reportes PDF
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
            Comenzar Gratis
          </Link>
          <Link to="/reservar-cita" className="btn-secondary text-lg px-8 py-3 inline-block">
            Reservar Cita Pública
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades Completas</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Gestión de Pacientes', desc: 'Directorio completo con búsqueda por cédula, nombre y teléfono' },
            { icon: Calendar, title: 'Agenda Inteligente', desc: 'Citas confirmadas, pendientes y reservas públicas automáticas' },
            { icon: FileText, title: 'Expediente Digital', desc: 'Pre-clínica, consentimiento con doble firma y tratamiento completo' },
            { icon: Camera, title: 'Fotografías Clínicas', desc: 'Captura, compresión automática y galería por paciente' },
            { icon: Shield, title: 'Seguridad', desc: 'Datos encriptados y seguridad de alto nivel para datos privados' },
            { icon: Zap, title: 'PWA Offline', desc: 'Funciona sin internet y es instalable en cualquier dispositivo' }
          ].map((feature, i) => (
            <div key={i} className="card text-center hover:shadow-xl transition">
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p>© 2026 Mi Clínica Podológica - Gestión clínica - Dev by NelSystems con ❤️</p>
        </div>
      </footer>
    </div>
  )
}
