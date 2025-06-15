
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { functionsService, JobFunction } from '../../services/functionsService';

interface FunctionEditModalProps {
  jobFunction: JobFunction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFunctionUpdated: () => void;
  availablePermissions: { id: string; label: string; }[];
}

const FunctionEditModal = ({ 
  jobFunction, 
  open, 
  onOpenChange, 
  onFunctionUpdated,
  availablePermissions 
}: FunctionEditModalProps) => {
  const { toast } = useToast();
  const form = useForm();

  // Pré-remplir le formulaire quand la fonction change
  useEffect(() => {
    if (jobFunction) {
      form.reset({
        title: jobFunction.title,
        department: jobFunction.department,
        description: jobFunction.description,
        level: jobFunction.level,
        permissions: jobFunction.permissions,
        status: jobFunction.status,
      });
    }
  }, [jobFunction, form]);

  const onSubmit = async (data: any) => {
    if (!jobFunction) return;

    try {
      await functionsService.updateFunction(jobFunction.id, data);
      toast({
        title: "Succès",
        description: "Fonction modifiée avec succès",
      });
      onOpenChange(false);
      onFunctionUpdated();
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la fonction",
        variant: "destructive",
      });
    }
  };

  if (!jobFunction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la fonction</DialogTitle>
          <DialogDescription>
            Modifier les détails et permissions de la fonction
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de la fonction</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Développeur Senior" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: IT, RH, Finance..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez les responsabilités de cette fonction..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Permissions</FormLabel>
              <div className="grid grid-cols-2 gap-2 p-4 border rounded-md">
                {availablePermissions.map((permission) => (
                  <FormField
                    key={permission.id}
                    control={form.control}
                    name="permissions"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(permission.id);
                      return (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={isChecked}
                            onChange={(e) => {
                              const currentPermissions = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...currentPermissions, permission.id]);
                              } else {
                                field.onChange(currentPermissions.filter((p: string) => p !== permission.id));
                              }
                            }}
                          />
                          <label htmlFor={permission.id} className="text-sm">
                            {permission.label}
                          </label>
                        </div>
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sauvegarder les modifications
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FunctionEditModal;
