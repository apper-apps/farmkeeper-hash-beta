import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import WeatherWidget from '@/components/organisms/WeatherWidget'
import { farmService } from '@/services/api/farmService'
import { cropService } from '@/services/api/cropService'
import { taskService } from '@/services/api/taskService'
import { expenseService } from '@/services/api/expenseService'
import { formatCurrency, formatDate } from '@/services/utils'

const Dashboard = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    expenses: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [farms, crops, tasks, expenses] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        expenseService.getAll()
      ])
      
      setData({ farms, crops, tasks, expenses })
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const totalFarms = data.farms.length
  const activeCrops = data.crops.filter(crop => crop.status === 'active').length
  const pendingTasks = data.tasks.filter(task => !task.completed).length
  const overdueTasks = data.tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length
  
  const monthlyExpenses = data.expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      const currentMonth = new Date()
      return expenseDate.getMonth() === currentMonth.getMonth() && 
             expenseDate.getFullYear() === currentMonth.getFullYear()
    })
    .reduce((total, expense) => total + expense.amount, 0)

  // Get upcoming tasks (next 7 days)
  const upcomingTasks = data.tasks
    .filter(task => {
      if (task.completed) return false
      const taskDate = new Date(task.dueDate)
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      return taskDate >= today && taskDate <= weekFromNow
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  // Get recent expenses
  const recentExpenses = data.expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const getCropName = (cropId) => {
    const crop = data.crops.find(c => c.Id === cropId)
    return crop?.name || 'General'
  }

  const getTaskIcon = (type) => {
    const icons = {
      watering: 'Droplets',
      fertilizing: 'Zap',
      harvesting: 'Scissors',
      planting: 'Seed',
      maintenance: 'Wrench',
      inspection: 'Eye'
    }
    return icons[type] || 'CheckSquare'
  }

  const isTaskOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader count={4} type="card" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader count={2} type="card" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening on your farms.
          </p>
        </div>
        <Button
          onClick={() => navigate('/farms')}
          icon="Plus"
          variant="primary"
        >
          Add Farm
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6" hover onClick={() => navigate('/farms')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" size={24} className="text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Farms</p>
                <p className="text-2xl font-bold text-gray-900">{totalFarms}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6" hover onClick={() => navigate('/crops')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Wheat" size={24} className="text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Crops</p>
                <p className="text-2xl font-bold text-gray-900">{activeCrops}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6" hover onClick={() => navigate('/tasks')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={24} className="text-warning" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
                  {overdueTasks > 0 && (
                    <Badge variant="error" size="sm">
                      {overdueTasks} overdue
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6" hover onClick={() => navigate('/expenses')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} className="text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(monthlyExpenses)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tasks')}
              >
                View All
              </Button>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
                <p className="text-gray-600">No upcoming tasks</p>
                <p className="text-sm text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isTaskOverdue(task.dueDate) 
                        ? 'border-error bg-error/5' 
                        : 'border-surface-200 bg-surface-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ApperIcon 
                        name={getTaskIcon(task.type)} 
                        size={16} 
                        className="text-primary" 
                      />
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          {getCropName(task.cropId)} • {formatDate(task.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isTaskOverdue(task.dueDate) && (
                        <Badge variant="error" size="sm">Overdue</Badge>
                      )}
                      <Badge variant="default" size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <WeatherWidget />
        </motion.div>
      </div>

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/expenses')}
            >
              View All
            </Button>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Receipt" size={48} className="text-surface-400 mx-auto mb-3" />
              <p className="text-gray-600">No expenses recorded</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/expenses')}
              >
                Add Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense, index) => (
                <motion.div
                  key={expense.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">
                      {expense.category} • {formatDate(expense.date)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard