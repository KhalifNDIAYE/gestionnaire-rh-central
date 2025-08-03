import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { securityService } from '@/services/securityService'
import { useToast } from '@/hooks/use-toast'
import type { User, Session } from '@supabase/supabase-js'

interface SecureAuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
}

interface LoginCredentials {
  email: string
  password: string
}

interface SignUpCredentials extends LoginCredentials {
  confirmPassword: string
  metadata?: Record<string, any>
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          isAuthenticated: !!session,
        })

        // Créer une session sécurisée lors de la connexion
        if (event === 'SIGNED_IN' && session) {
          try {
            await securityService.createSecureSession()
          } catch (error) {
            console.warn('Erreur lors de la création de session sécurisée:', error)
          }
        }

        // Invalider les sessions lors de la déconnexion
        if (event === 'SIGNED_OUT') {
          try {
            await securityService.invalidateUserSessions()
          } catch (error) {
            console.warn('Erreur lors de l\'invalidation des sessions:', error)
          }
        }
      }
    )

    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        isAuthenticated: !!session,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        })
        return { success: false, error: error.message }
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      })

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      return { success: false, error: errorMessage }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [toast])

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      // Validation des mots de passe
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas')
      }

      // Validation de la force du mot de passe
      const passwordValidation = securityService.validatePasswordStrength(credentials.password)
      if (!passwordValidation.isValid) {
        throw new Error(`Mot de passe faible: ${passwordValidation.errors.join(', ')}`)
      }

      const redirectUrl = `${window.location.origin}/`

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: credentials.metadata || {}
        }
      })

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive"
        })
        return { success: false, error: error.message }
      }

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte"
      })

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      return { success: false, error: errorMessage }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [toast])

  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signOut()

      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: error.message,
          variant: "destructive"
        })
        return { success: false, error: error.message }
      }

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté"
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      return { success: false, error: errorMessage }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [toast])

  const resetPassword = useCallback(async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      })

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        })
        return { success: false, error: error.message }
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre email pour réinitialiser votre mot de passe"
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      return { success: false, error: errorMessage }
    }
  }, [toast])

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      // Validation de la force du mot de passe
      const passwordValidation = securityService.validatePasswordStrength(newPassword)
      if (!passwordValidation.isValid) {
        throw new Error(`Mot de passe faible: ${passwordValidation.errors.join(', ')}`)
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        })
        return { success: false, error: error.message }
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès"
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      return { success: false, error: errorMessage }
    }
  }, [toast])

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.warn('Erreur lors du rafraîchissement de session:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.warn('Erreur lors du rafraîchissement de session:', errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  }
}