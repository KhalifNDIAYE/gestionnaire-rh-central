
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Clock, User } from 'lucide-react';
import { TimeEntry } from '@/types/timeTracking';

interface TimeEntryTableProps {
  entries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
}

const TimeEntryTable = ({ entries, onEdit, onDelete }: TimeEntryTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge variant="default" className="bg-green-600">
            Présent
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="secondary" className="bg-orange-600">
            Retard
          </Badge>
        );
      case 'absent':
        return (
          <Badge variant="destructive">
            Absent
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="outline">
            Partiel
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatTime = (time?: string) => {
    return time || '-';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Historique des pointages
        </CardTitle>
        <CardDescription>
          {entries.length} entrée(s) trouvée(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employé</TableHead>
                <TableHead>Entrée</TableHead>
                <TableHead>Sortie</TableHead>
                <TableHead>Pause début</TableHead>
                <TableHead>Pause fin</TableHead>
                <TableHead>Total heures</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {entry.employeeName}
                    </div>
                  </TableCell>
                  <TableCell>{formatTime(entry.clockIn)}</TableCell>
                  <TableCell>{formatTime(entry.clockOut)}</TableCell>
                  <TableCell>{formatTime(entry.breakStart)}</TableCell>
                  <TableCell>{formatTime(entry.breakEnd)}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {entry.totalHours.toFixed(1)}h
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.notes || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(entry)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeEntryTable;
