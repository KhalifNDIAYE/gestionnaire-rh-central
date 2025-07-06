
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, Plus, Users } from 'lucide-react';
import { OrganizationalUnit } from '../../services/organigrammeService';

interface UnitListProps {
  units: OrganizationalUnit[];
  onViewUnit: (unit: OrganizationalUnit) => void;
  onEditUnit: (unit: OrganizationalUnit) => void;
  onDeleteUnit: (unitId: string) => void;
  onCreateUnit: () => void;
}

const UnitList = ({ 
  units, 
  onViewUnit, 
  onEditUnit, 
  onDeleteUnit, 
  onCreateUnit 
}: UnitListProps) => {
  const getTypeVariant = (type: OrganizationalUnit['type']) => {
    switch (type) {
      case 'direction': return 'default';
      case 'unite': return 'secondary';
      case 'cellule': return 'outline';
      case 'comite': return 'destructive';
      case 'service': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeLabel = (type: OrganizationalUnit['type']) => {
    switch (type) {
      case 'direction': return 'Direction';
      case 'unite': return 'Unité';
      case 'cellule': return 'Cellule';
      case 'comite': return 'Comité';
      case 'service': return 'Service';
      default: return type;
    }
  };

  const getParentName = (parentId?: string | null) => {
    if (!parentId) return 'Racine';
    const parent = units.find(unit => unit.id === parentId);
    return parent ? parent.name : 'Inconnu';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Unités Organisationnelles</CardTitle>
          <Button onClick={onCreateUnit}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle unité
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Employés</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: unit.color }}
                    />
                    <div>
                      <div className="font-medium">{unit.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {unit.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeVariant(unit.type)}>
                    {getTypeLabel(unit.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {getParentName(unit.parent_id)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    Niveau {unit.level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {unit.manager_name || 'Non assigné'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{unit.employees?.length || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewUnit(unit)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditUnit(unit)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeleteUnit(unit.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UnitList;
