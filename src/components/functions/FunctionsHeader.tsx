
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import FunctionCreateModal from './FunctionCreateModal';

interface FunctionsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFunctionCreated: () => void;
  availablePermissions: { id: string; label: string; }[];
}

const FunctionsHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onFunctionCreated,
  availablePermissions 
}: FunctionsHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des fonctions</h1>
          <p className="text-gray-600">Gérer les fonctions et leurs permissions</p>
        </div>
        <FunctionCreateModal 
          onFunctionCreated={onFunctionCreated}
          availablePermissions={availablePermissions}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4" />
        <Input
          placeholder="Rechercher une fonction..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </>
  );
};

export default FunctionsHeader;
