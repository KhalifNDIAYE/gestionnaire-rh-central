
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building } from 'lucide-react';
import { UserWithUnit } from '../../services/userService';

interface EmployeeCardProps {
  employee: UserWithUnit;
  onClick: () => void;
}

const EmployeeCard = ({ employee, onClick }: EmployeeCardProps) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'rh':
        return 'bg-blue-100 text-blue-800';
      case 'gestionnaire':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'rh':
        return 'RH';
      case 'gestionnaire':
        return 'Gestionnaire';
      case 'agent':
        return 'Agent';
      default:
        return role;
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-300"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{employee.name}</h3>
            <Badge className={`text-xs ${getRoleBadgeColor(employee.role)}`}>
              {getRoleLabel(employee.role)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span className="truncate">{employee.fonction}</span>
          </div>
          
          {employee.unit && (
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span className="truncate text-xs">{employee.unit.name}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span className="truncate">{employee.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
