import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { cropService } from '@/services/api/cropService'

const CropForm = ({ crop, farms, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: crop?.farmId || '',
    name: crop?.name || '',
    field: crop?.field || '',
    plantingDate: crop?.plantingDate || '',
    expectedHarvest: crop?.expectedHarvest || '',
    status: crop?.status || 'planning',
    notes: crop?.notes || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const farmOptions = farms.map(farm => ({
    value: farm.Id,
    label: farm.name
  }))

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'harvested', label: 'Harvested' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.farmId) {
      newErrors.farmId = 'Farm is required'
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Crop name is required'
    }
    
    if (!formData.field.trim()) {
      newErrors.field = 'Field location is required'
    }
    
    if (!formData.plantingDate) {
      newErrors.plantingDate = 'Planting date is required'
    }
    
    if (!formData.expectedHarvest) {
      newErrors.expectedHarvest = 'Expected harvest date is required'
    }

    if (formData.plantingDate && formData.expectedHarvest) {
      if (new Date(formData.expectedHarvest) <= new Date(formData.plantingDate)) {
        newErrors.expectedHarvest = 'Harvest date must be after planting date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const cropData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10)
      }

      let result
      if (crop) {
        result = await cropService.update(crop.Id, cropData)
        toast.success('Crop updated successfully')
      } else {
        result = await cropService.create(cropData)
        toast.success('Crop added successfully')
      }

      if (onSuccess) onSuccess(result)
    } catch (error) {
      console.error('Error saving crop:', error)
      toast.error(crop ? 'Failed to update crop' : 'Failed to add crop')
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

        <Input
          label="Crop Name"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="e.g., Sweet Corn, Tomatoes"
          icon="Wheat"
        />
      </div>

      <Input
        label="Field Location"
        value={formData.field}
        onChange={handleChange('field')}
        error={errors.field}
        placeholder="e.g., North Field, Greenhouse A"
        icon="MapPin"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Planting Date"
          type="date"
          value={formData.plantingDate}
          onChange={handleChange('plantingDate')}
          error={errors.plantingDate}
        />

        <Input
          label="Expected Harvest"
          type="date"
          value={formData.expectedHarvest}
          onChange={handleChange('expectedHarvest')}
          error={errors.expectedHarvest}
        />
      </div>

      <Select
        label="Status"
        value={formData.status}
        onChange={handleChange('status')}
        options={statusOptions}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={handleChange('notes')}
          rows={3}
          className="block w-full px-3 py-2 border border-surface-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors duration-200"
          placeholder="Add any additional notes about this crop..."
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-surface-200">
        <Button
          type="submit"
          loading={isSubmitting}
          className="flex-1"
        >
          {crop ? 'Update Crop' : 'Add Crop'}
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

export default CropForm