
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { functionsService } from '../../services/functionsService';

interface FunctionCreateModalProps {
  onFunctionCreated: () => void;
  availablePermissions: { id: string; label: string; }[];
}

const FunctionCreateModal = ({ onFunctionCreated, availablePermissions }: FunctionCreateModalProps) => {
  const { toast } = useToast();
  const form = useForm();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const onSubmit = async (data: any) => {
    try {
      const newFunction = {
        title: data.title,
        department: data.department,
        description: data.description,
        level: data.level,
        permissions: data.permissions || [],
        status: 'active' as const
      };

      await functionsService.createFunction(newFunction);
      toast({
        title: "Succès",
        description: "Fonction créée avec succès",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      onFunctionCreated();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la fonction",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fonction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle fonction</DialogTitle>
          <DialogDescription>
            Définissez les détails et permissions de la nouvelle fonction
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
              Créer la fonction
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FunctionCreateModal;
