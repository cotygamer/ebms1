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
        }
        Update: {
          email?: string
          name?: string
          role?: string
          status?: string
          permissions?: any[]
          phone_number?: string
          address?: string
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
        }
        Update: {
          status?: string
          processed_date?: string
          released_date?: string
          payment_status?: string
          payment_method?: string
          notes?: string
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
        }
        Update: {
          status?: string
          assigned_to?: string
          resolution?: string
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
          expires_at?: string
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
          expires_at?: string
        }
        Update: {
          title?: string
          content?: string
          type?: string
          priority?: string
          status?: string
          expires_at?: string
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
        }
        Update: {
          type?: string
          description?: string
          amount?: number
          category?: string
          payment_method?: string
          reference_number?: string
        }
      }
    }
  }
}