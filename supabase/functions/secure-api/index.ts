import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3.23.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Schémas de validation Zod
const employeeSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  fonction: z.string().min(2, 'La fonction doit contenir au moins 2 caractères'),
  department: z.string().min(2, 'Le département doit contenir au moins 2 caractères'),
  salary: z.number().min(0, 'Le salaire doit être positif').optional(),
  hourly_rate: z.number().min(0, 'Le taux horaire doit être positif').optional(),
  start_date: z.string().datetime(),
  status: z.enum(['active', 'inactive']).default('active'),
  type: z.enum(['employee', 'consultant']).default('employee'),
  company: z.string().optional(),
})

const projectSchema = z.object({
  name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  budget: z.number().min(0, 'Le budget doit être positif'),
  project_manager: z.string().min(2, 'Le nom du chef de projet est requis'),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
  team: z.array(z.string()).default([]),
  consultants: z.array(z.string()).default([]),
})

const timeEntrySchema = z.object({
  employee_id: z.string().uuid('ID employé invalide'),
  date: z.string().datetime(),
  clock_in: z.string().optional(),
  clock_out: z.string().optional(),
  break_start: z.string().optional(),
  break_end: z.string().optional(),
  total_hours: z.number().min(0).max(24, 'Maximum 24h par jour').optional(),
  notes: z.string().optional(),
})

// Rate limiting
async function checkRateLimit(
  supabase: any,
  identifier: string,
  action: string,
  limit: number = 100,
  windowMinutes: number = 60
): Promise<boolean> {
  const windowStart = new Date()
  windowStart.setMinutes(windowStart.getMinutes() - windowMinutes)

  // Nettoyer les anciens enregistrements
  await supabase
    .from('rate_limits')
    .delete()
    .lt('window_start', windowStart.toISOString())

  // Vérifier le taux actuel
  const { data: currentLimits } = await supabase
    .from('rate_limits')
    .select('count')
    .eq('identifier', identifier)
    .eq('action', action)
    .gte('window_start', windowStart.toISOString())

  const currentCount = currentLimits?.reduce((sum: number, record: any) => sum + record.count, 0) || 0

  if (currentCount >= limit) {
    return false
  }

  // Enregistrer cette requête
  await supabase
    .from('rate_limits')
    .upsert({
      identifier,
      action,
      count: 1,
      window_start: new Date().toISOString()
    }, {
      onConflict: 'identifier,action,window_start',
      ignoreDuplicates: false
    })

  return true
}

// Audit trail
async function logAuditTrail(
  supabase: any,
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string,
  success: boolean = true,
  errorMessage?: string
) {
  await supabase
    .from('audit_logs')
    .insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: ipAddress,
      user_agent: userAgent,
      success,
      error_message: errorMessage
    })
}

// Chiffrement des données sensibles (simple hachage pour l'exemple)
function hashSensitiveData(data: string): string {
  return btoa(data) // Base64 simple - en production, utiliser un vrai chiffrement
}

function decryptSensitiveData(hashedData: string): string {
  return atob(hashedData) // Décodage Base64 - en production, utiliser un vrai déchiffrement
}

Deno.serve(async (req) => {
  // Gérer les requêtes CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    const method = req.method

    // Obtenir l'IP et user agent pour l'audit
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Obtenir l'utilisateur actuel
    const authHeader = req.headers.get('Authorization')
    let currentUser = null
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      )
      currentUser = user
    }

    const userId = currentUser?.id || null
    const identifier = userId || ipAddress

    // Vérifier le rate limiting
    const rateLimitPassed = await checkRateLimit(
      supabaseClient,
      identifier,
      `${method}_${path}`,
      100, // 100 requêtes par heure
      60
    )

    if (!rateLimitPassed) {
      await logAuditTrail(
        supabaseClient,
        userId,
        'RATE_LIMIT_EXCEEDED',
        'api',
        path,
        null,
        null,
        ipAddress,
        userAgent,
        false,
        'Rate limit exceeded'
      )

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let result
    let auditAction = ''
    let resourceType = ''
    let oldValues = null
    let newValues = null
    let resourceId = ''

    switch (`${method}_${path}`) {
      case 'POST_employees':
        auditAction = 'CREATE_EMPLOYEE'
        resourceType = 'employee'
        
        const employeeData = await req.json()
        const validatedEmployee = employeeSchema.parse(employeeData)
        
        // Chiffrer les données sensibles
        if (validatedEmployee.salary) {
          validatedEmployee.salary = Number(hashSensitiveData(validatedEmployee.salary.toString()))
        }
        
        result = await supabaseClient
          .from('employees')
          .insert(validatedEmployee)
          .select()
          .single()
        
        newValues = validatedEmployee
        resourceId = result.data?.id
        break

      case 'PUT_employees':
        auditAction = 'UPDATE_EMPLOYEE'
        resourceType = 'employee'
        
        const updateData = await req.json()
        const { id, ...updateFields } = updateData
        const validatedUpdate = employeeSchema.partial().parse(updateFields)
        
        // Obtenir les anciennes valeurs
        const { data: oldEmployee } = await supabaseClient
          .from('employees')
          .select('*')
          .eq('id', id)
          .single()
        oldValues = oldEmployee
        
        result = await supabaseClient
          .from('employees')
          .update(validatedUpdate)
          .eq('id', id)
          .select()
          .single()
        
        newValues = validatedUpdate
        resourceId = id
        break

      case 'POST_projects':
        auditAction = 'CREATE_PROJECT'
        resourceType = 'project'
        
        const projectData = await req.json()
        const validatedProject = projectSchema.parse(projectData)
        
        result = await supabaseClient
          .from('projects')
          .insert(validatedProject)
          .select()
          .single()
        
        newValues = validatedProject
        resourceId = result.data?.id
        break

      case 'POST_time_entries':
        auditAction = 'CREATE_TIME_ENTRY'
        resourceType = 'time_entry'
        
        const timeEntryData = await req.json()
        const validatedTimeEntry = timeEntrySchema.parse(timeEntryData)
        
        result = await supabaseClient
          .from('time_entries')
          .insert(validatedTimeEntry)
          .select()
          .single()
        
        newValues = validatedTimeEntry
        resourceId = result.data?.id
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    // Logger l'audit trail
    await logAuditTrail(
      supabaseClient,
      userId,
      auditAction,
      resourceType,
      resourceId,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
      !result.error,
      result.error?.message
    )

    if (result.error) {
      console.error(`${auditAction} error:`, result.error)
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(result.data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Security API error:', error)
    
    // Logger l'erreur
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation error', 
          details: error.errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})