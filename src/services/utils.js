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

export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
    }
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB'
    }
  }
  
  return { valid: true }
}

export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-success text-white',
    planning: 'bg-info text-white',
    harvested: 'bg-surface-600 text-white',
    completed: 'bg-success text-white',
    pending: 'bg-warning text-gray-900',
    cancelled: 'bg-danger text-white',
    overdue: 'bg-danger text-white'
  }
  
  return colors[status] || 'bg-secondary text-white'
}