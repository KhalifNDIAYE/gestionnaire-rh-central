import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loading des pages principales
export const LazyEmployeesPage = React.lazy(() => 
  import('@/pages/EmployeesPage').then(module => ({ default: module.default }))
)

export const LazyProjectsPage = React.lazy(() => 
  import('@/pages/ProjectsPage').then(module => ({ default: module.default }))
)

export const LazyTimeTrackingPage = React.lazy(() => 
  import('@/pages/TimeTrackingPage').then(module => ({ default: module.default }))
)

export const LazyLeaveRequestsPage = React.lazy(() => 
  import('@/pages/LeaveRequestsPage').then(module => ({ default: module.default }))
)

export const LazyMemorandumPage = React.lazy(() => 
  import('@/pages/MemorandumPage').then(module => ({ default: module.default }))
)

export const LazySettingsPage = React.lazy(() => 
  import('@/pages/SettingsPage').then(module => ({ default: module.default }))
)

export const LazyDirectoryPage = React.lazy(() => 
  import('@/pages/DirectoryPage').then(module => ({ default: module.default }))
)

export const LazyCommunicationPage = React.lazy(() => 
  import('@/pages/CommunicationPage').then(module => ({ default: module.default }))
)

export const LazyOrganigrammePage = React.lazy(() => 
  import('@/pages/OrganigrammePage').then(module => ({ default: module.default }))
)

export const LazyFunctionsPage = React.lazy(() => 
  import('@/pages/FunctionsPage').then(module => ({ default: module.default }))
)

// Composant de fallback pour le loading
export const PageLoadingSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-10 w-32" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

// HOC pour wrapper les pages lazy avec suspense
export const withLazyLoading = <P extends Record<string, any> = Record<string, never>>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
  fallback?: React.ComponentType
) => {
  const WrappedComponent = (props: P) => (
    <Suspense fallback={fallback ? React.createElement(fallback) : <PageLoadingSkeleton />}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  )
  
  WrappedComponent.displayName = `withLazyLoading(Component)`
  
  return WrappedComponent
}

// Composants prêts à utiliser
export const EmployeesPage = withLazyLoading(LazyEmployeesPage)
export const ProjectsPage = withLazyLoading(LazyProjectsPage)
export const TimeTrackingPage = withLazyLoading(LazyTimeTrackingPage)
export const LeaveRequestsPage = withLazyLoading(LazyLeaveRequestsPage)
export const MemorandumPage = withLazyLoading(LazyMemorandumPage)
export const SettingsPage = withLazyLoading(LazySettingsPage)
export const DirectoryPage = withLazyLoading(LazyDirectoryPage)
export const CommunicationPage = withLazyLoading(LazyCommunicationPage)
export const OrganigrammePage = withLazyLoading(LazyOrganigrammePage)
export const FunctionsPage = withLazyLoading(LazyFunctionsPage)