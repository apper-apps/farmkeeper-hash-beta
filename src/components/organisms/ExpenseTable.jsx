import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { expenseService } from '@/services/api/expenseService'
import { formatCurrency, formatDate } from '@/services/utils'

const ExpenseTable = ({ expenses, farms, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterFarm, setFilterFarm] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm?.name || 'Unknown Farm'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Seeds': 'success',
      'Fertilizer': 'info',
      'Equipment': 'warning',
      'Labor': 'accent',
      'Fuel': 'secondary',
      'Maintenance': 'default'
    }
    return colors[category] || 'default'
  }

  // Get unique categories and farms for filters
  const categories = [...new Set(expenses.map(e => e.category))].sort()
  const farmsWithExpenses = [...new Set(expenses.map(e => e.farmId))]
    .map(farmId => farms.find(f => f.Id === farmId))
    .filter(Boolean)

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses

    if (filterCategory) {
      filtered = filtered.filter(expense => expense.category === filterCategory)
    }

    if (filterFarm) {
      filtered = filtered.filter(expense => expense.farmId === parseInt(filterFarm, 10))
    }

    return filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (sortField === 'farmName') {
        aValue = getFarmName(a.farmId)
        bValue = getFarmName(b.farmId)
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [expenses, farms, sortField, sortDirection, filterCategory, filterFarm])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDelete = async (expense) => {
    if (!window.confirm(`Are you sure you want to delete this ${formatCurrency(expense.amount)} expense?`)) {
      return
    }

    setDeletingId(expense.Id)
    try {
      await expenseService.delete(expense.Id)
      toast.success('Expense deleted successfully')
      if (onDelete) onDelete(expense.Id)
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filterFarm}
          onChange={(e) => setFilterFarm(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Farms</option>
          {farmsWithExpenses.map(farm => (
            <option key={farm.Id} value={farm.Id}>
              {farm.name}
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
                  <SortButton field="date">Date</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="description">Description</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="category">Category</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="farmName">Farm</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="amount">Amount</SortButton>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {filteredAndSortedExpenses.map((expense, index) => (
                <motion.tr
                  key={expense.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-surface-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {expense.description}
                      </div>
                      {expense.vendor && (
                        <div className="text-xs text-gray-500 truncate">
                          {expense.vendor}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getFarmName(expense.farmId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEdit?.(expense)}
                        className="text-gray-400 hover:text-gray-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        loading={deletingId === expense.Id}
                        onClick={() => handleDelete(expense)}
                        className="text-gray-400 hover:text-error"
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpenseTable