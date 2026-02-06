const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} border-3 border-white/10 border-t-amber-500 rounded-full animate-spin`} />
      {text && <p className="text-white/70 text-sm font-medium animate-pulse">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
