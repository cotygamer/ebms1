import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface DemoUser {
  email: string
  password: string
  name: string
  role: string
}

const demoUsers: DemoUser[] = [
  {
    email: 'superadmin@barangay.gov',
    password: 'password123',
    name: 'Super Administrator',
    role: 'super-admin'
  },
  {
    email: 'official@barangay.gov',
    password: 'password123',
    name: 'Barangay Official',
    role: 'barangay-official'
  },
  {
    email: 'medical@barangay.gov',
    password: 'password123',
    name: 'Medical Staff',
    role: 'medical-portal'
  },
  {
    email: 'accounting@barangay.gov',
    password: 'password123',
    name: 'Accounting Staff',
    role: 'accounting-portal'
  },
  {
    email: 'disaster@barangay.gov',
    password: 'password123',
    name: 'Disaster Management',
    role: 'disaster-portal'
  },
  {
    email: 'peaceorder@barangay.gov',
    password: 'password123',
    name: 'Peace & Order Officer',
    role: 'peace-order-portal'
  },
  {
    email: 'resident@email.com',
    password: 'password123',
    name: 'Demo Resident',
    role: 'resident'
  }
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const results = []

    for (const user of demoUsers) {
      try {
        console.log(`Creating user: ${user.email}`)
        
        // First, try to delete existing user if it exists
        try {
          const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(user.email)
          if (existingUser.user) {
            await supabaseAdmin.auth.admin.deleteUser(existingUser.user.id)
            console.log(`Deleted existing user: ${user.email}`)
          }
        } catch (deleteError) {
          // User doesn't exist, which is fine
          console.log(`No existing user to delete: ${user.email}`)
        }

        // Create auth user with email confirmation disabled
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.name,
            role: user.role
          }
        })

        if (authError) {
          console.error(`Auth error for ${user.email}:`, authError)
          results.push({ email: user.email, status: 'auth_error', error: authError.message })
          continue
        }

        console.log(`Auth user created for ${user.email}`)

        // Create/update user record in users table (for staff/admin users)
        if (user.role !== 'resident') {
          const { error: dbError } = await supabaseAdmin
            .from('users')
            .upsert({
              id: authData.user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              status: 'active',
              permissions: getDefaultPermissions(user.role),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'email'
            })

          if (dbError) {
            console.error(`DB error for ${user.email}:`, dbError)
            results.push({ email: user.email, status: 'db_error', error: dbError.message })
            continue
          }
          console.log(`User record created in users table for ${user.email}`)
        }

        // If resident, create resident record
        if (user.role === 'resident') {
          const { error: residentError } = await supabaseAdmin
            .from('residents')
            .upsert({
              id: authData.user.id,
              user_id: authData.user.id,
              email: user.email,
              name: user.name,
              phone_number: '09123456789',
              address: 'Demo Address, Purok 1, Barangay San Miguel, Metro Manila',
              verification_status: 'verified',
              qr_code: `BRG_${authData.user.id}_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
              date_registered: new Date().toISOString().split('T')[0],
              nationality: 'Filipino',
              gender: 'male',
              civil_status: 'single',
              occupation: 'Demo Occupation',
              emergency_contact: 'Demo Emergency Contact - 09123456789 (Relative)',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'email'
            })

          if (residentError) {
            console.error(`Resident error for ${user.email}:`, residentError)
            results.push({ email: user.email, status: 'resident_error', error: residentError.message })
            continue
          }
          console.log(`Resident record created for ${user.email}`)
        }

        results.push({ email: user.email, status: 'success', role: user.role })
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error)
        results.push({ email: user.email, status: 'error', error: error.message })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Demo users setup completed',
        results,
        summary: {
          total: demoUsers.length,
          successful: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status !== 'success').length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to setup demo users. Please check Supabase configuration.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

function getDefaultPermissions(role: string): string[] {
  switch (role) {
    case 'super-admin':
      return ['all']
    case 'barangay-official':
      return ['residents', 'documents', 'reports', 'announcements']
    case 'medical-portal':
      return ['health', 'medical-records', 'appointments']
    case 'accounting-portal':
      return ['accounting', 'financial-reports', 'payments']
    case 'disaster-portal':
      return ['disaster-management', 'emergency-alerts', 'evacuation']
    case 'peace-order-portal':
      return ['peace-order', 'incident-management', 'crime-prevention']
    default:
      return ['basic']
  }
}