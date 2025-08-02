import React, { memo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInfiniteQuery } from '@tanstack/react-query'
import { optimizedEmployeeService } from '@/services/optimizedEmployeeService'
import { queryKeys } from '@/lib/queryClient'
import { EmployeeCard } from './EmployeeCard'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { Employee } from '@/services/employeeService'

interface VirtualizedEmployeeListProps {
  filters: {
    search?: string
    department?: string
    status?: string
    type?: string
  }
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}

// Composant Item mémorisé pour éviter les re-renders
const EmployeeListItem = memo(({ 
  employee, 
  onEdit, 
  onDelete 
}: { 
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}) => (
  <div className="p-2">
    <EmployeeCard
      employee={employee}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </div>
))

EmployeeListItem.displayName = 'EmployeeListItem'

// Skeleton pour le loading
const EmployeeSkeleton = memo(() => (
  <Card className="p-4 m-2">
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </Card>
))

EmployeeSkeleton.displayName = 'EmployeeSkeleton'

export const VirtualizedEmployeeList: React.FC<VirtualizedEmployeeListProps> = ({
  filters,
  onEdit,
  onDelete
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Infinite query pour le chargement par batch
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.employees.list(filters),
    queryFn: ({ pageParam = 0 }) => 
      optimizedEmployeeService.getEmployeesInfinite(pageParam as number, filters),
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Aplatir les données des pages
  const allEmployees = React.useMemo(
    () => data?.pages.flatMap((page: any) => page.employees) ?? [],
    [data]
  )

  // Configuration du virtualizer
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allEmployees.length + 1 : allEmployees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Hauteur estimée d'une carte employé
    overscan: 5, // Nombre d'éléments à pré-rendre
  })

  // Effet pour charger plus de données quand on approche de la fin
  React.useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse()

    if (!lastItem) return

    if (
      lastItem.index >= allEmployees.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allEmployees.length,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <EmployeeSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive mb-4">
          Erreur lors du chargement des employés: {(error as Error)?.message}
        </p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Card>
    )
  }

  if (allEmployees.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Aucun employé trouvé avec ces filtres.
      </Card>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto border rounded-lg"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index > allEmployees.length - 1
          const employee = allEmployees[virtualItem.index]

          return (
            <div
              key={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Chargement...</span>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    Tous les employés ont été chargés
                  </div>
                )
              ) : (
                <EmployeeListItem
                  employee={employee}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}