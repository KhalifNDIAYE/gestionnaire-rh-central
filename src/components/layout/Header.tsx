
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Bell, LogOut, User, Settings, ChevronRight } from 'lucide-react';

interface HeaderProps {
  activeItem?: string;
}

// Mapping des pages pour le breadcrumb
const pageMapping: Record<string, { title: string; category?: string }> = {
  'dashboard': { title: 'Tableau de bord' },
  'directory': { title: 'Annuaire' },
  'memorandum': { title: 'Mémorandums' },
  'profile': { title: 'Mon profil' },
  'employees': { title: 'Gestion des agents', category: 'Gestion RH' },
  'functions': { title: 'Gestion des fonctions', category: 'Gestion RH' },
  'leave-requests': { title: 'Demandes de congés', category: 'Gestion RH' },
  'organigramme': { title: 'Organigramme', category: 'Gestion RH' },
  'time-tracking': { title: 'Pointage', category: 'Gestion RH' },
  'payroll': { title: 'Bulletins de salaire', category: 'Gestion Financière' },
  'salary': { title: 'Calcul des salaires', category: 'Gestion Financière' },
  'projects': { title: 'Gestion des projets', category: 'Gestion Financière' },
  'settings': { title: 'Paramètres', category: 'Paramétrages' },
};

const Header = ({ activeItem = 'dashboard' }: HeaderProps) => {
  const { user, logout } = useAuth();
  const currentPage = pageMapping[activeItem];

  const getBreadcrumb = () => {
    const breadcrumbItems = [{ title: 'Partagés avec moi', isLink: false }];
    
    if (currentPage?.category) {
      breadcrumbItems.push({ title: currentPage.category, isLink: false });
    }
    
    breadcrumbItems.push({ title: currentPage?.title || 'Page', isLink: false });
    
    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumb();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
              <span 
                className={cn(
                  index === breadcrumbItems.length - 1 
                    ? "text-gray-900 font-medium" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.fonction}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
