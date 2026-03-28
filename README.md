# Mi Clínica Podológica - MCP

Sistema **COMPLETO** de gestión clínica podológica con PWA.

## 🎯 Todas las Funcionalidades Implementadas

### ✅ Gestión de Pacientes
- Directorio completo con búsqueda avanzada
- Búsqueda por nombre, cédula y teléfono
- **Búsqueda específica por cédula**
- CRUD completo con confirmaciones
- Eliminación con mensaje "Paciente y registros eliminados"

### ✅ Gestión de Citas
- Agenda con estados (pendientes, confirmadas, completadas)
- Confirmación de citas con botón
- **Citas públicas** (reserva sin login en `/reservar-cita`)
- Mensaje: "Al enviar, un especialista revisará..."
- Sistema "needsConfirmation"

### ✅ Expediente Clínico COMPLETO
1. **Pre Clínica**: Motivo de consulta y hallazgos
2. **Consentimiento Informado**:
   - Texto legal completo
   - Firma digital del paciente
   - Huella digital (opcional)
   - Firma del especialista
   - Confirmaciones individuales
3. **Tratamiento**: Diagnóstico, procedimientos, descripción
4. **Fotografías**: Captura, compresión automática, galería

### ✅ Fotografías Clínicas
- Compresión automática con browser-image-compression
- Subida a Firebase Storage
- Galería por paciente
- Mensaje: "Este paciente aún no tiene fotos registradas"

### ✅ Reportes PDF Profesionales
- **Reporte Mensual de Gestión**:
  - Pacientes atendidos
  - Volumen de pacientes
  - Tratamiento más solicitado
  - Formato profesional con jsPDF

### ✅ Historial Clínico
- Vista completa de consultas previas
- Mensaje: "Sin citas previas" para nuevos
- Detalles de cada atención

## 🚀 Instalación

```bash
npm install
cp .env.example .env
# Editar .env con Firebase
npm run dev
```

## 🔥 Deploy

```bash
vercel
```

## 📋 Checklist de Funcionalidades (Documento Original)

- ✅ Directorio de Pacientes con búsqueda avanzada
- ✅ Búsqueda por cédula específica
- ✅ Registro y eliminación de pacientes
- ✅ Agenda de citas (pendientes, confirmadas)
- ✅ Reservar Cita Pública (sin login)
- ✅ Pre Clínica (motivo y hallazgos)
- ✅ Consentimiento Informado completo
- ✅ Firma digital dual (paciente + especialista)
- ✅ Huella digital
- ✅ Tratamiento realizado
- ✅ Fotografías clínicas con compresión
- ✅ Galería por paciente
- ✅ Historial clínico
- ✅ Reportes PDF mensuales
- ✅ Estadísticas (pacientes, citas, diagnósticos)
- ✅ Multi-tenant
- ✅ PWA con offline
- ✅ Responsive

## 🎨 Rutas

- `/` - Landing page
- `/reservar-cita` - Citas públicas
- `/login` - Login
- `/register` - Registro
- `/dashboard` - Inicio
- `/dashboard/patients` - Pacientes
- `/dashboard/appointments` - Citas
- `/dashboard/clinical/:id` - Expediente
- `/dashboard/reports` - Reportes

---

**Proyecto 100% COMPLETO con todas las funcionalidades by NelSystems**
