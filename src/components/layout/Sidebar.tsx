
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Clock,
  BookOpen,
  Briefcase
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home, roles: ['admin', 'rh', 'gestionnaire', 'agent'] },
  { id: 'employees', label: 'Gestion des agents', icon: Users, roles: ['admin', 'rh'] },
  { id: 'functions', label: 'Gestion des fonctions', icon: Briefcase, roles: ['admin'] },
  { id: 'leave-requests', label: 'Demandes de congés', icon: Calendar, roles: ['admin', 'rh', 'gestionnaire', 'agent'] },
  { id: 'payroll', label: 'Bulletins de salaire', icon: FileText, roles: ['admin', 'rh', 'gestionnaire', 'agent'] },
  { id: 'salary', label: 'Calcul des salaires', icon: DollarSign, roles: ['admin', 'gestionnaire'] },
  { id: 'memorandum', label: 'Mémorandums', icon: BookOpen, roles: ['admin', 'rh', 'gestionnaire', 'agent'] },
  { id: 'profile', label: 'Mon profil', icon: User, roles: ['admin', 'rh', 'gestionnaire', 'agent'] },
  { id: 'departments', label: 'Départements', icon: Building, roles: ['admin', 'rh'] },
  { id: 'time-tracking', label: 'Pointage', icon: Clock, roles: ['admin', 'rh', 'agent'] },
  { id: 'settings', label: 'Paramètres', icon: Settings, roles: ['admin'] },
];

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

const Sidebar = ({ activeItem = 'dashboard', onItemClick }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const handleItemClick = (itemId: string) => {
    console.log(`Navigation vers: ${itemId}`);
    onItemClick?.(itemId);
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">RH System</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-left",
                collapsed ? "px-2" : "px-3",
                isActive && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => handleItemClick(item.id)}
            >
              <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* User info */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.fonction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
