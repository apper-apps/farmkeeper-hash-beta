import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, ...props }) => {
  const cardClasses = `
    bg-white rounded-lg border border-surface-200 shadow-sm
    ${hover ? 'cursor-pointer transition-all duration-200' : ''}
    ${className}
  `

  const cardVariants = hover ? {
    hover: { 
      scale: 1.02,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  } : {}

  return (
    <motion.div
      className={cardClasses}
      variants={cardVariants}
      whileHover={hover ? 'hover' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card