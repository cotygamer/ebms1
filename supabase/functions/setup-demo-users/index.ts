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
        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true
        })

        if (authError && !authError.message.includes('already registered')) {
          console.error(`Auth error for ${user.email}:`, authError)
          results.push({ email: user.email, status: 'auth_error', error: authError.message })
          continue
        }

        // Create/update user record in users table
        const { error: dbError } = await supabaseAdmin
          .from('users')
          .upsert({
            email: user.email,
            name: user.name,
            role: user.role,
            status: 'active'
          }, {
            onConflict: 'email'
          })

        if (dbError) {
          console.error(`DB error for ${user.email}:`, dbError)
          results.push({ email: user.email, status: 'db_error', error: dbError.message })
          continue
        }

        // If resident, also create resident record
        if (user.role === 'resident') {
          const { error: residentError } = await supabaseAdmin
            .from('residents')
            .upsert({
              email: user.email,
              name: user.name,
              phone_number: '09123456789',
              address: 'Demo Address',
              verification_status: 'verified'
            }, {
              onConflict: 'email'
            })

          if (residentError) {
            console.error(`Resident error for ${user.email}:`, residentError)
          }
        }

        results.push({ email: user.email, status: 'success' })
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error)
        results.push({ email: user.email, status: 'error', error: error.message })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Demo users setup completed',
        results 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})