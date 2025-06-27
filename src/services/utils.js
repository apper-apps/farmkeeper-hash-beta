export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const getDaysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay))
}

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-success text-white',
    planning: 'bg-info text-white',
    harvested: 'bg-surface-600 text-white',
    completed: 'bg-success text-white',
    pending: 'bg-warning text-gray-900',
    overdue: 'bg-error text-white'
  }
  return colors[status] || 'bg-surface-400 text-white'
}