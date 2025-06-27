import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Modal from '@/components/molecules/Modal'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import CropTable from '@/components/organisms/CropTable'
import { cropService } from '@/services/api/cropService'
import { farmService } from '@/services/api/farmService'
import CropForm from '@/components/organisms/CropForm'

const Crops = () => {
  const [crops, setCrops] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCrop, setEditingCrop] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ])
      
      setCrops(cropsData)
      setFarms(farmsData)
    } catch (err) {
      setError(err.message || 'Failed to load crops')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCrop = () => {
    setEditingCrop(null)
    setShowForm(true)
  }

  const handleEditCrop = (crop) => {
    setEditingCrop(crop)
    setShowForm(true)
  }

  const handleFormSuccess = (crop) => {
    if (editingCrop) {
      setCrops(prev => prev.map(c => c.Id === crop.Id ? crop : c))
    } else {
      setCrops(prev => [...prev, crop])
    }
    setShowForm(false)
    setEditingCrop(null)
  }

  const handleDeleteCrop = (cropId) => {
    setCrops(prev => prev.filter(c => c.Id !== cropId))
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCrop(null)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Crops</h1>
            <p className="text-gray-600 mt-1">Track your planted crops and harvests</p>
          </div>
        </div>
        <SkeletonLoader count={5} type="table" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Crops"
          message={error}
          onRetry={loadData}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Crops</h1>
          <p className="text-gray-600 mt-1">
            Track your planted crops, harvest dates, and field locations
          </p>
        </div>
        <Button
          onClick={handleAddCrop}
          icon="Plus"
          variant="primary"
          disabled={farms.length === 0}
        >
          Add Crop
        </Button>
      </div>

      {/* Content */}
      {farms.length === 0 ? (
        <EmptyState
          title="No farms available"
          description="You need to create a farm before adding crops. Set up your first farm to get started with crop tracking."
          actionLabel="Add Your First Farm"
          onAction={() => window.location.href = '/farms'}
          icon="MapPin"
        />
      ) : crops.length === 0 ? (
        <EmptyState
          title="No crops planted yet"
          description="Start tracking your agricultural activities by adding your first crop. Record planting dates, expected harvests, and field locations."
          actionLabel="Plant Your First Crop"
          onAction={handleAddCrop}
          icon="Wheat"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CropTable
            crops={crops}
            farms={farms}
            onEdit={handleEditCrop}
            onDelete={handleDeleteCrop}
          />
        </motion.div>
      )}

      {/* Crop Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingCrop ? 'Edit Crop' : 'Add New Crop'}
        size="lg"
      >
        <CropForm
          crop={editingCrop}
          farms={farms}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  )
}

export default Crops