import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { cropService } from '@/services/api/cropService'
import { formatDate, getStatusColor, getDaysBetween } from '@/services/utils'

const CropTable = ({ crops, farms, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('plantingDate')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filterStatus, setFilterStatus] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm?.name || 'Unknown Farm'
  }

  const getCropStatus = (crop) => {
    const now = new Date()
    const plantingDate = new Date(crop.plantingDate)
    const harvestDate = new Date(crop.expectedHarvest)
    
    if (harvestDate < now) {
      return crop.status === 'harvested' ? 'harvested' : 'overdue'
    }
    
    return crop.status || 'active'
  }

  const getDaysToHarvest = (expectedHarvest) => {
    const days = getDaysBetween(new Date(), new Date(expectedHarvest))
    if (new Date(expectedHarvest) < new Date()) {
      return `${days} days overdue`
    }
    return `${days} days`
  }

  const filteredAndSortedCrops = useMemo(() => {
    let filtered = crops
    
    if (filterStatus) {
      filtered = filtered.filter(crop => getCropStatus(crop) === filterStatus)
    }

    return filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (sortField === 'farmName') {
        aValue = getFarmName(a.farmId)
        bValue = getFarmName(b.farmId)
      }
      
      if (sortField === 'status') {
        aValue = getCropStatus(a)
        bValue = getCropStatus(b)
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [crops, farms, sortField, sortDirection, filterStatus])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDelete = async (crop) => {
    if (!window.confirm(`Are you sure you want to delete ${crop.name}?`)) {
      return
    }

    setDeletingId(crop.Id)
    try {
      await cropService.delete(crop.Id)
      toast.success('Crop deleted successfully')
      if (onDelete) onDelete(crop.Id)
    } catch (error) {
      console.error('Error deleting crop:', error)
      toast.error('Failed to delete crop')
    } finally {
      setDeletingId(null)
    }
  }

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      {children}
      {sortField === field && (
        <ApperIcon 
          name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
          size={14} 
        />
      )}
    </button>
  )

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'planning', label: 'Planning' },
    { value: 'harvested', label: 'Harvested' },
    { value: 'overdue', label: 'Overdue' }
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="name">Crop</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="farmName">Farm</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="field">Field</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="plantingDate">Planted</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="expectedHarvest">Harvest</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="status">Status</SortButton>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {filteredAndSortedCrops.map((crop, index) => {
                const status = getCropStatus(crop)
                return (
                  <motion.tr
                    key={crop.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                          <ApperIcon name="Wheat" size={20} className="text-success" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                          {crop.notes && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {crop.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getFarmName(crop.farmId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {crop.field}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(crop.plantingDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(crop.expectedHarvest)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getDaysToHarvest(crop.expectedHarvest)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={status === 'active' ? 'success' : status === 'overdue' ? 'error' : 'default'}>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => onEdit?.(crop)}
                          className="text-gray-400 hover:text-gray-600"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          loading={deletingId === crop.Id}
                          onClick={() => handleDelete(crop)}
                          className="text-gray-400 hover:text-error"
                        />
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CropTable