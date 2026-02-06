const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'p-4 sm:p-6',
  onClick,
  ...props 
}) => {
  const variants = {
    default: 'glass-card',
    premium: 'glass-premium rounded-2xl sm:rounded-3xl',
    light: 'glass-light rounded-xl sm:rounded-2xl',
    dark: 'glass-dark rounded-xl sm:rounded-2xl',
  }

  const hoverClass = hover && onClick ? 'hover:scale-[1.02] hover:-translate-y-1 cursor-pointer' : ''

  return (
    <div
      className={`${variants[variant]} ${padding} ${hoverClass} transition-all duration-300 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassCard
