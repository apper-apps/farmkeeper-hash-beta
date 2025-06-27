import { motion } from 'framer-motion'

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-surface-200 text-surface-800',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-gray-900',
    error: 'bg-error text-white',
    info: 'bg-info text-white'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={badgeClasses}
    >
      {children}
    </motion.span>
  )
}

export default Badge