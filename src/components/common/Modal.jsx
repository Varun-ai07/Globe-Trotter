import { X } from 'lucide-react'
import useUIStore from '../../store/uiStore'

const Modal = ({ name, title, children, size = 'md' }) => {
  const { activeModal, closeModal } = useUIStore()

  if (activeModal !== name) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className={`relative w-full ${sizes[size]} glass-premium rounded-3xl p-6 animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white/70" />
          </button>
        </div>
        
        {/* Content */}
        <div className="text-white">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
