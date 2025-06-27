import { delay } from '@/services/utils'

const STORAGE_KEY = 'farmkeeper_farms'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading farms from storage:', error)
    return []
  }
}

const saveToStorage = (farms) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farms))
  } catch (error) {
    console.error('Error saving farms to storage:', error)
    throw new Error('Failed to save farm data')
  }
}

const getNextId = (farms) => {
  if (farms.length === 0) return 1
  return Math.max(...farms.map(farm => farm.Id)) + 1
}

export const farmService = {
  async getAll() {
    await delay(300)
    const farms = loadFromStorage()
    return [...farms]
  },

  async getById(id) {
    await delay(200)
    const farms = loadFromStorage()
    const farm = farms.find(f => f.Id === parseInt(id, 10))
    if (!farm) {
      throw new Error('Farm not found')
    }
    return { ...farm }
  },

  async create(farmData) {
    await delay(400)
    const farms = loadFromStorage()
    const newFarm = {
      ...farmData,
      Id: getNextId(farms),
      createdAt: new Date().toISOString()
    }
    farms.push(newFarm)
    saveToStorage(farms)
    return { ...newFarm }
  },

  async update(id, farmData) {
    await delay(400)
    const farms = loadFromStorage()
    const index = farms.findIndex(f => f.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Farm not found')
    }
    
    const updatedFarm = {
      ...farms[index],
      ...farmData,
      Id: farms[index].Id // Prevent ID modification
    }
    farms[index] = updatedFarm
    saveToStorage(farms)
    return { ...updatedFarm }
  },

  async delete(id) {
    await delay(300)
    const farms = loadFromStorage()
    const index = farms.findIndex(f => f.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Farm not found')
    }
    
    farms.splice(index, 1)
    saveToStorage(farms)
    return true
  }
}