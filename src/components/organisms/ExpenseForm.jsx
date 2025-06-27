import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { expenseService } from '@/services/api/expenseService'
import PhotoUpload from '@/components/molecules/PhotoUpload'

const ExpenseForm = ({ expense, farms, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: expense?.farmId || '',
    category: expense?.category || '',
    amount: expense?.amount || '',
    date: expense?.date || new Date().toISOString().split('T')[0],
    description: expense?.description || '',
    vendor: expense?.vendor || '',
    photos: expense?.photos || []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const farmOptions = farms.map(farm => ({
    value: farm.Id,
    label: farm.name
  }))

  const categoryOptions = [
    { value: 'Seeds', label: 'Seeds' },
    { value: 'Fertilizer', label: 'Fertilizer' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Labor', label: 'Labor' },
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Other', label: 'Other' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.farmId) {
      newErrors.farmId = 'Farm is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

setIsSubmitting(true)
    try {
      const expenseData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        amount: parseFloat(formData.amount),
        photos: formData.photos
      }

      let result
      if (expense) {
        result = await expenseService.update(expense.Id, expenseData)
        toast.success('Expense updated successfully')
      } else {
        result = await expenseService.create(expenseData)
        toast.success('Expense recorded successfully')
      }

      if (onSuccess) onSuccess(result)
    } catch (error) {
      console.error('Error saving expense:', error)
      toast.error(expense ? 'Failed to update expense' : 'Failed to record expense')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing/selecting
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Farm"
          value={formData.farmId}
          onChange={handleChange('farmId')}
          options={farmOptions}
          error={errors.farmId}
          placeholder="Select farm"
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={handleChange('category')}
          options={categoryOptions}
          error={errors.category}
          placeholder="Select category"
        />
      </div>

      <Input
        label="Description"
        value={formData.description}
        onChange={handleChange('description')}
        error={errors.description}
        placeholder="e.g., Sweet corn seed - Silver Queen variety"
        icon="FileText"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange('amount')}
          error={errors.amount}
          placeholder="0.00"
          icon="DollarSign"
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={handleChange('date')}
          error={errors.date}
        />
      </div>

      <Input
        label="Vendor (Optional)"
        value={formData.vendor}
        onChange={handleChange('vendor')}
        placeholder="e.g., Farmers Supply Co"
icon="Store"
      />

      <PhotoUpload
        photos={formData.photos}
        onChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
        label="Receipt Photos"
        maxFiles={3}
      />

      <div className="flex gap-3 pt-4 border-t border-surface-200">
        <Button
          type="submit"
          loading={isSubmitting}
          className="flex-1"
        >
          {expense ? 'Update Expense' : 'Record Expense'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default ExpenseForm