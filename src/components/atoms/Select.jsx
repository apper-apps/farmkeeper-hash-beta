import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select option...',
  className = '',
  ...props 
}, ref) => {
  const selectClasses = `
    block w-full px-3 py-2 border border-surface-300 rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
    text-sm transition-colors duration-200 appearance-none bg-white
    ${error ? 'border-error focus:border-error focus:ring-error' : ''}
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
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
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

Select.displayName = 'Select'

export default Select