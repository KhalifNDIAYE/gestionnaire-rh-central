
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CommunicationAnnouncement, CommunicationSettings } from '../../services/communicationService';
import { Calendar, MapPin, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Autoplay from "embla-carousel-autoplay";

interface AnnouncementSectionProps {
  announcements: CommunicationAnnouncement[];
  settings: CommunicationSettings | null;
  isAndroidTV?: boolean;
  isFullscreen?: boolean;
}

const AnnouncementSection = ({ announcements, settings, isAndroidTV = false, isFullscreen = false }: AnnouncementSectionProps) => {
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

  // Configuration des plugins du carrousel
  const carouselPlugins = [];
  if (settings?.autoplay) {
    carouselPlugins.push(
      Autoplay({
        delay: isAndroidTV ? 10000 : (settings.carouselDuration || 15000),
      })
    );
  }

  // Styles pour le mode plein écran
  const fullscreenStyles = isFullscreen ? 'fixed inset-0 z-50 bg-black' : '';
  const contentPadding = isFullscreen ? 'p-12' : 'p-8';
  const textScale = isFullscreen ? 'scale-125' : '';

  if (announcements.length === 0) {
    return (
      <div className={`${fullscreenStyles} ${isAndroidTV ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
        <div className={`${contentPadding} text-center flex items-center justify-center ${isFullscreen ? 'h-full' : ''}`}>
          <div className={textScale}>
            <h2 className={`${isAndroidTV || isFullscreen ? 'text-6xl text-white' : 'text-2xl text-gray-900'} font-bold mb-4`}>
              Bienvenue sur le portail RH
            </h2>
            <p className={`${isAndroidTV || isFullscreen ? 'text-2xl text-gray-300' : 'text-gray-600'}`}>
              Aucune annonce disponible pour le moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`${fullscreenStyles} ${isAndroidTV ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl ${isFullscreen ? 'rounded-none border-none' : ''}`}>
      <CardContent className={`${contentPadding} ${isFullscreen ? 'h-full flex items-center' : ''}`}>
        <div className={`${textScale} ${isFullscreen ? 'w-full' : ''}`}>
          <Carousel 
            className="w-full"
            plugins={carouselPlugins}
          >
            <CarouselContent>
              {announcements.map((announcement) => (
                <CarouselItem key={announcement.id}>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Contenu textuel */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant={getTypeColor(announcement.type)} className={isAndroidTV || isFullscreen ? 'text-2xl px-6 py-3' : ''}>
                          {getTypeLabel(announcement.type)}
                        </Badge>
                        {announcement.type === 'urgent' && (
                          <Badge variant="destructive" className={`animate-pulse ${isAndroidTV || isFullscreen ? 'text-2xl px-6 py-3' : ''}`}>
                            🚨 Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <h2 className={`${isAndroidTV || isFullscreen ? 'text-6xl text-white' : 'text-3xl text-gray-900'} font-bold mb-4`}>
                        {announcement.title}
                      </h2>
                      
                      <p className={`${isAndroidTV || isFullscreen ? 'text-2xl text-gray-300' : 'text-lg text-gray-600'} mb-6 leading-relaxed`}>
                        {announcement.content}
                      </p>

                      {/* Informations de réunion */}
                      {announcement.type === 'meeting' && announcement.meetingDate && (
                        <div className="flex flex-col gap-3 mb-6">
                          <div className={`flex items-center gap-2 ${isAndroidTV || isFullscreen ? 'text-xl text-gray-300' : 'text-gray-700'}`}>
                            <Calendar className={`${isAndroidTV || isFullscreen ? 'h-8 w-8' : 'h-5 w-5'}`} />
                            {format(new Date(announcement.meetingDate), 'PPP à HH:mm', { locale: fr })}
                          </div>
                          {announcement.meetingLocation && (
                            <div className={`flex items-center gap-2 ${isAndroidTV || isFullscreen ? 'text-xl text-gray-300' : 'text-gray-700'}`}>
                              <MapPin className={`${isAndroidTV || isFullscreen ? 'h-8 w-8' : 'h-5 w-5'}`} />
                              {announcement.meetingLocation}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Métadonnées */}
                      <div className={`flex items-center gap-6 ${isAndroidTV || isFullscreen ? 'text-lg text-gray-400' : 'text-sm text-gray-500'}`}>
                        <div className="flex items-center gap-2">
                          <User className={`${isAndroidTV || isFullscreen ? 'h-6 w-6' : 'h-4 w-4'}`} />
                          {announcement.authorName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`${isAndroidTV || isFullscreen ? 'h-6 w-6' : 'h-4 w-4'}`} />
                          {format(new Date(announcement.createdAt), 'PPP', { locale: fr })}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    {announcement.imageUrl && (
                      <div className={`${isAndroidTV || isFullscreen ? 'lg:w-2/5' : 'lg:w-1/3'}`}>
                        <img
                          src={announcement.imageUrl}
                          alt={announcement.title}
                          className={`w-full ${isAndroidTV || isFullscreen ? 'h-80 lg:h-96' : 'h-48 lg:h-64'} object-cover rounded-lg`}
                        />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {announcements.length > 1 && !isAndroidTV && !isFullscreen && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>

          {/* Indicateurs */}
          {announcements.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {announcements.map((_, index) => (
                <div
                  key={index}
                  className={`${isAndroidTV || isFullscreen ? 'h-4 w-16' : 'h-2 w-8'} ${isAndroidTV || isFullscreen ? 'bg-gray-600' : 'bg-gray-300'} rounded-full opacity-50`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementSection;
