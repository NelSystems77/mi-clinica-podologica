import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { storage } from '../../services/firebase'
import imageCompression from 'browser-image-compression'

interface PhotoGalleryProps {
  patientId: string
  organizationId: string
  photos: string[]
  onPhotosUpdate: (photos: string[]) => void
}

export default function PhotoGallery({ patientId, organizationId, photos, onPhotosUpdate }: PhotoGalleryProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      })

      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        const storageRef = ref(storage, `organizations/${organizationId}/patients/${patientId}/${Date.now()}.jpg`)
        await uploadString(storageRef, base64, 'data_url')
        const url = await getDownloadURL(storageRef)
        onPhotosUpdate([...photos, url])
      }
      reader.readAsDataURL(compressed)
    } catch (error) {
      console.error('Error al subir foto:', error)
      alert('Error al procesar imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Fotografías Clínicas</h3>
        <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm flex items-center gap-2" disabled={uploading}>
          <Camera className="h-4 w-4" /> {uploading ? 'Subiendo...' : 'Agregar Foto'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
      </div>

      {photos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Este paciente aún no tiene fotos registradas.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-48 object-cover rounded" />
              <button onClick={() => onPhotosUpdate(photos.filter((_, idx) => idx !== i))} 
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}