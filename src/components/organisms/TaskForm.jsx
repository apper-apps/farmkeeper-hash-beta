import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { taskService, templateService } from '@/services/api/taskService'

const TaskForm = ({ task, farms, crops, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: task?.farmId || '',
    cropId: task?.cropId || '',
    title: task?.title || '',
    type: task?.type || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || 'medium',
    completed: task?.completed || false
})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [templates, setTemplates] = useState([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  const farmOptions = farms.map(farm => ({
    value: farm.Id,
    label: farm.name
  }))

  const getCropOptions = () => {
    if (!formData.farmId) return []
    const farmCrops = crops.filter(crop => crop.farmId === parseInt(formData.farmId, 10))
    return [
      { value: '', label: 'General (No specific crop)' },
      ...farmCrops.map(crop => ({
        value: crop.Id,
        label: crop.name
      }))
    ]
  }

  const taskTypeOptions = [
    { value: 'watering', label: 'Watering' },
    { value: 'fertilizing', label: 'Fertilizing' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'planting', label: 'Planting' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inspection', label: 'Inspection' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
{ value: 'high', label: 'High' }
  ]

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const templatesData = await templateService.getAllTemplates()
      setTemplates(templatesData)
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoadingTemplates(false)
    }
  }

  const handleLoadTemplate = async (templateId) => {
    if (!templateId) return
    
    try {
      const template = await templateService.getTemplateById(templateId)
      const { taskData } = template
      
      // Load template data while preserving current farm selection if compatible
      setFormData(prev => ({
        ...taskData,
        farmId: prev.farmId || taskData.farmId || '',
        // Preserve current crop if it belongs to the selected farm
        cropId: (prev.farmId === taskData.farmId) ? prev.cropId : taskData.cropId || ''
      }))
      
      toast.success(`Template "${template.name}" loaded`)
      setShowTemplateSelector(false)
    } catch (error) {
      console.error('Error loading template:', error)
      toast.error('Failed to load template')
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name')
      return
    }

    if (!formData.title.trim() || !formData.type) {
      toast.error('Please fill in task title and type before saving template')
      return
    }

    try {
      const templateData = {
        name: templateName.trim(),
        description: `Template for ${formData.type} - ${formData.title}`,
        taskData: {
          title: formData.title,
          type: formData.type,
          priority: formData.priority,
          // Don't save farm/crop specifics to make templates more reusable
          farmId: '',
          cropId: ''
        }
      }

      await templateService.createTemplate(templateData)
      toast.success('Template saved successfully')
      setTemplateName('')
      loadTemplates()
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      await templateService.deleteTemplate(templateId)
      toast.success('Template deleted successfully')
      loadTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.farmId) {
      newErrors.farmId = 'Farm is required'
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (!formData.type) {
      newErrors.type = 'Task type is required'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const taskData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        cropId: formData.cropId ? parseInt(formData.cropId, 10) : null
      }

      let result
      if (task) {
        result = await taskService.update(task.Id, taskData)
        toast.success('Task updated successfully')
      } else {
        result = await taskService.create(taskData)
        toast.success('Task created successfully')
      }

      if (onSuccess) onSuccess(result)
    } catch (error) {
      console.error('Error saving task:', error)
      toast.error(task ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field) => (e) => {
    const value = field === 'completed' ? e.target.checked : e.target.value
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Clear cropId when farm changes
      ...(field === 'farmId' && { cropId: '' })
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
      {/* Template Selector */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ApperIcon name="BookTemplate" size={16} />
            Task Templates
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            icon={showTemplateSelector ? "ChevronUp" : "ChevronDown"}
          >
            {showTemplateSelector ? 'Hide Templates' : 'Show Templates'}
          </Button>
        </div>

        {showTemplateSelector && (
          <div className="space-y-3">
            {/* Load Template */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Load from Template
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => handleLoadTemplate(e.target.value)}
                  disabled={loadingTemplates}
                >
                  <option value="">Select a template...</option>
                  {templates.map(template => (
                    <option key={template.Id} value={template.Id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {templates.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTemplates(templates.filter(t => t.Id !== templates[0]?.Id))}
                    icon="Trash2"
                    className="text-red-600 hover:text-red-700"
                    title="Delete selected template"
                  />
                )}
              </div>
            </div>

            {/* Save Template */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Save as Template
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter template name..."
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveTemplate}
                  icon="Save"
                  disabled={!templateName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

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
          label="Crop (Optional)"
          value={formData.cropId}
          onChange={handleChange('cropId')}
          options={getCropOptions()}
          placeholder="Select crop or leave for general task"
          disabled={!formData.farmId}
        />
      </div>

      <Input
        label="Task Title"
        value={formData.title}
        onChange={handleChange('title')}
        error={errors.title}
        placeholder="e.g., Water tomato plants, Apply fertilizer"
        icon="CheckSquare"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Task Type"
          value={formData.type}
          onChange={handleChange('type')}
          options={taskTypeOptions}
          error={errors.type}
          placeholder="Select task type"
        />

        <Select
          label="Priority"
          value={formData.priority}
          onChange={handleChange('priority')}
          options={priorityOptions}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={handleChange('dueDate')}
        error={errors.dueDate}
      />

      {task && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="completed"
            checked={formData.completed}
            onChange={handleChange('completed')}
            className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
          />
          <label htmlFor="completed" className="text-sm font-medium text-gray-700">
            Mark as completed
          </label>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-surface-200">
        <Button
          type="submit"
          loading={isSubmitting}
          className="flex-1"
        >
          {task ? 'Update Task' : 'Create Task'}
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

export default TaskForm