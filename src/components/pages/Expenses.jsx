import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Modal from '@/components/molecules/Modal'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ExpenseTable from '@/components/organisms/ExpenseTable'
import ExpenseForm from '@/components/organisms/ExpenseForm'
import { expenseService } from '@/services/api/expenseService'
import { farmService } from '@/services/api/farmService'
import { formatCurrency } from '@/services/utils'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [expensesData, farmsData] = await Promise.all([
        expenseService.getAll(),
        farmService.getAll()
      ])
      
      setExpenses(expensesData)
      setFarms(farmsData)
    } catch (err) {
      setError(err.message || 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = () => {
    setEditingExpense(null)
    setShowForm(true)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleFormSuccess = (expense) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.Id === expense.Id ? expense : e))
    } else {
      setExpenses(prev => [...prev, expense])
    }
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(e => e.Id !== expenseId))
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      const currentMonth = new Date()
      return expenseDate.getMonth() === currentMonth.getMonth() && 
             expenseDate.getFullYear() === currentMonth.getFullYear()
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Track your farm expenses and spending</p>
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
          title="Failed to Load Expenses"
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">
            Track and categorize your farm-related expenses
          </p>
        </div>
        <Button
          onClick={handleAddExpense}
          icon="Plus"
          variant="primary"
          disabled={farms.length === 0}
        >
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-accent text-xl font-bold">$</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-xl font-bold">$</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(thisMonthExpenses)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Content */}
      {farms.length === 0 ? (
        <EmptyState
          title="No farms available"
          description="You need to create a farm before adding expenses. Set up your first farm to get started with expense tracking."
          actionLabel="Add Your First Farm"
          onAction={() => window.location.href = '/farms'}
          icon="MapPin"
        />
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No expenses recorded"
          description="Start tracking your farm expenses to better understand your costs. Add expenses for seeds, fertilizer, equipment, and labor."
          actionLabel="Record Your First Expense"
          onAction={handleAddExpense}
          icon="Receipt"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ExpenseTable
            expenses={expenses}
            farms={farms}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </motion.div>
      )}

      {/* Expense Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
        size="md"
      >
        <ExpenseForm
          expense={editingExpense}
          farms={farms}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  )
}

export default Expenses