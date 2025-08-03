import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity,
  Clock,
  Eye,
  RefreshCw,
  Lock
} from 'lucide-react'
import { securityService, type SecurityMetrics, type AuditLog } from '@/services/securityService'
import { useToast } from '@/hooks/use-toast'

export const SecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [userLogs, setUserLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      const [metricsData, logsData] = await Promise.all([
        securityService.getSecurityMetrics(),
        securityService.getUserAuditLogs(50)
      ])
      
      setMetrics(metricsData)
      setUserLogs(logsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de sécurité",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInvalidateSessions = async () => {
    try {
      await securityService.invalidateUserSessions()
      toast({
        title: "Sessions invalidées",
        description: "Toutes vos sessions ont été invalidées",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'invalider les sessions",
        variant: "destructive"
      })
    }
  }

  const handleCleanupSessions = async () => {
    try {
      await securityService.cleanupExpiredSessions()
      toast({
        title: "Nettoyage effectué",
        description: "Les sessions expirées ont été supprimées",
      })
      loadSecurityData()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de nettoyer les sessions",
        variant: "destructive"
      })
    }
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('CREATE')) return 'default'
    if (action.includes('UPDATE')) return 'secondary'
    if (action.includes('DELETE')) return 'destructive'
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'outline'
    return 'secondary'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tableau de Bord Sécurité</h2>
        <div className="flex gap-2">
          <Button onClick={handleCleanupSessions} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Nettoyer
          </Button>
          <Button onClick={handleInvalidateSessions} variant="destructive" size="sm">
            <Lock className="h-4 w-4 mr-2" />
            Invalider Sessions
          </Button>
        </div>
      </div>

      {/* Métriques de sécurité */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Activités</p>
                  <p className="text-2xl font-bold">{metrics.totalLogs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Tentatives Échouées</p>
                  <p className="text-2xl font-bold">{metrics.failedAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs Uniques</p>
                  <p className="text-2xl font-bold">{metrics.uniqueUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Taux de Réussite</p>
                  <p className="text-2xl font-bold">
                    {metrics.totalLogs > 0 
                      ? Math.round(((metrics.totalLogs - metrics.failedAttempts) / metrics.totalLogs) * 100)
                      : 100
                    }%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activité Récente</TabsTrigger>
          <TabsTrigger value="actions">Top Actions</TabsTrigger>
          <TabsTrigger value="logs">Mes Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.recentActivity.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                      <div>
                        <p className="font-medium">{log.resource_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(log.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {log.success ? (
                        <Badge variant="outline" className="text-green-600">
                          Réussi
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Échec
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions les Plus Fréquentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.topActions.map((action, index) => (
                  <div key={action.action} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{action.action}</span>
                      <span className="text-sm text-muted-foreground">
                        {action.count} fois
                      </span>
                    </div>
                    <Progress 
                      value={(action.count / (metrics.topActions[0]?.count || 1)) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Mes Logs d'Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {log.resource_type}
                      </div>
                      <div>
                        <span className="font-medium">Statut:</span>{' '}
                        {log.success ? (
                          <span className="text-green-600">Réussi</span>
                        ) : (
                          <span className="text-red-600">Échec</span>
                        )}
                      </div>
                    </div>

                    {log.error_message && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {log.error_message}
                      </div>
                    )}

                    {(log.ip_address || log.user_agent) && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {log.ip_address && <div>IP: {log.ip_address}</div>}
                        {log.user_agent && <div>User Agent: {log.user_agent}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}