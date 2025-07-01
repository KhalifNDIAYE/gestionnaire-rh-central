
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
  isMobile?: boolean;
  isTablet?: boolean;
}

const AnnouncementSection = ({ 
  announcements, 
  settings, 
  isAndroidTV = false, 
  isFullscreen = false,
  isMobile = false,
  isTablet = false
}: AnnouncementSectionProps) => {
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

  // Styles responsifs
  const getResponsiveStyles = () => {
    if (isFullscreen) {
      return {
        container: 'fixed inset-0 z-50 bg-black',
        padding: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8 lg:p-12',
        titleSize: isMobile 
          ? 'text-2xl sm:text-3xl' 
          : isTablet 
            ? 'text-4xl lg:text-5xl' 
            : 'text-5xl lg:text-6xl xl:text-7xl',
        contentSize: isMobile 
          ? 'text-base sm:text-lg' 
          : isTablet 
            ? 'text-xl lg:text-2xl' 
            : 'text-2xl lg:text-3xl',
        badgeSize: isMobile 
          ? 'text-sm px-3 py-1' 
          : isTablet 
            ? 'text-lg px-4 py-2' 
            : 'text-xl lg:text-2xl px-6 py-3',
        iconSize: isMobile ? 'h-5 w-5' : isTablet ? 'h-6 w-6 lg:h-8 lg:w-8' : 'h-8 w-8 lg:h-10 lg:w-10',
        metaSize: isMobile 
          ? 'text-sm' 
          : isTablet 
            ? 'text-base lg:text-lg' 
            : 'text-lg lg:text-xl',
        imageHeight: isMobile 
          ? 'h-48 sm:h-56' 
          : isTablet 
            ? 'h-64 lg:h-80' 
            : 'h-80 lg:h-96 xl:h-[28rem]'
      };
    }

    if (isAndroidTV) {
      return {
        container: 'bg-gray-800 border-gray-700',
        padding: 'p-4 sm:p-6 lg:p-8',
        titleSize: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white',
        contentSize: 'text-lg sm:text-xl lg:text-2xl text-gray-300',
        badgeSize: 'text-base sm:text-lg lg:text-2xl px-4 sm:px-6 py-2 sm:py-3',
        iconSize: 'h-6 w-6 sm:h-8 sm:w-8',
        metaSize: 'text-base sm:text-lg lg:text-xl text-gray-400',
        imageHeight: 'h-64 sm:h-80 lg:h-96'
      };
    }

    return {
      container: 'bg-white',
      padding: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-6 lg:p-8',
      titleSize: isMobile 
        ? 'text-xl sm:text-2xl text-gray-900' 
        : isTablet 
          ? 'text-2xl lg:text-3xl text-gray-900' 
          : 'text-2xl lg:text-3xl text-gray-900',
      contentSize: isMobile 
        ? 'text-sm sm:text-base text-gray-600' 
        : isTablet 
          ? 'text-base lg:text-lg text-gray-600' 
          : 'text-base lg:text-lg text-gray-600',
      badgeSize: isMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1',
      iconSize: isMobile ? 'h-4 w-4' : 'h-5 w-5',
      metaSize: isMobile ? 'text-xs text-gray-500' : 'text-sm text-gray-500',
      imageHeight: isMobile 
        ? 'h-32 sm:h-40' 
        : isTablet 
          ? 'h-48 lg:h-56' 
          : 'h-48 lg:h-64'
    };
  };

  const styles = getResponsiveStyles();

  if (announcements.length === 0) {
    return (
      <Card className={`${styles.container} shadow-xl ${isFullscreen ? 'rounded-none border-none' : ''}`}>
        <CardContent className={`${styles.padding} text-center flex items-center justify-center ${isFullscreen ? 'h-full' : ''}`}>
          <div>
            <h2 className={styles.titleSize}>
              Bienvenue sur le portail RH
            </h2>
            <p className={styles.contentSize}>
              Aucune annonce disponible pour le moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${styles.container} shadow-xl ${isFullscreen ? 'rounded-none border-none' : ''}`}>
      <CardContent className={`${styles.padding} ${isFullscreen ? 'h-full flex items-center' : ''}`}>
        <div className={isFullscreen ? 'w-full' : ''}>
          <Carousel 
            className="w-full"
            plugins={carouselPlugins}
          >
            <CarouselContent>
              {announcements.map((announcement) => (
                <CarouselItem key={announcement.id}>
                  <div className={`flex flex-col ${isMobile ? 'gap-4' : isTablet ? 'gap-6 lg:flex-row' : 'lg:flex-row gap-6'}`}>
                    {/* Contenu textuel */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <Badge variant={getTypeColor(announcement.type)} className={styles.badgeSize}>
                          {getTypeLabel(announcement.type)}
                        </Badge>
                        {announcement.type === 'urgent' && (
                          <Badge variant="destructive" className={`animate-pulse ${styles.badgeSize}`}>
                            🚨 Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <h2 className={`${styles.titleSize} font-bold mb-3 sm:mb-4 leading-tight`}>
                        {announcement.title}
                      </h2>
                      
                      <p className={`${styles.contentSize} mb-4 sm:mb-6 leading-relaxed`}>
                        {announcement.content}
                      </p>

                      {/* Informations de réunion */}
                      {announcement.type === 'meeting' && announcement.meetingDate && (
                        <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
                          <div className={`flex items-center gap-2 ${styles.metaSize.includes('text-gray') ? styles.metaSize : `${styles.metaSize} ${isAndroidTV || isFullscreen ? 'text-gray-300' : 'text-gray-700'}`}`}>
                            <Calendar className={styles.iconSize} />
                            <span className={isMobile ? 'text-xs' : ''}>
                              {format(new Date(announcement.meetingDate), isMobile ? 'dd/MM à HH:mm' : 'PPP à HH:mm', { locale: fr })}
                            </span>
                          </div>
                          {announcement.meetingLocation && (
                            <div className={`flex items-center gap-2 ${styles.metaSize.includes('text-gray') ? styles.metaSize : `${styles.metaSize} ${isAndroidTV || isFullscreen ? 'text-gray-300' : 'text-gray-700'}`}`}>
                              <MapPin className={styles.iconSize} />
                              <span className={isMobile ? 'text-xs' : ''}>{announcement.meetingLocation}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Métadonnées */}
                      <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 ${styles.metaSize}`}>
                        <div className="flex items-center gap-2">
                          <User className={styles.iconSize} />
                          <span>{announcement.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={styles.iconSize} />
                          <span>{format(new Date(announcement.createdAt), isMobile ? 'dd/MM/yyyy' : 'PPP', { locale: fr })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    {announcement.imageUrl && (
                      <div className={`${
                        isMobile 
                          ? 'w-full' 
                          : isTablet 
                            ? 'lg:w-2/5' 
                            : isAndroidTV || isFullscreen 
                              ? 'lg:w-2/5' 
                              : 'lg:w-1/3'
                      } flex-shrink-0`}>
                        <img
                          src={announcement.imageUrl}
                          alt={announcement.title}
                          className={`w-full ${styles.imageHeight} object-cover rounded-lg`}
                        />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {announcements.length > 1 && !isAndroidTV && !isFullscreen && !isMobile && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>

          {/* Indicateurs */}
          {announcements.length > 1 && (
            <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2">
              {announcements.map((_, index) => (
                <div
                  key={index}
                  className={`${
                    isMobile 
                      ? 'h-2 w-6' 
                      : isAndroidTV || isFullscreen 
                        ? 'h-3 sm:h-4 w-12 sm:w-16' 
                        : 'h-2 w-8'
                  } ${
                    isAndroidTV || isFullscreen ? 'bg-gray-600' : 'bg-gray-300'
                  } rounded-full opacity-50`}
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
