
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { settingsService, SystemSettings } from '../../services/settingsService';
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
  Contact,
  Megaphone
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
  group: 'principal' | 'rh' | 'finance' | 'parametrages';
  moduleKey?: keyof SystemSettings['modules'];
}

const menuItems: MenuItem[] = [
  // MENU PRINCIPAL
  { id: 'dashboard', label: 'Tableau de bord', icon: Home, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal' },
  { id: 'directory', label: 'Annuaire', icon: Contact, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal', moduleKey: 'directory' },
  { id: 'memorandum', label: 'Mémorandums', icon: BookOpen, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal', moduleKey: 'memorandum' },
  { id: 'communication', label: 'Communication', icon: Megaphone, roles: ['admin'], group: 'principal', moduleKey: 'communication' },
  { id: 'profile', label: 'Mon profil', icon: User, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'principal' },
  
  // GESTION RH
  { id: 'employees', label: 'Gestion des agents', icon: Users, roles: ['admin', 'rh'], group: 'rh', moduleKey: 'employees' },
  { id: 'functions', label: 'Gestion des fonctions', icon: Briefcase, roles: ['admin'], group: 'rh', moduleKey: 'functions' },
  { id: 'leave-requests', label: 'Demandes de congés', icon: Calendar, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'rh', moduleKey: 'leaveRequests' },
  { id: 'organigramme', label: 'Organigramme', icon: Network, roles: ['admin', 'rh'], group: 'rh', moduleKey: 'organigramme' },
  { id: 'time-tracking', label: 'Pointage', icon: Clock, roles: ['admin', 'rh', 'agent'], group: 'rh', moduleKey: 'timeTracking' },
  
  // GESTION FINANCIERE
  { id: 'payroll', label: 'Bulletins de salaire', icon: FileText, roles: ['admin', 'rh', 'gestionnaire', 'agent'], group: 'finance', moduleKey: 'payroll' },
  { id: 'salary', label: 'Calcul des salaires', icon: DollarSign, roles: ['admin', 'gestionnaire'], group: 'finance', moduleKey: 'salary' },
  { id: 'projects', label: 'Gestion des projets', icon: FolderKanban, roles: ['admin', 'gestionnaire'], group: 'finance', moduleKey: 'projects' },
  
  // PARAMETRAGES
  { id: 'settings', label: 'Paramètres', icon: Settings, roles: ['admin'], group: 'parametrages' },
  { id: 'monitoring', label: 'Monitoring', icon: ChevronDown, roles: ['admin'], group: 'parametrages' },
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
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const { profile } = useSupabaseAuth();

  // Charger les paramètres au montage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await settingsService.getSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const filteredMenuItems = menuItems.filter(item => {
    // Vérifier les rôles
    if (!item.roles.includes(profile?.role || '')) {
      return false;
    }
    
    // Vérifier si le module est activé (sauf pour les éléments sans clé de module)
    if (item.moduleKey && settings?.modules) {
      return settings.modules[item.moduleKey];
    }
    
    return true;
  });

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
      {/* Header - aligné avec la hauteur du header principal */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between h-16">
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
    </div>
  );
};

export default Sidebar;
