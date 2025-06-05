
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users } from 'lucide-react';
import { userService, UserWithUnit } from '../services/userService';
import EmployeeCard from '../components/directory/EmployeeCard';
import EmployeeDetailModal from '../components/directory/EmployeeDetailModal';

const DirectoryPage = () => {
  const [employees, setEmployees] = useState<UserWithUnit[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<UserWithUnit[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<UserWithUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filterUnit]);

  const loadEmployees = async () => {
    try {
      const data = await userService.getUsersWithUnits();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.fonction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par unité
    if (filterUnit !== 'all') {
      filtered = filtered.filter(employee => employee.unitId === filterUnit);
    }

    setFilteredEmployees(filtered);
  };

  const getUniqueUnits = () => {
    const units = employees
      .filter(emp => emp.unit)
      .map(emp => emp.unit!)
      .filter((unit, index, self) => self.findIndex(u => u.id === unit.id) === index);
    return units;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement de l'annuaire...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Annuaire</h1>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un employé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email ou fonction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterUnit} onValueChange={setFilterUnit}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrer par unité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les unités</SelectItem>
                {getUniqueUnits().map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={() => setSelectedEmployee(employee)}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun employé trouvé avec ces critères</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de détails */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      />
    </div>
  );
};

export default DirectoryPage;
