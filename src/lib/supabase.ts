import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          status: string
          permissions: any[]
          phone_number?: string
          address?: string
          password_hash?: string
          last_login?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          name: string
          role: string
          status?: string
          permissions?: any[]
          phone_number?: string
          address?: string
          password_hash?: string
        }
        Update: {
          email?: string
          name?: string
          role?: string
          status?: string
          permissions?: any[]
          phone_number?: string
          address?: string
          password_hash?: string
          last_login?: string
        }
      }
      residents: {
        Row: {
          id: string
          user_id?: string
          name: string
          email: string
          phone_number: string
          address: string
          verification_status: string
          qr_code?: string
          date_registered: string
          emergency_contact?: string
          birth_date?: string
          gender?: string
          civil_status?: string
          nationality?: string
          religion?: string
          occupation?: string
          monthly_income?: string
          house_location?: any
          government_ids?: any
          profile_data?: any
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id?: string
          name: string
          email: string
          phone_number: string
          address: string
          verification_status?: string
          qr_code?: string
          date_registered?: string
          emergency_contact?: string
          birth_date?: string
          gender?: string
          civil_status?: string
          nationality?: string
          religion?: string
          occupation?: string
          monthly_income?: string
          house_location?: any
          government_ids?: any
          profile_data?: any
        }
        Update: {
          user_id?: string
          name?: string
          email?: string
          phone_number?: string
          address?: string
          verification_status?: string
          qr_code?: string
          emergency_contact?: string
          birth_date?: string
          gender?: string
          civil_status?: string
          nationality?: string
          religion?: string
          occupation?: string
          monthly_income?: string
          house_location?: any
          government_ids?: any
          profile_data?: any
        }
      }
      documents: {
        Row: {
          id: string
          resident_id: string
          document_type: string
          status: string
          requested_date: string
          processed_date?: string
          released_date?: string
          fee: number
          payment_status: string
          payment_method?: string
          notes?: string
          purpose?: string
          tracking_number?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          resident_id: string
          document_type: string
          status?: string
          fee?: number
          payment_status?: string
          payment_method?: string
          notes?: string
          purpose?: string
          tracking_number?: string
        }
        Update: {
          status?: string
          processed_date?: string
          released_date?: string
          payment_status?: string
          payment_method?: string
          notes?: string
          tracking_number?: string
        }
      }
      incidents: {
        Row: {
          id: string
          reporter_name: string
          reporter_email: string
          reporter_phone?: string
          incident_type: string
          subject: string
          description: string
          status: string
          priority: string
          location?: string
          date_occurred?: string
          time_occurred?: string
          witness_name?: string
          witness_contact?: string
          assigned_to?: string
          resolution?: string
          date_submitted: string
          evidence_files?: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          reporter_name: string
          reporter_email: string
          reporter_phone?: string
          incident_type: string
          subject: string
          description: string
          status?: string
          priority?: string
          location?: string
          date_occurred?: string
          time_occurred?: string
          witness_name?: string
          witness_contact?: string
          assigned_to?: string
          evidence_files?: any[]
        }
        Update: {
          status?: string
          assigned_to?: string
          resolution?: string
          evidence_files?: any[]
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: string
          priority: string
          status: string
          author: string
          target_audience?: string
          expires_at?: string
          image_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          content: string
          type: string
          priority?: string
          status?: string
          author: string
          target_audience?: string
          expires_at?: string
          image_url?: string
        }
        Update: {
          title?: string
          content?: string
          type?: string
          priority?: string
          status?: string
          target_audience?: string
          expires_at?: string
          image_url?: string
        }
      }
      appointments: {
        Row: {
          id: string
          resident_id?: string
          resident_name: string
          resident_email?: string
          resident_phone?: string
          service: string
          service_type: string
          appointment_date: string
          appointment_time: string
          status: string
          notes?: string
          assigned_staff?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          resident_id?: string
          resident_name: string
          resident_email?: string
          resident_phone?: string
          service: string
          service_type: string
          appointment_date: string
          appointment_time: string
          status?: string
          notes?: string
          assigned_staff?: string
        }
        Update: {
          status?: string
          notes?: string
          assigned_staff?: string
        }
      }
      patients: {
        Row: {
          id: string
          resident_id?: string
          name: string
          age: number
          gender: string
          contact_number: string
          address: string
          medical_history?: string
          allergies?: string
          emergency_contact: string
          blood_type?: string
          height_cm?: number
          weight_kg?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          resident_id?: string
          name: string
          age: number
          gender: string
          contact_number: string
          address: string
          medical_history?: string
          allergies?: string
          emergency_contact: string
          blood_type?: string
          height_cm?: number
          weight_kg?: number
        }
        Update: {
          medical_history?: string
          allergies?: string
          emergency_contact?: string
          blood_type?: string
          height_cm?: number
          weight_kg?: number
        }
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string
          visit_date: string
          diagnosis: string
          treatment: string
          prescription?: string
          doctor_notes?: string
          vital_signs?: any
          follow_up_date?: string
          attending_physician?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          patient_id: string
          visit_date?: string
          diagnosis: string
          treatment: string
          prescription?: string
          doctor_notes?: string
          vital_signs?: any
          follow_up_date?: string
          attending_physician?: string
        }
        Update: {
          diagnosis?: string
          treatment?: string
          prescription?: string
          doctor_notes?: string
          vital_signs?: any
          follow_up_date?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          current_stock: number
          minimum_stock: number
          unit: string
          cost_per_unit: number
          supplier?: string
          expiry_date?: string
          batch_number?: string
          location?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          category: string
          current_stock?: number
          minimum_stock?: number
          unit: string
          cost_per_unit?: number
          supplier?: string
          expiry_date?: string
          batch_number?: string
          location?: string
        }
        Update: {
          current_stock?: number
          minimum_stock?: number
          cost_per_unit?: number
          supplier?: string
          expiry_date?: string
          batch_number?: string
          location?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          status: string
          start_date: string
          end_date?: string
          budget: number
          location: string
          beneficiaries: number
          image_url?: string
          project_manager?: string
          completion_percentage?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description: string
          category: string
          status?: string
          start_date: string
          end_date?: string
          budget: number
          location: string
          beneficiaries: number
          image_url?: string
          project_manager?: string
          completion_percentage?: number
        }
        Update: {
          status?: string
          end_date?: string
          completion_percentage?: number
          project_manager?: string
        }
      }
      business_permits: {
        Row: {
          id: string
          business_name: string
          owner_name: string
          owner_email: string
          business_type: string
          address: string
          contact_info?: any
          permit_type: string
          application_status: string
          documents?: any[]
          fees?: any
          payment_status: string
          approval_date?: string
          expiry_date?: string
          permit_number?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          business_name: string
          owner_name: string
          owner_email: string
          business_type: string
          address: string
          contact_info?: any
          permit_type?: string
          application_status?: string
          documents?: any[]
          fees?: any
          payment_status?: string
          notes?: string
        }
        Update: {
          application_status?: string
          payment_status?: string
          approval_date?: string
          expiry_date?: string
          permit_number?: string
          notes?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: string
          description: string
          amount: number
          category: string
          payment_method: string
          reference_number?: string
          transaction_date: string
          document_id?: string
          processed_by?: string
          approved_by?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          type: string
          description: string
          amount: number
          category: string
          payment_method: string
          reference_number?: string
          transaction_date?: string
          document_id?: string
          processed_by?: string
          approved_by?: string
        }
        Update: {
          type?: string
          description?: string
          amount?: number
          category?: string
          payment_method?: string
          reference_number?: string
          processed_by?: string
          approved_by?: string
        }
      }
    }
    messages: {
      Row: {
        id: string
        sender_name: string
        sender_email: string
        sender_phone?: string
        subject: string
        message: string
        category: string
        priority: string
        status: string
        source: string
        replied_at?: string
        replied_by?: string
        reply?: string
        created_at: string
        updated_at: string
      }
      Insert: {
        sender_name: string
        sender_email: string
        sender_phone?: string
        subject: string
        message: string
        category?: string
        priority?: string
        status?: string
        source?: string
        replied_at?: string
        replied_by?: string
        reply?: string
      }
      Update: {
        status?: string
        replied_at?: string
        replied_by?: string
        reply?: string
      }
    }
    messages: {
      Row: {
        id: string
        sender_name: string
        sender_email: string
        sender_phone?: string
        subject: string
        message: string
        category: string
        priority: string
        status: string
        source: string
        replied_at?: string
        replied_by?: string
        reply?: string
        created_at: string
        updated_at: string
      }
      Insert: {
        sender_name: string
        sender_email: string
        sender_phone?: string
        subject: string
        message: string
        category?: string
        priority?: string
        status?: string
        source?: string
        replied_at?: string
        replied_by?: string
        reply?: string
      }
      Update: {
        status?: string
        replied_at?: string
        replied_by?: string
        reply?: string
      }
    }
  }
}