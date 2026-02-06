import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import useUIStore from '../../store/uiStore'

const Toast = () => {
  const { toasts, removeToast } = useUIStore()

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />
  }

  const backgrounds = {
    success: 'border-emerald-400/30 bg-emerald-500/10',
    error: 'border-red-400/30 bg-red-500/10',
    info: 'border-blue-400/30 bg-blue-500/10',
    warning: 'border-amber-400/30 bg-amber-500/10'
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl glass backdrop-blur-xl border ${backgrounds[toast.type || 'info']} animate-slide-in-right max-w-sm`}
        >
          {icons[toast.type || 'info']}
          <p className="text-sm text-white flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
