import { useState } from 'react';
import { Settings, Palette, Layout, Save, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDashboardPreferences, DashboardTheme } from '@/hooks/useDashboardPreferences';

const themes: DashboardTheme[] = [
  {
    id: 'default',
    name: 'Par défaut',
    primaryColor: 'hsl(222.2 47.4% 11.2%)',
    accentColor: 'hsl(210 40% 96.1%)',
    background: 'hsl(0 0% 100%)',
    cardStyle: 'default'
  },
  {
    id: 'modern',
    name: 'Moderne',
    primaryColor: 'hsl(263 70% 50%)',
    accentColor: 'hsl(263 70% 95%)',
    background: 'hsl(270 20% 98%)',
    cardStyle: 'minimal'
  },
  {
    id: 'corporate',
    name: 'Entreprise',
    primaryColor: 'hsl(210 100% 45%)',
    accentColor: 'hsl(210 100% 95%)',
    background: 'hsl(210 20% 98%)',
    cardStyle: 'default'
  },
  {
    id: 'glass',
    name: 'Verre',
    primaryColor: 'hsl(180 100% 50%)',
    accentColor: 'hsl(180 100% 95%)',
    background: 'linear-gradient(135deg, hsl(210 100% 97%), hsl(180 100% 97%))',
    cardStyle: 'glassmorphism'
  }
];

interface DashboardCustomizerProps {
  children: React.ReactNode;
}

export const DashboardCustomizer = ({ children }: DashboardCustomizerProps) => {
  const { preferences, updatePreferences, saveCustomView, applyCustomView } = useDashboardPreferences();
  const [newViewName, setNewViewName] = useState('');

  const handleThemeChange = (themeId: string) => {
    updatePreferences({ theme: themeId });
    
    // Appliquer le thème immédiatement
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.primaryColor.replace('hsl(', '').replace(')', ''));
      root.style.setProperty('--accent', theme.accentColor.replace('hsl(', '').replace(')', ''));
      root.style.setProperty('--background', theme.background.replace('hsl(', '').replace(')', ''));
    }
  };

  const handleWidgetToggle = (widgetId: string, enabled: boolean) => {
    const updatedWidgets = preferences.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, enabled } : widget
    );
    updatePreferences({ widgets: updatedWidgets });
  };

  const handleSaveView = () => {
    if (newViewName.trim()) {
      saveCustomView(newViewName, {
        theme: preferences.theme,
        layout: preferences.layout,
        widgets: preferences.widgets,
        filters: preferences.filters
      });
      setNewViewName('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Personnaliser le tableau de bord
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Thèmes
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Disposition
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="views" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thèmes disponibles</CardTitle>
                <CardDescription>
                  Choisissez un thème pour personnaliser l'apparence de votre tableau de bord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        preferences.theme === theme.id
                          ? 'border-primary shadow-md'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{theme.name}</h4>
                        {preferences.theme === theme.id && (
                          <Badge variant="default">Actuel</Badge>
                        )}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Style: {theme.cardStyle}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Disposition du tableau de bord</CardTitle>
                <CardDescription>
                  Configurez la disposition et l'organisation de vos widgets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="layout">Type de disposition</Label>
                  <Select
                    value={preferences.layout}
                    onValueChange={(value: any) => updatePreferences({ layout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une disposition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grille</SelectItem>
                      <SelectItem value="masonry">Maçonnerie</SelectItem>
                      <SelectItem value="compact">Compacte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des widgets</CardTitle>
                <CardDescription>
                  Activez ou désactivez les widgets selon vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {preferences.widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`widget-${widget.id}`} className="font-medium">
                        {widget.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Type: {widget.type}
                      </p>
                    </div>
                    <Switch
                      id={`widget-${widget.id}`}
                      checked={widget.enabled}
                      onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="views" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vues personnalisées</CardTitle>
                <CardDescription>
                  Sauvegardez et réutilisez vos configurations favorites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de la vue"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                  />
                  <Button onClick={handleSaveView} disabled={!newViewName.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Vues sauvegardées</Label>
                  {preferences.customViews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune vue personnalisée sauvegardée
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {preferences.customViews.map((view) => (
                        <div key={view.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{view.name}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyCustomView(view.id)}
                          >
                            Appliquer
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};