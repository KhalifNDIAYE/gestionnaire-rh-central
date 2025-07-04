
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnnouncementCarousel from '../components/communication/AnnouncementCarousel';
import AnnouncementManager from '../components/communication/AnnouncementManager';
import { Megaphone, Settings } from 'lucide-react';

const CommunicationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
        <p className="text-gray-600">Gérez les annonces et le carrousel de communication</p>
      </div>

      <Tabs defaultValue="carousel" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="carousel" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Carrousel d'annonces
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Gestion des annonces
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="carousel" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Aperçu du carrousel</h2>
            <AnnouncementCarousel />
          </div>
        </TabsContent>
        
        <TabsContent value="management" className="space-y-4">
          <AnnouncementManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationPage;
