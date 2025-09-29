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
        user_id: residentData.user_id,
        name: residentData.name,
        email: residentData.email,
        phone_number: residentData.phone_number,
        address: residentData.address,
        verification_status: residentData.verification_status || 'non-verified',
        birth_date: residentData.birth_date,
        gender: residentData.gender,
        civil_status: residentData.civil_status,
        emergency_contact: residentData.emergency_contact,
        nationality: residentData.nationality || 'Filipino',
        religion: residentData.religion,
        occupation: residentData.occupation,
        monthly_income: residentData.monthly_income,
        date_registered: residentData.date_registered || new Date().toISOString().split('T')[0],
        government_ids: residentData.government_ids || {},
        profile_data: residentData.profile_data || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating resident:', error);
      
      // Provide more specific error messages
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        throw new Error('Registration permission error. Please ensure you are logged in properly and try again.');
      } else if (error.code === '23505') {
        throw new Error('An account with this email already exists.');
      } else {
        throw new Error(`Registration failed: ${error.message}`);
      }
    }
    
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
    // Generate permanent QR code based on resident ID and registration date
    let qrCode = undefined;
    if (status === 'verified' || status === 'semi-verified') {
      // Get the resident's registration date for permanent QR code
      const { data: resident } = await supabase
        .from('residents')
        .select('date_registered')
        .eq('id', id)
        .single();
      
      const dateCode = resident?.date_registered?.replace(/-/g, '') || new Date().toISOString().split('T')[0].replace(/-/g, '');
      qrCode = `BRG_${id}_${dateCode}`;
    }
    
    return await this.updateResident(id, { 
      verification_status: status,
      qr_code: qrCode
    })
  }

  // Appointments Management
  static async getAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        residents (
          name,
          email,
          phone_number
        )
      `)
      .order('appointment_date', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async createAppointment(appointmentData: any) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('appointment.create', 'appointment', data.id, null, data)
    
    return data
  }

  static async updateAppointment(id: string, updates: any) {
    const { data: oldData } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('appointment.update', 'appointment', id, oldData, data)
    
    return data
  }

  // Patients Management
  static async getPatients() {
    const { data, error } = await supabase
      .from('patients')
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

  static async createPatient(patientData: any) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('patient.create', 'patient', data.id, null, data)
    
    return data
  }

  static async updatePatient(id: string, updates: any) {
    const { data: oldData } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('patients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('patient.update', 'patient', id, oldData, data)
    
    return data
  }

  // Medical Records Management
  static async getMedicalRecords() {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        patients (
          name,
          age,
          gender,
          contact_number
        )
      `)
      .order('visit_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createMedicalRecord(recordData: any) {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([recordData])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('medical_record.create', 'medical_record', data.id, null, data)
    
    return data
  }

  // Inventory Management
  static async getInventoryItems() {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async createInventoryItem(itemData: any) {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([itemData])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('inventory.create', 'inventory_item', data.id, null, data)
    
    return data
  }

  static async updateInventoryItem(id: string, updates: any) {
    const { data: oldData } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('inventory_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('inventory.update', 'inventory_item', id, oldData, data)
    
    return data
  }

  // Projects Management
  static async getProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_achievements (
            id,
            achievement,
            date_achieved,
            description
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        // Handle missing table gracefully
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('relation') && error.message?.includes('does not exist')) {
          console.warn('Projects table not found, returning empty array')
          return []
        }
        throw error
      }
      return data || []
    } catch (error) {
      // Handle network errors and other issues
      if (error?.name === 'TypeError' && error?.message?.includes('Failed to fetch')) {
        console.warn('Network error fetching projects, returning empty array')
        return []
      }
      console.error('Error fetching projects:', error)
      return []
    }
  }

  static async getProjects_old() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_achievements (
          id,
          achievement,
          date_achieved,
          description
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createProject(projectData: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('project.create', 'project', data.id, null, data)
    
    return data
  }

  static async updateProject(id: string, updates: any) {
    const { data: oldData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('project.update', 'project', id, oldData, data)
    
    return data
  }

  // Business Permits Management
  static async getBusinessPermits() {
    const { data, error } = await supabase
      .from('business_permits')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createBusinessPermit(permitData: any) {
    const { data, error } = await supabase
      .from('business_permits')
      .insert([permitData])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('business_permit.create', 'business_permit', data.id, null, data)
    
    return data
  }

  static async updateBusinessPermit(id: string, updates: any) {
    const { data: oldData } = await supabase
      .from('business_permits')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('business_permits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('business_permit.update', 'business_permit', id, oldData, data)
    
    return data
  }

  // System Settings Management
  static async getSystemSettings() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
    
    if (error) throw error
    
    // Convert to key-value object
    const settings: any = {}
    data?.forEach(setting => {
      settings[setting.key] = setting.value
    })
    
    return settings
  }

  static async updateSystemSetting(key: string, value: any) {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert([{
        key,
        value,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('system_setting.update', 'system_setting', key, null, { key, value })
    
    return data
  }

  static async updateMultipleSystemSettings(settings: Record<string, any>) {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('system_settings')
      .upsert(updates, { onConflict: 'key' })
      .select()
    
    if (error) throw error
    
    // Log the action
    await this.logAction('system_settings.bulk_update', 'system_settings', 'bulk', null, settings)
    
    return data
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
    try {
      console.log('Fetching incidents from Supabase...');
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching incidents:', error);
        throw error
      }
      console.log('Incidents fetched successfully:', data?.length || 0);
      return data || []
    } catch (error) {
      // Check if it's a table not found error
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
        console.warn('Incidents table not found, returning empty array')
        return []
      }
      console.error('Error fetching incidents:', error)
      return []
    }
  }

  static async createIncident(incidentData: any) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert([{
          ...incidentData,
          date_submitted: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      
      // Log the action
      try {
        await this.logAction('incident.create', 'incident', data.id, null, data)
      } catch (logError) {
        console.warn('Failed to log incident creation:', logError)
      }
      
      return data
    } catch (error) {
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
        console.warn('Incidents table not found, cannot create incident')
        throw new Error('Incident reporting is temporarily unavailable. Please contact the barangay office.')
      }
      throw error
    }
  }

  static async updateIncident(id: string, updates: any) {
    try {
      // Get current data for audit
      const { data: oldData } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single()

      const { data, error } = await supabase
        .from('incidents')
        .update({ 
          status: updates.status,
          assigned_to: updates.assignedTo || updates.assigned_to,
          resolution: updates.resolution,
          priority: updates.priority,
          evidence_files: updates.evidenceFiles || updates.evidence_files,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Log the action
      await this.logAction('incident.update', 'incident', id, oldData, data)
      
      return data
    } catch (error) {
      console.error('Error updating incident:', error)
      throw error
    }
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

  // Resident-specific data fetching methods
  static async getDocumentsByResident(residentId: string) {
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
      .eq('resident_id', residentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getAppointmentsByResident(residentEmail: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        residents (
          name,
          email,
          phone_number
        )
      `)
      .eq('resident_email', residentEmail)
      .order('appointment_date', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async getIncidentsByReporter(reporterEmail: string) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('reporter_email', reporterEmail)
        .order('created_at', { ascending: false })
      
      if (error) {
        // Handle case where incidents table might not exist
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.warn('Incidents table not found, returning empty array')
          return []
        }
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error fetching incidents by reporter:', error)
      return []
    }
  }

  static async getFamilyMembersByResident(residentId: string) {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('resident_id', residentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
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
      
      // Check if the authenticated user exists in the users table
      let validUserId = null
      if (user?.id) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .limit(1)
        
        // Only use user_id if it exists in the users table
        if (existingUser && existingUser.length > 0) {
          validUserId = user.id
        }
      }
      
      await supabase
        .from('audit_logs')
        .insert([{
          user_id: validUserId,
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