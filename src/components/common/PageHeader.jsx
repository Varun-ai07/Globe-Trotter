import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({ 
  title, 
  subtitle, 
  backTo, 
  backLabel = 'Back',
  children 
}) => {
  const navigate = useNavigate()

  return (
    <div className="mb-6 sm:mb-8">
      {backTo && (
        <button
          onClick={() => navigate(backTo)}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-4 sm:mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{backLabel}</span>
        </button>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-1 sm:mb-2 truncate">{title}</h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-white/70 truncate">{subtitle}</p>
          )}
        </div>
        
        {children && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
