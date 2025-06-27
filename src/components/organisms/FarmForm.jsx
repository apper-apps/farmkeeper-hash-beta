import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { farmService } from '@/services/api/farmService'

const FarmForm = ({ farm, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: farm?.name || '',
    location: farm?.location || '',
    size: farm?.size || '',
    unit: farm?.unit || 'acres'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const unitOptions = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'square feet', label: 'Square Feet' },
    { value: 'square meters', label: 'Square Meters' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Farm name is required'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    if (!formData.size || formData.size <= 0) {
      newErrors.size = 'Size must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const farmData = {
        ...formData,
        size: parseFloat(formData.size)
      }

      let result
      if (farm) {
        result = await farmService.update(farm.Id, farmData)
        toast.success('Farm updated successfully')
      } else {
        result = await farmService.create(farmData)
        toast.success('Farm created successfully')
      }

      if (onSuccess) onSuccess(result)
    } catch (error) {
      console.error('Error saving farm:', error)
      toast.error(farm ? 'Failed to update farm' : 'Failed to create farm')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <Input
        label="Farm Name"
        value={formData.name}
        onChange={handleChange('name')}
        error={errors.name}
        placeholder="Enter farm name"
        icon="Home"
      />

      <Input
        label="Location"
        value={formData.location}
        onChange={handleChange('location')}
        error={errors.location}
        placeholder="Enter location (e.g., Johnson County, KS)"
        icon="MapPin"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Size"
          type="number"
          step="0.1"
          min="0"
          value={formData.size}
          onChange={handleChange('size')}
          error={errors.size}
          placeholder="0.0"
          icon="Ruler"
        />

        <Select
          label="Unit"
          value={formData.unit}
          onChange={handleChange('unit')}
          options={unitOptions}
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-surface-200">
        <Button
          type="submit"
          loading={isSubmitting}
          className="flex-1"
        >
          {farm ? 'Update Farm' : 'Create Farm'}
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

export default FarmForm