import { delay } from '@/services/utils'

const STORAGE_KEY = 'farmkeeper_expenses'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading expenses from storage:', error)
    return []
  }
}

const saveToStorage = (expenses) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch (error) {
    console.error('Error saving expenses to storage:', error)
    throw new Error('Failed to save expense data')
  }
}

const getNextId = (expenses) => {
  if (expenses.length === 0) return 1
  return Math.max(...expenses.map(expense => expense.Id)) + 1
}

export const expenseService = {
  async getAll() {
    await delay(300)
    const expenses = loadFromStorage()
    return [...expenses]
  },

  async getById(id) {
    await delay(200)
    const expenses = loadFromStorage()
    const expense = expenses.find(e => e.Id === parseInt(id, 10))
    if (!expense) {
      throw new Error('Expense not found')
    }
    return { ...expense }
  },

  async getByFarmId(farmId) {
    await delay(250)
    const expenses = loadFromStorage()
    return expenses.filter(e => e.farmId === parseInt(farmId, 10))
  },

  async create(expenseData) {
    await delay(400)
    const expenses = loadFromStorage()
    const newExpense = {
      ...expenseData,
      Id: getNextId(expenses),
      createdAt: new Date().toISOString()
    }
    expenses.push(newExpense)
    saveToStorage(expenses)
    return { ...newExpense }
  },

  async update(id, expenseData) {
    await delay(400)
    const expenses = loadFromStorage()
    const index = expenses.findIndex(e => e.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Expense not found')
    }
    
    const updatedExpense = {
      ...expenses[index],
      ...expenseData,
      Id: expenses[index].Id
    }
    expenses[index] = updatedExpense
    saveToStorage(expenses)
    return { ...updatedExpense }
  },

  async delete(id) {
    await delay(300)
    const expenses = loadFromStorage()
    const index = expenses.findIndex(e => e.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Expense not found')
    }
    
    expenses.splice(index, 1)
    saveToStorage(expenses)
    return true
  }
}