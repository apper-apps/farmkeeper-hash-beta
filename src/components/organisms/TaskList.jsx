import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Card from '@/components/molecules/Card'
import { taskService } from '@/services/api/taskService'
import { formatDate } from '@/services/utils'

const TaskList = ({ tasks, farms, crops, onEdit, onDelete, onToggle }) => {
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm?.name || 'Unknown Farm'
  }

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.Id === cropId)
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

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'info',
      medium: 'warning', 
      high: 'error'
    }
    return colors[priority] || 'default'
  }

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed'
    
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (dueDate < today) return 'overdue'
    if (dueDate.toDateString() === today.toDateString()) return 'due-today'
    
    return 'pending'
  }

  const handleToggleComplete = async (task) => {
    setTogglingId(task.Id)
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      })
      
      toast.success(
        updatedTask.completed ? 'Task marked as completed' : 'Task marked as pending'
      )
      
      if (onToggle) onToggle(updatedTask)
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return
    }

    setDeletingId(task.Id)
    try {
      await taskService.delete(task.Id)
      toast.success('Task deleted successfully')
      if (onDelete) onDelete(task.Id)
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    } finally {
      setDeletingId(null)
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status, then by due date
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return new Date(a.dueDate) - new Date(b.dueDate)
  })

  return (
    <div className="space-y-3">
      {sortedTasks.map((task, index) => {
        const status = getTaskStatus(task)
        const isOverdue = status === 'overdue'
        const isDueToday = status === 'due-today'
        
        return (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className={`p-4 transition-all duration-200 ${
                task.completed ? 'opacity-60 bg-surface-50' : ''
              } ${isOverdue ? 'border-l-4 border-l-error' : ''} ${
                isDueToday ? 'border-l-4 border-l-warning' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(task)}
                  disabled={togglingId === task.Id}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-success border-success text-white'
                      : 'border-surface-300 hover:border-primary'
                  }`}
                >
                  {togglingId === task.Id ? (
                    <ApperIcon name="Loader2" size={12} className="animate-spin" />
                  ) : task.completed ? (
                    <ApperIcon name="Check" size={12} />
                  ) : null}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <ApperIcon 
                          name={getTaskIcon(task.type)} 
                          size={16} 
                          className="text-primary flex-shrink-0" 
                        />
                        <h3 className={`font-medium ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <Badge variant={getPriorityColor(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="MapPin" size={12} />
                          {getFarmName(task.farmId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Wheat" size={12} />
                          {getCropName(task.cropId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={12} />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>

                      {/* Status Badge */}
                      {!task.completed && (
                        <div className="flex items-center gap-2">
                          {isOverdue && (
                            <Badge variant="error" size="sm">
                              Overdue
                            </Badge>
                          )}
                          {isDueToday && (
                            <Badge variant="warning" size="sm">
                              Due Today
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEdit?.(task)}
                        className="text-gray-400 hover:text-gray-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        loading={deletingId === task.Id}
                        onClick={() => handleDelete(task)}
                        className="text-gray-400 hover:text-error"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default TaskList