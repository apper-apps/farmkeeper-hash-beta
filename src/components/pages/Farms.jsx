import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Modal from '@/components/molecules/Modal'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import FarmCard from '@/components/organisms/FarmCard'
import FarmForm from '@/components/organisms/FarmForm'
import { farmService } from '@/services/api/farmService'
import { cropService } from '@/services/api/cropService'

const Farms = () => {
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingFarm, setEditingFarm] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ])
      
      setFarms(farmsData)
      setCrops(cropsData)
    } catch (err) {
      setError(err.message || 'Failed to load farms')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFarm = () => {
    setEditingFarm(null)
    setShowForm(true)
  }

  const handleEditFarm = (farm) => {
    setEditingFarm(farm)
    setShowForm(true)
  }

  const handleFormSuccess = (farm) => {
    if (editingFarm) {
      setFarms(prev => prev.map(f => f.Id === farm.Id ? farm : f))
    } else {
      setFarms(prev => [...prev, farm])
    }
    setShowForm(false)
    setEditingFarm(null)
  }

  const handleDeleteFarm = (farmId) => {
    setFarms(prev => prev.filter(f => f.Id !== farmId))
  }

  const getCropCountForFarm = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId).length
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingFarm(null)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Farms</h1>
            <p className="text-gray-600 mt-1">Manage your farm properties</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} type="card" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Farms"
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600 mt-1">
            Manage your farm properties and track their activities
          </p>
        </div>
        <Button
          onClick={handleAddFarm}
          icon="Plus"
          variant="primary"
        >
          Add Farm
        </Button>
      </div>

      {/* Content */}
      {farms.length === 0 ? (
        <EmptyState
          title="No farms yet"
          description="Get started by adding your first farm property. You can track crops, tasks, and expenses for each farm."
          actionLabel="Add Your First Farm"
          onAction={handleAddFarm}
          icon="MapPin"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm, index) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FarmCard
                farm={farm}
                cropCount={getCropCountForFarm(farm.Id)}
                onEdit={handleEditFarm}
                onDelete={handleDeleteFarm}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Farm Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingFarm ? 'Edit Farm' : 'Add New Farm'}
        size="md"
      >
        <FarmForm
          farm={editingFarm}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  )
}

export default Farms