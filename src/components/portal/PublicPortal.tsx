import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { communicationService, CommunicationAnnouncement, CommunicationSettings } from '../../services/communicationService';
import { Calendar, MapPin, Clock, User, LogIn, Tv, Maximize, Minimize } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Autoplay from "embla-carousel-autoplay";

interface PublicPortalProps {
  onLoginClick: () => void;
  isAndroidTV?: boolean;
}

const PublicPortal = ({ onLoginClick, isAndroidTV = false }: PublicPortalProps) => {
  const [announcements, setAnnouncements] = useState<CommunicationAnnouncement[]>([]);
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    
    // Actualiser les données toutes les 5 minutes
    const dataInterval = setInterval(loadData, 5 * 60 * 1000);
    
    // Mettre à jour l'heure toutes les secondes
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Gestion du plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Proposition automatique du plein écran pour Android TV
    if (isAndroidTV && !document.fullscreenElement) {
      const timer = setTimeout(() => {
        enterFullscreen();
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isAndroidTV]);

  // Gestion des touches clavier pour le plein écran
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
      }
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.log('Fullscreen not supported or permission denied');
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log('Exit fullscreen failed');
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

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

  // Configuration des plugins du carrousel pour Android TV
  const carouselPlugins = [];
  if (settings?.autoplay) {
    carouselPlugins.push(
      Autoplay({
        delay: isAndroidTV ? 10000 : (settings.carouselDuration || 15000), // Plus lent sur TV
      })
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isAndroidTV ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-4`}>
        <div className="animate-pulse text-center">
          <div className={`h-8 ${isAndroidTV ? 'bg-gray-700' : 'bg-gray-200'} rounded w-64 mb-4 mx-auto`}></div>
          <div className={`h-4 ${isAndroidTV ? 'bg-gray-700' : 'bg-gray-200'} rounded w-48 mx-auto`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isAndroidTV ? 'bg-black text-white p-8' : 'bg-gradient-to-br from-blue-50 to-indigo-100 p-4'}`}>
      {/* Header avec logo, heure et bouton plein écran */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`inline-flex items-center justify-center ${isAndroidTV ? 'w-20 h-20' : 'w-16 h-16'} bg-blue-600 rounded-full`}>
            {isAndroidTV ? <Tv className="w-10 h-10 text-white" /> : <User className="w-8 h-8 text-white" />}
          </div>
          <div>
            <h1 className={`${isAndroidTV ? 'text-5xl' : 'text-3xl'} font-bold ${isAndroidTV ? 'text-white' : 'text-gray-900'}`}>
              RH Management
            </h1>
            <p className={`${isAndroidTV ? 'text-xl text-gray-300' : 'text-gray-600'}`}>
              Portail d'Information
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Bouton plein écran */}
          <Button
            variant={isAndroidTV ? "secondary" : "outline"}
            size={isAndroidTV ? "lg" : "default"}
            onClick={toggleFullscreen}
            className={`${isAndroidTV ? 'text-lg px-6 py-3' : ''}`}
          >
            {isFullscreen ? (
              <>
                <Minimize className={`${isAndroidTV ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
                {!isAndroidTV && "Quitter"}
              </>
            ) : (
              <>
                <Maximize className={`${isAndroidTV ? 'w-6 h-6' : 'w-4 h-4'} mr-2`} />
                {!isAndroidTV && "Plein écran"}
              </>
            )}
          </Button>
          
          {/* Heure */}
          <div className="text-right">
            <div className={`${isAndroidTV ? 'text-3xl' : 'text-2xl'} font-bold ${isAndroidTV ? 'text-white' : 'text-gray-900'}`}>
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className={`${isAndroidTV ? 'text-lg text-gray-300' : 'text-gray-600'}`}>
              {format(currentTime, 'EEEE d MMMM yyyy', { locale: fr })}
            </div>
          </div>
        </div>
      </div>

      {/* Indication pour le plein écran */}
      {!isFullscreen && !isAndroidTV && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
            💡 Appuyez sur <kbd className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">F11</kbd> ou utilisez le bouton pour passer en plein écran
          </p>
        </div>
      )}

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto">
        {announcements.length === 0 ? (
          <Card className={`${isAndroidTV ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
            <CardContent className="p-12 text-center">
              <h2 className={`${isAndroidTV ? 'text-4xl text-white' : 'text-2xl text-gray-900'} font-bold mb-4`}>
                Bienvenue sur le portail RH
              </h2>
              <p className={`${isAndroidTV ? 'text-xl text-gray-300' : 'text-gray-600'}`}>
                Aucune annonce disponible pour le moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className={`${isAndroidTV ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
            <CardContent className="p-8">
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
                            <Badge variant={getTypeColor(announcement.type)} className={isAndroidTV ? 'text-lg px-4 py-2' : ''}>
                              {getTypeLabel(announcement.type)}
                            </Badge>
                            {announcement.type === 'urgent' && (
                              <Badge variant="destructive" className={`animate-pulse ${isAndroidTV ? 'text-lg px-4 py-2' : ''}`}>
                                🚨 Urgent
                              </Badge>
                            )}
                          </div>
                          
                          <h2 className={`${isAndroidTV ? 'text-4xl text-white' : 'text-3xl text-gray-900'} font-bold mb-4`}>
                            {announcement.title}
                          </h2>
                          
                          <p className={`${isAndroidTV ? 'text-xl text-gray-300' : 'text-lg text-gray-600'} mb-6 leading-relaxed`}>
                            {announcement.content}
                          </p>

                          {/* Informations de réunion */}
                          {announcement.type === 'meeting' && announcement.meetingDate && (
                            <div className="flex flex-col gap-3 mb-6">
                              <div className={`flex items-center gap-2 ${isAndroidTV ? 'text-lg text-gray-300' : 'text-gray-700'}`}>
                                <Calendar className={`${isAndroidTV ? 'h-6 w-6' : 'h-5 w-5'}`} />
                                {format(new Date(announcement.meetingDate), 'PPP à HH:mm', { locale: fr })}
                              </div>
                              {announcement.meetingLocation && (
                                <div className={`flex items-center gap-2 ${isAndroidTV ? 'text-lg text-gray-300' : 'text-gray-700'}`}>
                                  <MapPin className={`${isAndroidTV ? 'h-6 w-6' : 'h-5 w-5'}`} />
                                  {announcement.meetingLocation}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Métadonnées */}
                          <div className={`flex items-center gap-6 ${isAndroidTV ? 'text-base text-gray-400' : 'text-sm text-gray-500'}`}>
                            <div className="flex items-center gap-2">
                              <User className={`${isAndroidTV ? 'h-5 w-5' : 'h-4 w-4'}`} />
                              {announcement.authorName}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className={`${isAndroidTV ? 'h-5 w-5' : 'h-4 w-4'}`} />
                              {format(new Date(announcement.createdAt), 'PPP', { locale: fr })}
                            </div>
                          </div>
                        </div>

                        {/* Image */}
                        {announcement.imageUrl && (
                          <div className={`${isAndroidTV ? 'lg:w-2/5' : 'lg:w-1/3'}`}>
                            <img
                              src={announcement.imageUrl}
                              alt={announcement.title}
                              className={`w-full ${isAndroidTV ? 'h-64 lg:h-80' : 'h-48 lg:h-64'} object-cover rounded-lg`}
                            />
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {announcements.length > 1 && !isAndroidTV && (
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
                      className={`${isAndroidTV ? 'h-3 w-12' : 'h-2 w-8'} ${isAndroidTV ? 'bg-gray-600' : 'bg-gray-300'} rounded-full opacity-50`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bouton de connexion pour les employés (masqué sur Android TV) */}
      {!isAndroidTV && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={onLoginClick}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Connexion Employés
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicPortal;
