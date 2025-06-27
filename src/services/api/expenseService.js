export const expenseService = {
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
          { field: { "Name": "category" } },
          { field: { "Name": "amount" } },
          { field: { "Name": "date" } },
          { field: { "Name": "description" } },
          { field: { "Name": "vendor" } },
          { field: { "Name": "farmId" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('expense', params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching expenses:', error)
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
          { field: { "Name": "category" } },
          { field: { "Name": "amount" } },
          { field: { "Name": "date" } },
          { field: { "Name": "description" } },
          { field: { "Name": "vendor" } },
          { field: { "Name": "farmId" } }
        ]
      }
      
      const response = await apperClient.getRecordById('expense', parseInt(id, 10), params)
      
      if (!response || !response.data) {
        throw new Error('Expense not found')
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching expense:', error)
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
          { field: { "Name": "category" } },
          { field: { "Name": "amount" } },
          { field: { "Name": "date" } },
          { field: { "Name": "description" } },
          { field: { "Name": "vendor" } },
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
      
      const response = await apperClient.fetchRecords('expense', params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching expenses by farm ID:', error)
      throw error
    }
  },

  async create(expenseData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const expenseRecord = {
        Name: expenseData.description || expenseData.Name,
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        description: expenseData.description,
        vendor: expenseData.vendor,
        farmId: parseInt(expenseData.farmId, 10)
      }
      
      const params = {
        records: [expenseRecord]
      }
      
      const response = await apperClient.createRecord('expense', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to create expense')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from create operation')
    } catch (error) {
      console.error('Error creating expense:', error)
      throw error
    }
  },

  async update(id, expenseData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const expenseRecord = {
        Id: parseInt(id, 10),
        Name: expenseData.description || expenseData.Name,
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        description: expenseData.description,
        vendor: expenseData.vendor,
        farmId: parseInt(expenseData.farmId, 10)
      }
      
      const params = {
        records: [expenseRecord]
      }
      
      const response = await apperClient.updateRecord('expense', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0]?.message || 'Failed to update expense')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('No data returned from update operation')
    } catch (error) {
      console.error('Error updating expense:', error)
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
      
      const response = await apperClient.deleteRecord('expense', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error(failedDeletions[0]?.message || 'Failed to delete expense')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error('Error deleting expense:', error)
      throw error
    }
  }
}