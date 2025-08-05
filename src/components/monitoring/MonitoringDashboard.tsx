import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity,
  AlertTriangle,
  BarChart3,
  Bug,
  Download,
  Eye,
  Filter,
  RefreshCw,
  Settings,
  TrendingUp
} from 'lucide-react';
import { logger, businessMetrics } from '@/lib/logging';
import { performanceMonitor } from '@/lib/performance';
import { analytics, useAnalytics } from '@/lib/analytics';
import * as Sentry from "@sentry/react";

export const MonitoringDashboard = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [sentryEvents, setSentryEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { track } = useAnalytics();

  useEffect(() => {
    loadData();
    track('page_view', 'monitoring', 'dashboard');
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      // Charger les logs
      const recentLogs = logger.getLogs().slice(-100);
      setLogs(recentLogs);

      // Charger les métriques business
      const businessMetricsData = businessMetrics.getMetrics();
      setMetrics(businessMetricsData.slice(-50));

      // Charger les données de performance
      const perfData = performanceMonitor.getPerformanceReport();
      setPerformanceData(perfData.slice(-50));

      // Simuler les événements Sentry (normalement récupérés via API)
      setSentryEvents([
        {
          id: '1',
          title: 'TypeError: Cannot read property',
          level: 'error',
          count: 3,
          lastSeen: new Date().toISOString()
        }
      ]);

    } catch (error) {
      logger.logError(error as Error, 'MonitoringDashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const downloadLogs = () => {
    const data = logger.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    track('download', 'monitoring', 'logs');
  };

  const downloadMetrics = () => {
    const data = businessMetrics.exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    track('download', 'monitoring', 'metrics');
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
    track('clear', 'monitoring', 'logs');
  };

  const getLevelBadgeVariant = (level: number) => {
    switch (level) {
      case 0: return 'secondary'; // DEBUG
      case 1: return 'default';   // INFO
      case 2: return 'default';   // WARN
      case 3: return 'destructive'; // ERROR
      case 4: return 'destructive'; // FATAL
      default: return 'default';
    }
  };

  const getLevelName = (level: number) => {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    return levels[level] || 'UNKNOWN';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground">
            Surveillance des performances, erreurs et métriques métier
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="errors">Erreurs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="metrics">Métriques Métier</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Erreurs (24h)</CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {logs.filter(log => log.level >= 3).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {logs.filter(log => log.level === 4).length} critiques
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Bonne</div>
                <p className="text-xs text-muted-foreground">
                  Temps moyen: {performanceData.find(p => p.name === 'Total_Load_Time')?.value?.toFixed(0) || 'N/A'}ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.filter(m => m.name === 'user_login').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dernières 24h
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{logs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Logs générés
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alertes Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.filter(log => log.level >= 3).slice(0, 5).map((log, index) => (
                  <Alert key={index} variant={log.level === 4 ? "destructive" : "default"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <span>{log.message}</span>
                        <Badge variant={getLevelBadgeVariant(log.level)}>
                          {getLevelName(log.level)}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
                {logs.filter(log => log.level >= 3).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Aucune alerte active
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Erreurs Récentes</CardTitle>
                  <CardDescription>Logs d'erreurs et d'exceptions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={downloadLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {logs.filter(log => log.level >= 3).map((log, index) => (
                    <div key={index} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={getLevelBadgeVariant(log.level)}>
                          {getLevelName(log.level)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-medium">{log.message}</p>
                      {log.component && (
                        <p className="text-sm text-muted-foreground">
                          Composant: {log.component}
                        </p>
                      )}
                      {log.context && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-muted-foreground">
                            Détails
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Performance</CardTitle>
              <CardDescription>Temps de chargement et métriques Core Web Vitals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {performanceData.slice(-9).map((metric, index) => (
                  <div key={index} className="border rounded p-3">
                    <h4 className="font-medium">{metric.name.replace(/_/g, ' ')}</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {metric.value.toFixed(2)} {metric.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(metric.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Logs du Système</CardTitle>
                  <CardDescription>Tous les événements système</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearLogs}>
                    <Filter className="h-4 w-4 mr-2" />
                    Vider
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadLogs}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-1 font-mono text-sm">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded ${
                        log.level >= 3 ? 'bg-red-50 dark:bg-red-950' :
                        log.level === 2 ? 'bg-yellow-50 dark:bg-yellow-950' :
                        'bg-gray-50 dark:bg-gray-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant={getLevelBadgeVariant(log.level)} className="text-xs">
                          {getLevelName(log.level)}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.component && (
                          <span className="text-blue-600 dark:text-blue-400">
                            [{log.component}]
                          </span>
                        )}
                      </div>
                      <p className="mt-1">{log.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Métriques Métier</CardTitle>
                  <CardDescription>KPIs et métriques de l'application RH</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={downloadMetrics}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['authentication', 'hr', 'projects', 'leave', 'payroll', 'documents'].map(category => {
                  const categoryMetrics = metrics.filter(m => m.category === category);
                  const totalEvents = categoryMetrics.reduce((sum, m) => sum + m.value, 0);
                  
                  return (
                    <Card key={category}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm capitalize">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                          {categoryMetrics.length} événements
                        </p>
                        <div className="mt-2 space-y-1">
                          {categoryMetrics.slice(-3).map((metric, index) => (
                            <div key={index} className="text-xs">
                              <span className="font-medium">{metric.name}:</span> {metric.value}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};