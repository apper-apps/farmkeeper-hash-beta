import React from "react";
import { delay } from "@/services/utils";
import { delay } from "@/services/mockData/crops.json";
import { delay } from "@/services/mockData/tasks.json";
import { delay } from "@/services/mockData/expenses.json";
import { delay } from "@/services/mockData/farms.json";
export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "title" } },
          { field: { "Name": "type" } },
          { field: { "Name": "dueDate" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "farmId" } },
          { field: { "Name": "cropId" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "title" } },
          { field: { "Name": "type" } },
          { field: { "Name": "dueDate" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "farmId" } },
          { field: { "Name": "cropId" } }
        ]
      }
      
      const response = await apperClient.getRecordById('task', parseInt(id, 10), params)
      
      if (!response || !response.data) {
        throw new Error('Task not found')
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching task:', error)
      throw error
    }
  },

  async getByFarmId(farmId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "title" } },
          { field: { "Name": "type" } },
          { field: { "Name": "dueDate" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "farmId" } },
          { field: { "Name": "cropId" } }
        ],
        where: [
          {
            "FieldName": "farmId",
            "Operator": "EqualTo",
            "Values": [parseInt(farmId, 10)]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks by farm ID:', error)
      throw error
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const taskRecord = {
        Name: taskData.title || taskData.Name,
        title: taskData.title,
        type: taskData.type,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: taskData.completed || false,
        farmId: parseInt(taskData.farmId, 10),
        cropId: taskData.cropId ? parseInt(taskData.cropId, 10) : null
      }
      
      const params = {
        records: [taskRecord]
      }
      
      const response = await apperClient.createRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to create task')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from create operation')
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const taskRecord = {
        Id: parseInt(id, 10),
        Name: taskData.title || taskData.Name,
        title: taskData.title,
        type: taskData.type,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: taskData.completed,
        farmId: parseInt(taskData.farmId, 10),
        cropId: taskData.cropId ? parseInt(taskData.cropId, 10) : null
      }
      
      const params = {
        records: [taskRecord]
      }
      
      const response = await apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to update task')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from update operation')
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      }
      
      const response = await apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error(failedDeletions[0]?.message || 'Failed to delete task')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
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