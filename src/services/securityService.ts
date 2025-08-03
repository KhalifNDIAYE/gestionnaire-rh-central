import { supabase } from '@/integrations/supabase/client'
import { z } from 'zod'

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  old_values: any
  new_values: any
  ip_address: string | null
  user_agent: string | null
  success: boolean
  error_message: string | null
  created_at: string
}

export interface SecurityMetrics {
  totalLogs: number
  failedAttempts: number
  uniqueUsers: number
  topActions: { action: string; count: number }[]
  recentActivity: AuditLog[]
}

// Schémas de validation côté client
export const clientValidationSchemas = {
  employee: z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    fonction: z.string().min(2, 'La fonction doit contenir au moins 2 caractères'),
    department: z.string().min(2, 'Le département doit contenir au moins 2 caractères'),
    salary: z.number().min(0, 'Le salaire doit être positif').optional(),
    hourly_rate: z.number().min(0, 'Le taux horaire doit être positif').optional(),
    start_date: z.string(),
    status: z.enum(['active', 'inactive']).default('active'),
    type: z.enum(['employee', 'consultant']).default('employee'),
    company: z.string().optional(),
  }),

  project: z.object({
    name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères'),
    description: z.string().optional(),
    start_date: z.string(),
    end_date: z.string(),
    budget: z.number().min(0, 'Le budget doit être positif'),
    project_manager: z.string().min(2, 'Le nom du chef de projet est requis'),
    status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
    team: z.array(z.string()).default([]),
    consultants: z.array(z.string()).default([]),
  }),

  timeEntry: z.object({
    employee_id: z.string().uuid('ID employé invalide'),
    date: z.string(),
    clock_in: z.string().optional(),
    clock_out: z.string().optional(),
    break_start: z.string().optional(),
    break_end: z.string().optional(),
    total_hours: z.number().min(0).max(24, 'Maximum 24h par jour').optional(),
    notes: z.string().optional(),
  }),
}

class SecurityService {
  // Validation côté client
  validateData(schema: keyof typeof clientValidationSchemas, data: any) {
    try {
      return clientValidationSchemas[schema].parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Erreur de validation: ${error.issues.map(e => e.message).join(', ')}`)
      }
      throw error
    }
  }

  // Appel sécurisé à l'API avec validation
  async secureApiCall(endpoint: string, data: any, method: 'POST' | 'PUT' | 'DELETE' = 'POST') {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Session non valide')
      }

      const response = await supabase.functions.invoke('secure-api', {
        body: { ...data, _endpoint: endpoint, _method: method },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      return response.data
    } catch (error) {
      console.error('Secure API call failed:', error)
      throw error
    }
  }

  // Récupérer les logs d'audit pour l'utilisateur actuel
  async getUserAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Erreur lors de la récupération des logs: ${error.message}`)
    }

    return (data || []) as AuditLog[]
  }

  // Récupérer les métriques de sécurité (pour les admins)
  async getSecurityMetrics(startDate?: string, endDate?: string): Promise<SecurityMetrics> {
    let query = supabase
      .from('audit_logs')
      .select('*')

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: logs, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erreur lors de la récupération des métriques: ${error.message}`)
    }

    const totalLogs = logs?.length || 0
    const failedAttempts = logs?.filter(log => !log.success).length || 0
    const uniqueUsers = new Set(logs?.map(log => log.user_id).filter(Boolean)).size
    
    // Top actions
    const actionCounts = logs?.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalLogs,
      failedAttempts,
      uniqueUsers,
      topActions,
      recentActivity: (logs?.slice(0, 20) || []) as AuditLog[],
    }
  }

  // Gérer les sessions utilisateur
  async createSecureSession(ipAddress?: string, userAgent?: string) {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      throw new Error('Session invalide')
    }

    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Session de 24h

    const { error: insertError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: session.user.id,
        session_token: sessionToken,
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      throw new Error(`Erreur lors de la création de session: ${insertError.message}`)
    }

    return sessionToken
  }

  // Invalider toutes les sessions utilisateur
  async invalidateUserSessions(userId?: string) {
    const { data: { session } } = await supabase.auth.getSession()
    const targetUserId = userId || session?.user?.id

    if (!targetUserId) {
      throw new Error('ID utilisateur requis')
    }

    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', targetUserId)

    if (error) {
      throw new Error(`Erreur lors de l'invalidation des sessions: ${error.message}`)
    }
  }

  // Chiffrement simple côté client (pour les données non-sensibles)
  encryptClientData(data: string): string {
    return btoa(data) // Base64 simple - en production, utiliser crypto-js
  }

  decryptClientData(encryptedData: string): string {
    try {
      return atob(encryptedData)
    } catch {
      throw new Error('Données chiffrées invalides')
    }
  }

  // Nettoyer les sessions expirées (à appeler périodiquement)
  async cleanupExpiredSessions() {
    const { error } = await supabase.functions.invoke('cleanup-sessions')
    
    if (error) {
      console.warn('Erreur lors du nettoyage des sessions:', error)
    }
  }

  // Vérifier la force du mot de passe
  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule')
    }

    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export const securityService = new SecurityService()