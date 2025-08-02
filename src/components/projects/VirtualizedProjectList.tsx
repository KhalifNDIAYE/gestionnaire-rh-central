import React, { memo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInfiniteQuery } from '@tanstack/react-query'
import { optimizedProjectService, type ProjectFilters } from '@/services/optimizedProjectService'
import { queryKeys } from '@/lib/queryClient'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Loader2,
  Edit,
  Trash2 
} from 'lucide-react'
import type { Project } from '@/services/optimizedProjectService'

interface VirtualizedProjectListProps {
  filters: ProjectFilters
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}

// Composant Project Card mémorisé
const ProjectCard = memo(({ 
  project, 
  onEdit, 
  onDelete 
}: { 
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      planning: 'secondary',
      active: 'default',
      completed: 'default',
      cancelled: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status === 'planning' && 'Planification'}
        {status === 'active' && 'Actif'}
        {status === 'completed' && 'Terminé'}
        {status === 'cancelled' && 'Annulé'}
      </Badge>
    )
  }

  const budgetUtilization = project.budget > 0 
    ? (project.actual_cost / project.budget) * 100 
    : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {project.description || 'Aucune description'}
            </p>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(project.start_date).toLocaleDateString('fr-FR')} - 
              {new Date(project.end_date).toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{project.project_manager}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {project.actual_cost.toLocaleString('fr-FR')} € / {project.budget.toLocaleString('fr-FR')} €
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Utilisation du budget</span>
              <span>{budgetUtilization.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(budgetUtilization, 100)} 
              className="h-2"
            />
          </div>
        </div>

        {(project.team.length > 0 || project.consultants.length > 0) && (
          <div className="text-sm">
            <span className="font-medium">Équipe: </span>
            {project.team.length} membre(s)
            {project.consultants.length > 0 && `, ${project.consultants.length} consultant(s)`}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(project)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(project.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

ProjectCard.displayName = 'ProjectCard'

// Skeleton pour le loading
const ProjectSkeleton = memo(() => (
  <Card className="p-4">
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  </Card>
))

ProjectSkeleton.displayName = 'ProjectSkeleton'

export const VirtualizedProjectList: React.FC<VirtualizedProjectListProps> = ({
  filters,
  onEdit,
  onDelete
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: ({ pageParam = 0 }) => 
      optimizedProjectService.getProjectsInfinite(pageParam as number, filters),
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
  })

  const allProjects = React.useMemo(
    () => data?.pages.flatMap((page: any) => page.projects) ?? [],
    [data]
  )

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allProjects.length + 1 : allProjects.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // Hauteur estimée d'une carte projet
    overscan: 3,
  })

  React.useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse()

    if (!lastItem) return

    if (
      lastItem.index >= allProjects.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allProjects.length,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive mb-4">
          Erreur lors du chargement des projets: {(error as Error)?.message}
        </p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Card>
    )
  }

  if (allProjects.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Aucun projet trouvé avec ces filtres.
      </Card>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-[700px] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const isLoaderRow = virtualItem.index > allProjects.length - 1
            const project = allProjects[virtualItem.index]

            return (
              <div
                key={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    <div className="flex justify-center items-center h-20 col-span-full">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Chargement...</span>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-20 col-span-full text-muted-foreground">
                      Tous les projets ont été chargés
                    </div>
                  )
                ) : (
                  <ProjectCard
                    project={project}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}