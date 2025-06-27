export const farmService = {
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
          { field: { "Name": "location" } },
          { field: { "Name": "size" } },
          { field: { "Name": "unit" } },
          { field: { "Name": "createdAt" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('farm', params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching farms:', error)
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
          { field: { "Name": "location" } },
          { field: { "Name": "size" } },
          { field: { "Name": "unit" } },
          { field: { "Name": "createdAt" } }
        ]
      }
      
      const response = await apperClient.getRecordById('farm', parseInt(id, 10), params)
      
      if (!response || !response.data) {
        throw new Error('Farm not found')
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching farm:', error)
      throw error
    }
  },

  async create(farmData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const farmRecord = {
        Name: farmData.name || farmData.Name,
        location: farmData.location,
        size: farmData.size,
        unit: farmData.unit,
        createdAt: new Date().toISOString()
      }
      
      const params = {
        records: [farmRecord]
      }
      
      const response = await apperClient.createRecord('farm', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to create farm')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from create operation')
    } catch (error) {
      console.error('Error creating farm:', error)
      throw error
    }
  },

  async update(id, farmData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const farmRecord = {
        Id: parseInt(id, 10),
        Name: farmData.name || farmData.Name,
        location: farmData.location,
        size: farmData.size,
        unit: farmData.unit
      }
      
      const params = {
        records: [farmRecord]
      }
      
      const response = await apperClient.updateRecord('farm', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to update farm')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from update operation')
    } catch (error) {
      console.error('Error updating farm:', error)
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
      
      const response = await apperClient.deleteRecord('farm', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error(failedDeletions[0]?.message || 'Failed to delete farm')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error('Error deleting farm:', error)
      throw error
    }
  }
}