import { delay } from "@/services/utils";

const STORAGE_KEY = 'farmkeeper_tasks'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading tasks from storage:', error)
    return []
  }
}

const saveToStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks to storage:', error)
    throw new Error('Failed to save task data')
  }
}

const getNextId = (tasks) => {
  if (tasks.length === 0) return 1
  return Math.max(...tasks.map(task => task.Id)) + 1
}

export const taskService = {
  async getAll() {
    await delay(300)
    const tasks = loadFromStorage()
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const tasks = loadFromStorage()
    const task = tasks.find(t => t.Id === parseInt(id, 10))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async getByFarmId(farmId) {
    await delay(250)
    const tasks = loadFromStorage()
    return tasks.filter(t => t.farmId === parseInt(farmId, 10))
  },

  async create(taskData) {
    await delay(400)
    const tasks = loadFromStorage()
    const newTask = {
      ...taskData,
      Id: getNextId(tasks),
      createdAt: new Date().toISOString()
    }
    tasks.push(newTask)
    saveToStorage(tasks)
    return { ...newTask }
  },

  async update(id, taskData) {
    await delay(400)
    const tasks = loadFromStorage()
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      Id: tasks[index].Id
    }
    tasks[index] = updatedTask
    saveToStorage(tasks)
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(300)
    const tasks = loadFromStorage()
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Task not found')
}
    
    tasks.splice(index, 1)
    saveToStorage(tasks)
    return true
  }
}

// Task Template Management
const TEMPLATE_STORAGE_KEY = 'farmkeeper_task_templates'

const loadTemplatesFromStorage = () => {
  try {
    const data = localStorage.getItem(TEMPLATE_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading templates from storage:', error)
    return []
  }
}

const saveTemplatesToStorage = (templates) => {
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error('Error saving templates to storage:', error)
    throw new Error('Failed to save template data')
  }
}

const getNextTemplateId = (templates) => {
  if (templates.length === 0) return 1
  return Math.max(...templates.map(template => template.Id)) + 1
}

export const templateService = {
  async getAllTemplates() {
    await delay(200)
    const templates = loadTemplatesFromStorage()
    return [...templates]
  },

  async getTemplateById(id) {
    await delay(150)
    const templates = loadTemplatesFromStorage()
    const template = templates.find(t => t.Id === parseInt(id, 10))
    if (!template) {
      throw new Error('Template not found')
    }
    return { ...template }
  },

  async createTemplate(templateData) {
    await delay(300)
    const templates = loadTemplatesFromStorage()
    const newTemplate = {
      ...templateData,
      Id: getNextTemplateId(templates),
      createdAt: new Date().toISOString()
    }
    templates.push(newTemplate)
    saveTemplatesToStorage(templates)
    return { ...newTemplate }
  },

  async updateTemplate(id, templateData) {
    await delay(300)
    const templates = loadTemplatesFromStorage()
    const index = templates.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Template not found')
    }
    
    const updatedTemplate = {
      ...templates[index],
      ...templateData,
      Id: templates[index].Id
    }
    templates[index] = updatedTemplate
    saveTemplatesToStorage(templates)
    return { ...updatedTemplate }
  },

  async deleteTemplate(id) {
    await delay(250)
    const templates = loadTemplatesFromStorage()
    const index = templates.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Template not found')
    }
    
templates.splice(index, 1)
    saveTemplatesToStorage(templates)
    return true
  }
}