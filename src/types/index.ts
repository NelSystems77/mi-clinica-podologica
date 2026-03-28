// Types para la aplicación completa
export interface User {
  id: string
  email: string
  name: string
  organizationId: string
  role: 'admin' | 'doctor' | 'assistant'
  createdAt: Date
}

export interface Organization {
  id: string
  name: string
  plan: 'free' | 'premium' | 'enterprise'
  maxUsers: number
  createdAt: Date
  settings: {
    autoConfirmAppointments: boolean
    requireConsent: boolean
    allowPublicBooking: boolean
  }
}

export interface Patient {
  id: string
  organizationId: string
  name: string
  cedula: string
  phone: string
  email?: string
  birthDate?: Date
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  organizationId: string
  patientId: string
  patientName: string
  doctorId: string
  date: Date
  time: string
  type: 'general' | 'followup' | 'emergency'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  public?: boolean
  needsConfirmation?: boolean
  createdAt: Date
}

export interface ClinicalRecord {
  id: string
  organizationId: string
  patientId: string
  appointmentId: string
  date: Date
  preClinic: {
    chiefComplaint: string
    findings: string
  }
  consent: {
    signed: boolean
    signatureUrl?: string
    signedAt?: Date
    signedBy: string
  }
  treatment: {
    description: string
    diagnosis: string
    procedures: string[]
  }
  photos: string[]
  doctorId: string
  createdAt: Date
}

export interface Report {
  id: string
  organizationId: string
  type: 'individual' | 'monthly'
  patientId?: string
  month?: string
  year?: number
  data: any
  generatedAt: Date
  generatedBy: string
}
