
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrganizationalUnit } from '../../services/organigrammeService';

interface OrgChartProps {
  units: OrganizationalUnit[];
  onUnitClick?: (unit: OrganizationalUnit) => void;
}

const OrgChart = ({ units, onUnitClick }: OrgChartProps) => {
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

  const renderUnit = (unit: OrganizationalUnit, level: number = 0) => {
    const children = units.filter(u => u.parentId === unit.id);
    
    return (
      <div key={unit.id} className="flex flex-col items-center">
        <Card 
          className={`mb-4 cursor-pointer hover:shadow-lg transition-shadow ${
            level === 0 ? 'w-80' : level === 1 ? 'w-72' : 'w-64'
          }`}
          onClick={() => onUnitClick?.(unit)}
          style={{ borderColor: unit.color }}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <Badge 
                variant="outline" 
                className="mb-2"
                style={{ color: unit.color, borderColor: unit.color }}
              >
                {getTypeLabel(unit.type)}
              </Badge>
              <h3 className="font-semibold text-sm mb-1">{unit.name}</h3>
              {unit.managerName && (
                <p className="text-xs text-gray-600 mb-1">
                  Responsable: {unit.managerName}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {unit.employees.length} employé(s)
              </p>
            </div>
          </CardContent>
        </Card>
        
        {children.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex space-x-8">
              {children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="w-4 h-px bg-gray-300"></div>
                  {renderUnit(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const rootUnits = units.filter(unit => !unit.parentId);

  return (
    <div className="p-8 overflow-auto">
      <div className="flex flex-col items-center space-y-8">
        {rootUnits.map(unit => renderUnit(unit))}
      </div>
    </div>
  );
};

export default OrgChart;
