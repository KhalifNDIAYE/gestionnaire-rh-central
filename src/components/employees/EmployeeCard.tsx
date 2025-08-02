import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Mail, Calendar } from 'lucide-react'
import type { Employee } from '@/services/employeeService'

interface EmployeeCardProps {
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Actif</Badge>
      case 'inactive':
        return <Badge variant="destructive">Inactif</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'employee':
        return <Badge variant="default">Employé</Badge>
      case 'consultant':
        return <Badge variant="outline">Consultant</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.fonction}</p>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(employee.status)}
            {getTypeBadge(employee.type)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{employee.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(employee.start_date).toLocaleDateString('fr-FR')}</span>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Département:</span> {employee.department}
          </div>
          
          {employee.salary && (
            <div className="text-sm">
              <span className="font-medium">Salaire:</span> {employee.salary.toLocaleString('fr-FR')} €
            </div>
          )}
          
          {employee.hourly_rate && (
            <div className="text-sm">
              <span className="font-medium">Taux horaire:</span> {employee.hourly_rate} €/h
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(employee)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(employee.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}