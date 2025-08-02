import { QueryClient } from '@tanstack/react-query'

// Configuration optimisée de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache intelligent
      staleTime: 5 * 60 * 1000, // 5 minutes - données considérées comme fraîches
      gcTime: 10 * 60 * 1000, // 10 minutes - durée en cache après inutilisation
      
      // Optimisations réseau
      refetchOnWindowFocus: false, // Éviter les requêtes inutiles
      refetchOnMount: false, // Ne pas refetch si on a des données en cache
      retry: (failureCount, error: any) => {
        // Retry intelligent basé sur le type d'erreur
        if (error?.status === 404) return false
        if (error?.status === 403) return false
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Optimisations pour les mutations
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error)
      },
    },
  },
})

// Configuration pour différents types de données
export const queryKeys = {
  // Employés
  employees: {
    all: ['employees'] as const,
    lists: () => [...queryKeys.employees.all, 'list'] as const,
    list: (filters: Record<string, any>) => 
      [...queryKeys.employees.lists(), { filters }] as const,
    details: () => [...queryKeys.employees.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.employees.details(), id] as const,
  },
  
  // Projets
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: Record<string, any>) => 
      [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  
  // Pointage
  timeEntries: {
    all: ['timeEntries'] as const,
    lists: () => [...queryKeys.timeEntries.all, 'list'] as const,
    list: (filters: Record<string, any>) => 
      [...queryKeys.timeEntries.lists(), { filters }] as const,
  },
}

// Fonction pour invalider le cache de manière intelligente
export const invalidateQueries = {
  employees: () => queryClient.invalidateQueries({ queryKey: queryKeys.employees.all }),
  projects: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
  timeEntries: () => queryClient.invalidateQueries({ queryKey: queryKeys.timeEntries.all }),
}

// Préchargement intelligent
export const prefetchData = {
  employees: (filters = {}) => 
    queryClient.prefetchQuery({
      queryKey: queryKeys.employees.list(filters),
      staleTime: 2 * 60 * 1000, // 2 minutes pour le prefetch
    }),
    
  projects: (filters = {}) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.projects.list(filters),
      staleTime: 2 * 60 * 1000,
    }),
}