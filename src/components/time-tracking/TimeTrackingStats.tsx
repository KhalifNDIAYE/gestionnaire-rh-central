
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, TrendingUp, Users } from 'lucide-react';
import { TimeTrackingStats } from '@/types/timeTracking';

interface TimeTrackingStatsProps {
  stats: TimeTrackingStats;
}

const TimeTrackingStatsComponent = ({ stats }: TimeTrackingStatsProps) => {
  const attendanceRate = stats.currentMonth.workingDays > 0 
    ? (stats.currentMonth.presentDays / stats.currentMonth.workingDays * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des heures</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground">
            Moyenne: {stats.averageHours.toFixed(1)}h/jour
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jours présents</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.presentDays}</div>
          <p className="text-xs text-muted-foreground">
            Retards: {stats.lateDays}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
          <p className="text-xs text-muted-foreground">
            Ce mois-ci
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Heures ce mois</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {stats.currentMonth.totalHours.toFixed(1)}h
          </div>
          <p className="text-xs text-muted-foreground">
            Sur {stats.currentMonth.workingDays} jours ouvrables
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTrackingStatsComponent;
