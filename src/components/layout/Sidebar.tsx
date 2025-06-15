
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  ChevronDown,
  ChevronUp,
  User,
  Building,
  Clock,
  BookOpen,
  Briefcase,
  FolderKanban,
  Network,
  Contact
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
  group: 'principal' | 'rh' | 'finance' | 'parametrages';
}

const menuItems: MenuItem[] = [
  // MENU PRINCIPAL
  { id: 'dashboard', label: 'Tableau de bord', icon: Home, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal' },
  { id: 'directory', label: 'Annuaire', icon: Contact, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal' },
  { id: 'memorandum', label: 'Mémorandums', icon: BookOpen, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal' },
  { id: 'profile', label: 'Mon profil', icon: User, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal' },
  
  // GESTION RH
  { id: 'employees', label: 'Gestion des agents', icon: Users, roles: ['admin', 'rh'], group: 'rh' },
  { id: 'functions', label: 'Gestion des fonctions', icon: Briefcase, roles: ['admin'], group: 'rh' },
  { id: 'leave-requests', label: 'Demandes de congés', icon: Calendar, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'rh' },
  { id: 'organigramme', label: 'Organigramme', icon: Network, roles: ['admin', 'rh'], group: 'rh' },
  { id: 'time-tracking', label: 'Pointage', icon: Clock, roles: ['admin', 'rh', 'agent'], group: 'rh' },
  
  // GESTION FINANCIERE
  { id: 'payroll', label: 'Bulletins de salaire', icon: FileText, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'finance' },
  { id: 'salary', label: 'Calcul des salaires', icon: DollarSign, roles: ['admin', 'gestionnaire'], group: 'finance' },
  { id: 'projects', label: 'Gestion des projets', icon: FolderKanban, roles: ['admin', 'gestionnaire'], group: 'finance' },
  
  // PARAMETRAGES
  { id: 'settings', label: 'Paramètres', icon: Settings, roles: ['admin'], group: 'parametrages' },
];

const menuGroups = {
  principal: 'MENU PRINCIPAL',
  rh: 'GESTION RH',
  finance: 'GESTION FINANCIÈRE',
  parametrages: 'PARAMÉTRAGES'
};

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

const Sidebar = ({ activeItem = 'dashboard', onItemClick }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    principal: true,
    rh: true,
    finance: true,
    parametrages: true
  });
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  // Grouper les éléments par catégorie
  const groupedItems = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleItemClick = (itemId: string) => {
    console.log(`Navigation vers: ${itemId}`);
    onItemClick?.(itemId);
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col sticky top-0 h-screen z-30",
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
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <Collapsible
            key={groupKey}
            open={expandedSections[groupKey]}
            onOpenChange={() => toggleSection(groupKey)}
          >
            {!collapsed && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto font-semibold text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-50"
                >
                  <span>{menuGroups[groupKey as keyof typeof menuGroups]}</span>
                  {expandedSections[groupKey] ? 
                    <ChevronUp className="w-3 h-3" /> : 
                    <ChevronDown className="w-3 h-3" />
                  }
                </Button>
              </CollapsibleTrigger>
            )}
            
            <CollapsibleContent className="space-y-1 mt-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left",
                      collapsed ? "px-2" : "px-3 ml-2",
                      isActive && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
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
