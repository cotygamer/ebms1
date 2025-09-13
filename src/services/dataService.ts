import { supabase } from '../lib/supabase'

// Centralized data service for all modules
export class DataService {
  // Real-time subscriptions for data synchronization
  private static subscriptions: Map<string, any> = new Map()

  // Users Management
  static async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createUser(userData: any) {
    console.log('Creating user with data:', userData);
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    
    // Log the action
    await this.logAction('user.create', 'user', data.id, null, data)
    
    console.log('User created successfully:', data);
    return data
  }

  static async updateUser(id: string, updates: any) {
    // Get current data for audit
    const { data: oldData } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('user.update', 'user', id, oldData, data)
    
    return data
  }

  static async deleteUser(id: string) {
    // Get current data for audit
    const { data: oldData } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Log the action
    await this.logAction('user.delete', 'user', id, oldData, null)
  }

  // Residents Management
  static async getResidents() {
    console.log('DataService - Fetching residents from Supabase...')
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('DataService - Error fetching residents:', error)
      throw error
    }
    
    console.log('DataService - Residents fetched:', data?.length || 0)
    return data
  }

  static async createResident(residentData: any) {
    console.log('Creating resident with data:', residentData);
    
    const { data, error } = await supabase
      .from('residents')
      .insert([{
        ...residentData,
        date_registered: new Date().toISOString().split('T')[0]
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating resident:', error);
      throw new Error(`Failed to create resident: ${error.message}`);
    }
    
    // Log the action
    await this.logAction('resident.create', 'resident', data.id, null, data)
    
    console.log('Resident created successfully:', data);
    return data
  }

  static async updateResident(id: string, updates: any) {
    // Get current data for audit
    const { data: oldData } = await supabase
      .from('residents')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('residents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('resident.update', 'resident', id, oldData, data)
    
    return data
  }

  static async verifyResident(id: string, status: string) {
    // Generate QR code for verified residents
    const qrCode = status === 'verified' ? `BRG_${id}_${Date.now()}` : undefined
    
    return await this.updateResident(id, { 
      verification_status: status,
      qr_code: qrCode
    })
  }

  // Documents Management
  static async getDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        residents (
          name,
          email,
          phone_number
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createDocument(documentData: any) {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        ...documentData,
        requested_date: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('document.create', 'document', data.id, null, data)
    
    return data
  }

  static async updateDocument(id: string, updates: any) {
    // Get current data for audit
    const { data: oldData } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('document.update', 'document', id, oldData, data)
    
    return data
  }

  // Incidents Management
  static async getIncidents() {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createIncident(incidentData: any) {
    const { data, error } = await supabase
      .from('incidents')
      .insert([{
        ...incidentData,
        date_submitted: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('incident.create', 'incident', data.id, null, data)
    
    return data
  }

  static async updateIncident(id: string, updates: any) {
    // Get current data for audit
    const { data: oldData } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('incidents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('incident.update', 'incident', id, oldData, data)
    
    return data
  }

  // Announcements Management
  static async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createAnnouncement(announcementData: any) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcementData])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('announcement.create', 'announcement', data.id, null, data)
    
    return data
  }

  static async updateAnnouncement(id: string, updates: any) {
    // Get current data for audit
    const { data: oldData } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('announcements')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('announcement.update', 'announcement', id, oldData, data)
    
    return data
  }

  // Transactions Management
  static async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createTransaction(transactionData: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        transaction_date: new Date().toISOString().split('T')[0]
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('transaction.create', 'transaction', data.id, null, data)
    
    return data
  }

  // Real-time Subscriptions
  static subscribeToTable(tableName: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(`${tableName}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: tableName },
        callback
      )
      .subscribe()

    this.subscriptions.set(tableName, subscription)
    return subscription
  }

  static unsubscribeFromTable(tableName: string) {
    const subscription = this.subscriptions.get(tableName)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(tableName)
    }
  }

  static unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
    this.subscriptions.clear()
  }

  // Audit Logging
  private static async logAction(
    actionType: string,
    resourceType: string,
    resourceId: string,
    oldValue: any,
    newValue: any
  ) {
    try {
      // Get current user from auth context
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase
        .from('audit_logs')
        .insert([{
          user_id: user?.id,
          action_type: actionType,
          resource_type: resourceType,
          resource_id: resourceId,
          old_value: oldValue,
          new_value: newValue,
          timestamp: new Date().toISOString()
        }])
    } catch (error) {
      console.error('Failed to log action:', error)
    }
  }

  // Data Consistency Checks
  static async validateDataConsistency() {
    const issues = []

    try {
      // Check for orphaned documents (documents without valid residents)
      const { data: orphanedDocs } = await supabase
        .from('documents')
        .select('id, resident_id')
        .not('resident_id', 'in', 
          supabase.from('residents').select('id')
        )

      if (orphanedDocs && orphanedDocs.length > 0) {
        issues.push({
          type: 'orphaned_documents',
          count: orphanedDocs.length,
          details: orphanedDocs
        })
      }

      // Check for incidents without valid reporters
      const { data: orphanedIncidents } = await supabase
        .from('incidents')
        .select('id, reporter_email')
        .not('reporter_email', 'in',
          supabase.from('residents').select('email')
        )

      if (orphanedIncidents && orphanedIncidents.length > 0) {
        issues.push({
          type: 'orphaned_incidents',
          count: orphanedIncidents.length,
          details: orphanedIncidents
        })
      }

      return { valid: issues.length === 0, issues }
    } catch (error) {
      console.error('Data consistency check failed:', error)
      return { valid: false, error: error.message }
    }
  }

  // Sync Status Monitoring
  static async getSyncStatus() {
    try {
      const [users, residents, documents, incidents, announcements, transactions] = await Promise.all([
        this.getUsers(),
        this.getResidents(),
        this.getDocuments(),
        this.getIncidents(),
        this.getAnnouncements(),
        this.getTransactions()
      ])

      return {
        status: 'healthy',
        lastSync: new Date().toISOString(),
        counts: {
          users: users.length,
          residents: residents.length,
          documents: documents.length,
          incidents: incidents.length,
          announcements: announcements.length,
          transactions: transactions.length
        }
      }
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        lastSync: new Date().toISOString()
      }
    }
  }
}

// Export singleton instance
export const dataService = DataService