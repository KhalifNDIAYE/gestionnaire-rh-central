
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { communicationService, CommunicationAnnouncement, CommunicationSettings } from '../../services/communicationService';
import { Calendar, MapPin, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Autoplay from "embla-carousel-autoplay";

const AnnouncementCarousel = () => {
  const [announcements, setAnnouncements] = useState<CommunicationAnnouncement[]>([]);
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [announcementsData, settingsData] = await Promise.all([
          communicationService.getActiveAnnouncements(),
          communicationService.getCommunicationSettings()
        ]);
        setAnnouncements(announcementsData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // S'abonner aux changements en temps réel
    const unsubscribeAnnouncements = communicationService.subscribeToAnnouncements(setAnnouncements);
    const unsubscribeSettings = communicationService.subscribeToSettings(setSettings);

    return () => {
      unsubscribeAnnouncements();
      unsubscribeSettings();
    };
  }, []);

  const getTypeColor = (type: CommunicationAnnouncement['type']) => {
    switch (type) {
      case 'urgent':
        return 'destructive';
      case 'meeting':
        return 'default';
      case 'news':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: CommunicationAnnouncement['type']) => {
    switch (type) {
      case 'urgent':
        return 'Urgent';
      case 'meeting':
        return 'Réunion';
      case 'news':
        return 'Actualité';
      case 'info':
        return 'Information';
      default:
        return 'Info';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue dans l'administration du système RH
        </h2>
        <p className="text-gray-600">
          Aucune annonce active pour le moment.
        </p>
      </div>
    );
  }

  // Configuration des plugins du carrousel
  const carouselPlugins = [];
  if (settings?.autoplay) {
    carouselPlugins.push(
      Autoplay({
        delay: settings.carouselDuration || 20000,
      })
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
      <Carousel 
        className="w-full"
        plugins={carouselPlugins}
      >
        <CarouselContent>
          {announcements.map((announcement) => (
            <CarouselItem key={announcement.id}>
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Contenu textuel */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getTypeColor(announcement.type)}>
                          {getTypeLabel(announcement.type)}
                        </Badge>
                        {announcement.type === 'urgent' && (
                          <Badge variant="destructive" className="animate-pulse">
                            🚨 Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {announcement.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-3">
                        {announcement.content}
                      </p>

                      {/* Informations de réunion */}
                      {announcement.type === 'meeting' && announcement.meetingDate && (
                        <div className="flex flex-col sm:flex-row gap-2 mb-3">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(announcement.meetingDate), 'PPP à HH:mm', { locale: fr })}
                          </div>
                          {announcement.meetingLocation && (
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <MapPin className="h-4 w-4" />
                              {announcement.meetingLocation}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Métadonnées */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {announcement.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(announcement.createdAt), 'PPP', { locale: fr })}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    {announcement.imageUrl && (
                      <div className="lg:w-1/3">
                        <img
                          src={announcement.imageUrl}
                          alt={announcement.title}
                          className="w-full h-32 lg:h-40 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {announcements.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Indicateurs */}
      {announcements.length > 1 && (
        <div className="flex justify-center mt-4 gap-1">
          {announcements.map((_, index) => (
            <div
              key={index}
              className="h-1.5 w-6 bg-gray-300 rounded-full opacity-50"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementCarousel;
