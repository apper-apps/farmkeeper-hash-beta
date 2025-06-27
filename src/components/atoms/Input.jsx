import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  const inputClasses = `
    block w-full px-3 py-2 border border-surface-300 rounded-md shadow-sm 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary 
    focus:border-primary text-sm transition-colors duration-200
    ${error ? 'border-error focus:border-error focus:ring-error' : ''}
    ${icon ? 'pl-10' : ''}
    ${className}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={16} 
              className={error ? 'text-error' : 'text-gray-400'} 
            />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input