
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Building, Calendar, Headphones, MapPin } from 'lucide-react';
import { UserWithUnit } from '../../services/userService';

interface EmployeeDetailModalProps {
  employee: UserWithUnit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeDetailModal = ({ employee, open, onOpenChange }: EmployeeDetailModalProps) => {
  if (!employee) return null;

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
        return 'Ressources Humaines';
      case 'gestionnaire':
        return 'Gestionnaire';
      case 'agent':
        return 'Agent';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={employee.photoUrl} alt={employee.name} />
              <AvatarFallback className="bg-blue-100 text-2xl">
                <User className="h-8 w-8 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{employee.name}</DialogTitle>
              <Badge className={`mt-1 ${getRoleBadgeColor(employee.role)}`}>
                {getRoleLabel(employee.role)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations professionnelles */}
          <div>
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-3">
              Informations professionnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Fonction</div>
                  <div className="font-medium">{employee.fonction}</div>
                </div>
              </div>
              
              {employee.unit && (
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Unité</div>
                    <div className="font-medium">{employee.unit.name}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Email professionnel</div>
                  <div className="font-medium">
                    <a 
                      href={`mailto:${employee.professionalEmail || employee.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {employee.professionalEmail || employee.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Headphones className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Numéro VOIP</div>
                  <div className="font-medium">{employee.voipNumber || 'Non renseigné'}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Date d'embauche</div>
                  <div className="font-medium">{formatDate(employee.hireDate)}</div>
                </div>
              </div>
            </div>

            {employee.professionalAddress && (
              <div className="flex items-start space-x-3 mt-4">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Adresse professionnelle</div>
                  <div className="font-medium">{employee.professionalAddress}</div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Informations de contact personnelles */}
          <div>
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-3">
              Contact personnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Email personnel</div>
                  <div className="font-medium">
                    <a 
                      href={`mailto:${employee.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {employee.email}
                    </a>
                  </div>
                </div>
              </div>

              {employee.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Téléphone personnel</div>
                    <div className="font-medium">
                      <a 
                        href={`tel:${employee.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {employee.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {employee.address && (
              <div className="flex items-start space-x-3 mt-4">
                <Building className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Adresse personnelle</div>
                  <div className="font-medium">{employee.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailModal;
