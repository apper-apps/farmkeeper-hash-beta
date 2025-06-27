import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { farmService } from '@/services/api/farmService'

const FarmCard = ({ farm, onEdit, onDelete, cropCount = 0 }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await farmService.delete(farm.Id)
      toast.success('Farm deleted successfully')
      if (onDelete) onDelete(farm.Id)
    } catch (error) {
      console.error('Error deleting farm:', error)
      toast.error('Failed to delete farm')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full" hover>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="MapPin" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {farm.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <ApperIcon name="MapPin" size={14} />
                {farm.location}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit?.(farm)}
              className="text-gray-500 hover:text-gray-700"
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              loading={isDeleting}
              onClick={handleDelete}
              className="text-gray-500 hover:text-error"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Size</span>
            <span className="text-sm font-medium">
              {farm.size} {farm.unit}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Crops</span>
            <Badge variant={cropCount > 0 ? 'success' : 'default'}>
              {cropCount}
            </Badge>
          </div>

          <div className="pt-2 border-t border-surface-200">
            <p className="text-xs text-gray-500">
              Created {new Date(farm.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default FarmCard