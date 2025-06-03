
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrganizationalUnit } from '../../services/organigrammeService';
import { useState } from 'react';

interface OrgChartProps {
  units: OrganizationalUnit[];
  onUnitClick?: (unit: OrganizationalUnit) => void;
}

const OrgChart = ({ units, onUnitClick }: OrgChartProps) => {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

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

  const toggleExpand = (unitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedUnits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };

  const renderUnit = (unit: OrganizationalUnit, level: number = 0) => {
    const children = units.filter(u => u.parentId === unit.id);
    const isExpanded = expandedUnits.has(unit.id);
    
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
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {unit.employees.length} employé(s)
                </p>
                {children.length > 0 && (
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer" 
                    onClick={(e) => toggleExpand(unit.id, e)}
                  >
                    {children.length} sous-unité(s) {isExpanded ? '▲' : '▼'}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {children.length > 0 && isExpanded && (
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex flex-wrap justify-center gap-8">
              {children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-4 bg-gray-300"></div>
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
    <div className="p-8 overflow-auto max-w-full">
      <div className="flex flex-col items-center space-y-8">
        {rootUnits.map(unit => renderUnit(unit))}
      </div>
    </div>
  );
};

export default OrgChart;
