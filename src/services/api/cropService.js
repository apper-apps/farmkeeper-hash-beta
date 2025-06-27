export const cropService = {
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
          { field: { "Name": "field" } },
          { field: { "Name": "plantingDate" } },
          { field: { "Name": "expectedHarvest" } },
          { field: { "Name": "status" } },
          { field: { "Name": "notes" } },
          { field: { "Name": "photos" } },
          { field: { "Name": "farmId" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('crop', params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching crops:', error)
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
          { field: { "Name": "field" } },
          { field: { "Name": "plantingDate" } },
          { field: { "Name": "expectedHarvest" } },
          { field: { "Name": "status" } },
          { field: { "Name": "notes" } },
          { field: { "Name": "photos" } },
          { field: { "Name": "farmId" } }
        ]
      }
      
      const response = await apperClient.getRecordById('crop', parseInt(id, 10), params)
      
      if (!response || !response.data) {
        throw new Error('Crop not found')
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching crop:', error)
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
          { field: { "Name": "field" } },
          { field: { "Name": "plantingDate" } },
          { field: { "Name": "expectedHarvest" } },
          { field: { "Name": "status" } },
          { field: { "Name": "notes" } },
          { field: { "Name": "photos" } },
          { field: { "Name": "farmId" } }
        ],
        where: [
          {
            "FieldName": "farmId",
            "Operator": "EqualTo",
            "Values": [parseInt(farmId, 10)]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('crop', params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching crops by farm ID:', error)
      throw error
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const cropRecord = {
        Name: cropData.name || cropData.Name,
        field: cropData.field,
        plantingDate: cropData.plantingDate,
        expectedHarvest: cropData.expectedHarvest,
        status: cropData.status,
        notes: cropData.notes,
        photos: cropData.photos || "",
        farmId: parseInt(cropData.farmId, 10)
      }
      
      const params = {
        records: [cropRecord]
      }
      
      const response = await apperClient.createRecord('crop', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to create crop')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from create operation')
    } catch (error) {
      console.error('Error creating crop:', error)
      throw error
    }
  },

  async update(id, cropData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const cropRecord = {
        Id: parseInt(id, 10),
        Name: cropData.name || cropData.Name,
        field: cropData.field,
        plantingDate: cropData.plantingDate,
        expectedHarvest: cropData.expectedHarvest,
        status: cropData.status,
        notes: cropData.notes,
        photos: cropData.photos || "",
        farmId: parseInt(cropData.farmId, 10)
      }
      
      const params = {
        records: [cropRecord]
      }
      
      const response = await apperClient.updateRecord('crop', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to update crop')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from update operation')
    } catch (error) {
      console.error('Error updating crop:', error)
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
      
      const response = await apperClient.deleteRecord('crop', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error(failedDeletions[0]?.message || 'Failed to delete crop')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error('Error deleting crop:', error)
      throw error
    }
  }
}