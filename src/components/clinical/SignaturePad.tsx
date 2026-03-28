import { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { X } from 'lucide-react'

interface SignaturePadProps {
  title: string
  onSave: (signature: string) => void
  onClear?: () => void
}

export default function SignaturePad({ title, onSave, onClear }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null)

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert('Por favor, firme primero')
      return
    }
    onSave(sigRef.current.toDataURL())
  }

  const handleClear = () => {
    sigRef.current?.clear()
    onClear?.()
  }

  return (
    <div className="space-y-2">
      <label className="font-semibold">{title}</label>
      <div className="border-2 border-gray-300 rounded bg-white">
        <SignatureCanvas ref={sigRef} canvasProps={{ className: 'w-full h-48' }} />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handleClear} className="btn-secondary text-sm flex items-center gap-2">
          <X className="h-4 w-4" /> Limpiar
        </button>
        <button type="button" onClick={handleSave} className="btn-primary text-sm">Confirmar Firma</button>
      </div>
    </div>
  )
}