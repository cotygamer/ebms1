import { useState, useEffect, useCallback } from 'react'
import { dataService } from '../services/dataService'

export function useRealTimeData<T>(
  tableName: string,
  fetchFunction: () => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchFunction()
      setData(result)
      setLastSync(new Date())
    } catch (err: any) {
      // Special handling for missing tables (like incidents)
      if (err.code === 'PGRST205' || err.message?.includes('Could not find the table')) {
        console.warn(`Table ${tableName} not found, using empty data`)
        setData([])
        setLastSync(new Date())
        setError(null) // Clear error since we're handling it gracefully
      } else {
        setError(err.message || 'Failed to fetch data')
        console.error(`Error fetching ${tableName}:`, err)
      }
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, tableName])

  useEffect(() => {
    // Initial data fetch
    fetchData()

    // Debug logging
    console.log(`Setting up real-time data for ${tableName}`)

    // Listen for manual refresh events
    const handleRefresh = () => {
      console.log(`Manual refresh triggered for ${tableName}`)
      fetchData()
    }
    
    window.addEventListener('refreshAllData', handleRefresh)

    // Set up real-time subscription only if initial fetch succeeds
    let subscription: any = null
    
    fetchData().then(() => {
      // Only set up subscription if table exists and data was fetched successfully
      if (!error) {
        subscription = dataService.subscribeToTable(tableName, (payload) => {
          console.log(`Real-time update for ${tableName}:`, payload)
          
          // Update local state based on the change
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              (item as any).id === payload.new.id ? payload.new : item
            ))
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => 
              (item as any).id !== payload.old.id
            ))
          }
          
          setLastSync(new Date())
        })
      }
    }).catch(() => {
        console.error('Error fetching incidents:', error)
        setData([])
      })
  }, [tableName, fetchData])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastSync,
    refresh
  }
}

export function useMessages() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const messages = await dataService.getMessages()
      setData(messages || [])
    } catch (err: any) {
      console.error('Error fetching messages:', err)
      // If table doesn't exist, return empty array instead of throwing
      if (err?.code === 'PGRST205' || err?.message?.includes('Could not find the table')) {
        console.warn('Messages table not found, returning empty array')
        setData([])
        setError(null)
      } else {
        setError(err.message || 'Failed to fetch messages')
        setData([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Set up real-time subscription
    const subscription = dataService.subscribeToTable('messages', (payload) => {
      console.log('Messages real-time update:', payload)
      fetchData() // Refresh data on any change
    })

    return () => {
      if (subscription) {
        dataService.unsubscribeFromTable('messages')
      }
    }
  }, [fetchData])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refresh }
}

// Specific hooks for each data type
export const useUsers = () => useRealTimeData('users', dataService.getUsers)
export const useResidents = () => useRealTimeData('residents', dataService.getResidents)
export const useDocuments = () => useRealTimeData('documents', dataService.getDocuments)
export const useIncidents = () => useRealTimeData('incidents', dataService.getIncidents)
export const useAnnouncements = () => useRealTimeData('announcements', dataService.getAnnouncements)
export const useTransactions = () => useRealTimeData('transactions', dataService.getTransactions)
export const useAppointments = () => useRealTimeData('appointments', dataService.getAppointments)
export const usePatients = () => useRealTimeData('patients', dataService.getPatients)
export const useMedicalRecords = () => useRealTimeData('medical_records', dataService.getMedicalRecords)
export const useInventoryItems = () => useRealTimeData('inventory_items', dataService.getInventoryItems)
export const useProjects = () => useRealTimeData('projects', dataService.getProjects)
export const useBusinessPermits = () => useRealTimeData('business_permits', dataService.getBusinessPermits)