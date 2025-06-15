
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

interface Employee {
  id: string;
  name: string;
  email: string;
  fonction: string;
  department: string;
  status: 'active' | 'inactive';
  startDate: string;
  salary: number;
  type: 'employee' | 'consultant';
  endDate?: string;
  hourlyRate?: number;
  company?: string;
}

interface EmployeeEditModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeUpdated: () => void;
  mockFonctions: string[];
}

const EmployeeEditModal = ({ 
  employee, 
  open, 
  onOpenChange, 
  onEmployeeUpdated, 
  mockFonctions 
}: EmployeeEditModalProps) => {
  const { user } = useAuth();
  const form = useForm();

  const isAdmin = user?.role === 'admin';
  const isRH = user?.role === 'rh';
  const isOwnProfile = user?.id === employee?.id;
  const canModifyAll = isAdmin || isRH;

  const onSubmit = (data: any) => {
    console.log('Modification employé:', data);
    onOpenChange(false);
    onEmployeeUpdated();
    form.reset();
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isOwnProfile ? 'Modifier mon profil' : 'Modifier l\'employé'}
          </DialogTitle>
          <DialogDescription>
            {isOwnProfile 
              ? 'Modifier vos informations personnelles'
              : 'Modifier les informations de l\'employé'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              defaultValue={employee.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Jean Dupont" 
                      {...field} 
                      disabled={!isOwnProfile && !canModifyAll}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              defaultValue={employee.email}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="jean.dupont@cse.sn" 
                      {...field} 
                      disabled={!isOwnProfile && !canModifyAll}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {canModifyAll && (
              <>
                <FormField
                  control={form.control}
                  name="fonction"
                  defaultValue={employee.fonction}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonction</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une fonction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockFonctions.map((fonction) => (
                            <SelectItem key={fonction} value={fonction}>
                              {fonction}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  defaultValue={employee.department}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">RH</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Operations">Opérations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  defaultValue={employee.status}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {employee.type === 'employee' && (
                  <FormField
                    control={form.control}
                    name="salary"
                    defaultValue={employee.salary}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salaire annuel (€)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="45000" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {employee.type === 'consultant' && (
                  <>
                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      defaultValue={employee.hourlyRate}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarif horaire (€)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="120" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      defaultValue={employee.company}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Société de conseil</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="TechConsult SARL" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      defaultValue={employee.endDate}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de fin de mission</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </>
            )}

            <Button type="submit" className="w-full">
              {isOwnProfile ? 'Sauvegarder mon profil' : 'Sauvegarder les modifications'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditModal;
