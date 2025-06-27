import { delay } from '@/services/utils'

const STORAGE_KEY = 'farmkeeper_crops'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading crops from storage:', error)
    return []
  }
}

const saveToStorage = (crops) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crops))
  } catch (error) {
    console.error('Error saving crops to storage:', error)
    throw new Error('Failed to save crop data')
  }
}

const getNextId = (crops) => {
  if (crops.length === 0) return 1
  return Math.max(...crops.map(crop => crop.Id)) + 1
}

export const cropService = {
  async getAll() {
    await delay(300)
    const crops = loadFromStorage()
    return [...crops]
  },

  async getById(id) {
    await delay(200)
    const crops = loadFromStorage()
    const crop = crops.find(c => c.Id === parseInt(id, 10))
    if (!crop) {
      throw new Error('Crop not found')
    }
    return { ...crop }
  },

  async getByFarmId(farmId) {
    await delay(250)
    const crops = loadFromStorage()
    return crops.filter(c => c.farmId === parseInt(farmId, 10))
  },

async create(cropData) {
    await delay(400)
    const crops = loadFromStorage()
    const newCrop = {
      ...cropData,
      Id: getNextId(crops),
      photos: cropData.photos || [],
      createdAt: new Date().toISOString()
    }
    crops.push(newCrop)
    saveToStorage(crops)
    return { ...newCrop }
  },

async update(id, cropData) {
    await delay(400)
    const crops = loadFromStorage()
    const index = crops.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Crop not found')
    }
    
    const updatedCrop = {
      ...crops[index],
      ...cropData,
      Id: crops[index].Id,
      photos: cropData.photos || crops[index].photos || []
    }
    crops[index] = updatedCrop
    saveToStorage(crops)
    return { ...updatedCrop }
  },

  async delete(id) {
    await delay(300)
    const crops = loadFromStorage()
    const index = crops.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Crop not found')
    }
    
    crops.splice(index, 1)
    saveToStorage(crops)
    return true
  }
}