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
      setError(err.message || 'Failed to fetch data')
      console.error(`Error fetching ${tableName}:`, err)
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, tableName])

  useEffect(() => {
    // Initial data fetch
    fetchData()

    // Listen for manual refresh events
    const handleRefresh = () => {
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
      // Error already handled in fetchData
    })

    // Cleanup subscription on unmount
    return () => {
      window.removeEventListener('refreshAllData', handleRefresh)
      if (subscription) {
        dataService.unsubscribeFromTable(tableName)
      }
    }
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

// Specific hooks for each data type
export const useUsers = () => useRealTimeData('users', dataService.getUsers)
export const useResidents = () => useRealTimeData('residents', dataService.getResidents)
export const useDocuments = () => useRealTimeData('documents', dataService.getDocuments)
export const useIncidents = () => useRealTimeData('incidents', dataService.getIncidents)
export const useAnnouncements = () => useRealTimeData('announcements', dataService.getAnnouncements)
export const useTransactions = () => useRealTimeData('transactions', dataService.getTransactions)