
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreateEmployeeData, employeeService } from '../../services/employeeService';
import { OrganizationalUnit } from '../../services/organigrammeService';
import { useEffect } from 'react';

interface EmployeeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeCreated: () => void;
  organizationalUnits: OrganizationalUnit[];
  jobFunctions: string[];
}

const EmployeeFormModal = ({ 
  open, 
  onOpenChange, 
  onEmployeeCreated, 
  organizationalUnits,
  jobFunctions 
}: EmployeeFormModalProps) => {
  const { toast } = useToast();
  const form = useForm<CreateEmployeeData>();

  useEffect(() => {
    if (open) {
      form.reset({
        type: 'employee',
        status: 'active',
        organizational_unit_id: undefined
      });
    }
  }, [open, form]);

  const onSubmit = async (data: CreateEmployeeData) => {
    try {
      // Convert start_date to proper format and set defaults
      const employeeData: CreateEmployeeData = {
        ...data,
        start_date: data.start_date,
        salary: data.type === 'employee' ? (data.salary || 0) : 0,
        status: data.status || 'active',
        organizational_unit_id: data.organizational_unit_id || null
      };

      await employeeService.createEmployee(employeeData);
      toast({
        title: "Succès",
        description: "Agent ajouté avec succès",
      });
      onOpenChange(false);
      form.reset();
      onEmployeeCreated();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'agent",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un employé ou consultant</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la personne
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                rules={{ required: 'Le type est requis' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employee">Employé permanent</SelectItem>
                        <SelectItem value="consultant">Consultant externe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="active">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Le nom est requis' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email invalide'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Ex: jean.dupont@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fonction"
                rules={{ required: 'La fonction est requise' }}
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
                        {jobFunctions.map((fonction) => (
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
                rules={{ required: 'Le département est requis' }}
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
            </div>

            <FormField
              control={form.control}
              name="organizational_unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unité organisationnelle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une unité (optionnel)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Aucune unité</SelectItem>
                      {organizationalUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({unit.type})
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
              name="start_date"
              rules={{ required: 'La date de début est requise' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('type') === 'employee' ? (
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 45000" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hourly_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux horaire (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Ex: 120.00" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Société</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: TechConsult SARL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              Ajouter la personne
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormModal;
