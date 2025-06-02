
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task } from '../../services/projectService';

interface GanttChartProps {
  tasks: Task[];
  startDate: string;
  endDate: string;
}

const GanttChart = ({ tasks, startDate, endDate }: GanttChartProps) => {
  const ganttData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return tasks.map(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      const taskStartOffset = Math.ceil((taskStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const taskDuration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...task,
        startOffset: Math.max(0, taskStartOffset),
        widthPercent: (taskDuration / totalDays) * 100,
        leftPercent: (taskStartOffset / totalDays) * 100
      };
    });
  }, [tasks, startDate, endDate]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'on-hold': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityVariant = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagramme de Gantt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ganttData.map((task) => (
            <div key={task.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{task.name}</span>
                  <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  {task.progress}% - {task.status}
                </span>
              </div>
              
              <div className="relative h-8 bg-gray-100 rounded">
                <div
                  className={`absolute top-0 h-full rounded ${getStatusColor(task.status)} opacity-80`}
                  style={{
                    left: `${task.leftPercent}%`,
                    width: `${task.widthPercent}%`
                  }}
                />
                <div
                  className={`absolute top-0 h-full rounded ${getStatusColor(task.status)}`}
                  style={{
                    left: `${task.leftPercent}%`,
                    width: `${(task.widthPercent * task.progress) / 100}%`
                  }}
                />
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-xs text-white font-medium truncate">
                    {task.name}
                  </span>
                </div>
              </div>
              
              <Progress value={task.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
