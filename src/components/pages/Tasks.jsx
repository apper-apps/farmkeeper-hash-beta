import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Modal from '@/components/molecules/Modal'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import TaskList from '@/components/organisms/TaskList'
import TaskForm from '@/components/organisms/TaskForm'
import { taskService } from '@/services/api/taskService'
import { farmService } from '@/services/api/farmService'
import { cropService } from '@/services/api/cropService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ])
      
      setTasks(tasksData)
      setFarms(farmsData)
      setCrops(cropsData)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setShowForm(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleFormSuccess = (task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.Id === task.Id ? task : t))
    } else {
      setTasks(prev => [...prev, task])
    }
    setShowForm(false)
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.Id !== taskId))
  }

  const handleToggleTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.Id === updatedTask.Id ? updatedTask : t))
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const getFilteredTasks = () => {
    if (filterStatus === 'all') return tasks
    if (filterStatus === 'pending') return tasks.filter(t => !t.completed)
    if (filterStatus === 'completed') return tasks.filter(t => t.completed)
    if (filterStatus === 'overdue') {
      return tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date())
    }
    return tasks
  }

  const filteredTasks = getFilteredTasks()

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">Schedule and track farm activities</p>
          </div>
        </div>
        <SkeletonLoader count={5} type="list" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Tasks"
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Schedule and track your farm activities and maintenance
          </p>
        </div>
        <Button
          onClick={handleAddTask}
          icon="Plus"
          variant="primary"
          disabled={farms.length === 0}
        >
          Add Task
        </Button>
      </div>

      {/* Filters */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {farms.length === 0 ? (
        <EmptyState
          title="No farms available"
          description="You need to create a farm before adding tasks. Set up your first farm to get started with task management."
          actionLabel="Add Your First Farm"
          onAction={() => window.location.href = '/farms'}
          icon="MapPin"
        />
      ) : filteredTasks.length === 0 ? (
        tasks.length === 0 ? (
          <EmptyState
            title="No tasks scheduled"
            description="Stay organized by scheduling your farm activities. Add tasks for watering, fertilizing, harvesting, and maintenance."
            actionLabel="Schedule Your First Task"
            onAction={handleAddTask}
            icon="CheckSquare"
          />
        ) : (
          <EmptyState
            title={`No ${filterStatus} tasks`}
            description={`There are no ${filterStatus} tasks to display. Try changing the filter or add a new task.`}
            actionLabel="Add New Task"
            onAction={handleAddTask}
            icon="CheckSquare"
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TaskList
            tasks={filteredTasks}
            farms={farms}
            crops={crops}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
          />
        </motion.div>
      )}

      {/* Task Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          farms={farms}
          crops={crops}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  )
}

export default Tasks