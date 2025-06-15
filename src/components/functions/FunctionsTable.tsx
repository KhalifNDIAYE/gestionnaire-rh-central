
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { JobFunction } from '../../services/functionsService';

interface FunctionsTableProps {
  functions: JobFunction[];
  loading: boolean;
  availablePermissions: { id: string; label: string; }[];
  onEdit: (jobFunction: JobFunction) => void;
  onDelete: (jobFunction: JobFunction) => void;
}

const FunctionsTable = ({ 
  functions, 
  loading, 
  availablePermissions, 
  onEdit, 
  onDelete 
}: FunctionsTableProps) => {
  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fonction</TableHead>
          <TableHead>Département</TableHead>
          <TableHead>Niveau</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {functions.map((func) => (
          <TableRow key={func.id}>
            <TableCell>
              <div>
                <div className="font-medium">{func.title}</div>
                <div className="text-sm text-gray-500">{func.description}</div>
              </div>
            </TableCell>
            <TableCell>{func.department}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {func.level}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {func.permissions.slice(0, 3).map((permission) => (
                  <Badge key={permission} variant="secondary" className="text-xs">
                    {availablePermissions.find(p => p.id === permission)?.label}
                  </Badge>
                ))}
                {func.permissions.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{func.permissions.length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={func.status === 'active' ? 'default' : 'secondary'}>
                {func.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(func)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(func)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FunctionsTable;
