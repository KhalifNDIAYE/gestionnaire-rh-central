
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { communicationService, CommunicationAnnouncement, CommunicationSettings } from '../../services/communicationService';
import { User, LogIn, Tv, Maximize, Minimize } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AnnouncementSection from './AnnouncementSection';

interface PublicPortalProps {
  onLoginClick: () => void;
  isAndroidTV?: boolean;
}

const PublicPortal = ({ onLoginClick, isAndroidTV = false }: PublicPortalProps) => {
  const [announcements, setAnnouncements] = useState<CommunicationAnnouncement[]>([]);
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnnouncementFullscreen, setIsAnnouncementFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Détection du type d'appareil
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      const isTabletDevice = width >= 768 && width < 1024;
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

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

  // Gestion des touches clavier pour le plein écran
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        event.preventDefault();
        toggleAnnouncementFullscreen();
      }
      if (event.key === 'Escape' && isAnnouncementFullscreen) {
        setIsAnnouncementFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isAnnouncementFullscreen]);

  const toggleAnnouncementFullscreen = () => {
    setIsAnnouncementFullscreen(!isAnnouncementFullscreen);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isAndroidTV ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-2 sm:p-4`}>
        <div className="animate-pulse text-center">
          <div className={`h-6 sm:h-8 ${isAndroidTV ? 'bg-gray-700' : 'bg-gray-200'} rounded w-48 sm:w-64 mb-4 mx-auto`}></div>
          <div className={`h-3 sm:h-4 ${isAndroidTV ? 'bg-gray-700' : 'bg-gray-200'} rounded w-36 sm:w-48 mx-auto`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isAndroidTV ? 'bg-black text-white p-4 sm:p-6 lg:p-8' : 'bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4'}`}>
      {/* Header avec logo, heure et bouton plein écran */}
      {!isAnnouncementFullscreen && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 lg:mb-8 gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`inline-flex items-center justify-center ${
              isAndroidTV 
                ? 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20' 
                : 'w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16'
            } bg-blue-600 rounded-full`}>
              {isAndroidTV ? (
                <Tv className={`${isMobile ? 'w-6 h-6' : isTablet ? 'w-8 h-8' : 'w-10 h-10'} text-white`} />
              ) : (
                <User className={`${isMobile ? 'w-5 h-5' : isTablet ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className={`${
                isMobile 
                  ? 'text-xl sm:text-2xl' 
                  : isTablet 
                    ? 'text-2xl lg:text-3xl' 
                    : isAndroidTV 
                      ? 'text-3xl lg:text-4xl xl:text-5xl' 
                      : 'text-2xl lg:text-3xl'
              } font-bold ${isAndroidTV ? 'text-white' : 'text-gray-900'}`}>
                RH Management
              </h1>
              <p className={`${
                isMobile 
                  ? 'text-sm' 
                  : isTablet 
                    ? 'text-base' 
                    : isAndroidTV 
                      ? 'text-lg lg:text-xl' 
                      : 'text-base'
              } ${isAndroidTV ? 'text-gray-300' : 'text-gray-600'}`}>
                Portail d'Information
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            {/* Bouton plein écran */}
            <Button
              variant={isAndroidTV ? "secondary" : "outline"}
              size={isMobile ? "sm" : isAndroidTV ? "lg" : "default"}
              onClick={toggleAnnouncementFullscreen}
              className={`${isMobile ? 'text-xs px-3 py-2' : isAndroidTV ? 'text-base lg:text-lg px-4 lg:px-6 py-2 lg:py-3' : ''}`}
            >
              {isAnnouncementFullscreen ? (
                <>
                  <Minimize className={`${isMobile ? 'w-3 h-3' : isAndroidTV ? 'w-5 h-5 lg:w-6 lg:h-6' : 'w-4 h-4'} mr-1 sm:mr-2`} />
                  {!isMobile && "Quitter"}
                </>
              ) : (
                <>
                  <Maximize className={`${isMobile ? 'w-3 h-3' : isAndroidTV ? 'w-5 h-5 lg:w-6 lg:h-6' : 'w-4 h-4'} mr-1 sm:mr-2`} />
                  {!isMobile && "Plein écran"}
                </>
              )}
            </Button>
            
            {/* Heure */}
            <div className="text-center sm:text-right">
              <div className={`${
                isMobile 
                  ? 'text-lg' 
                  : isTablet 
                    ? 'text-xl' 
                    : isAndroidTV 
                      ? 'text-2xl lg:text-3xl' 
                      : 'text-xl lg:text-2xl'
              } font-bold ${isAndroidTV ? 'text-white' : 'text-gray-900'}`}>
                {format(currentTime, 'HH:mm:ss')}
              </div>
              <div className={`${
                isMobile 
                  ? 'text-xs' 
                  : isTablet 
                    ? 'text-sm' 
                    : isAndroidTV 
                      ? 'text-base lg:text-lg' 
                      : 'text-sm lg:text-base'
              } ${isAndroidTV ? 'text-gray-300' : 'text-gray-600'}`}>
                {format(currentTime, isMobile ? 'dd/MM/yyyy' : 'EEEE d MMMM yyyy', { locale: fr })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indication pour le plein écran */}
      {!isAnnouncementFullscreen && !isAndroidTV && !isMobile && (
        <div className="mb-4 text-center">
          <p className="text-xs sm:text-sm text-gray-600 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg inline-block">
            💡 Appuyez sur <kbd className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">F11</kbd> ou utilisez le bouton pour passer les annonces en plein écran
          </p>
        </div>
      )}

      {/* Section des annonces */}
      <div className={`${isAnnouncementFullscreen ? '' : 'max-w-7xl mx-auto'}`} ref={announcementRef}>
        <AnnouncementSection 
          announcements={announcements}
          settings={settings}
          isAndroidTV={isAndroidTV}
          isFullscreen={isAnnouncementFullscreen}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </div>

      {/* Bouton de connexion pour les employés (masqué sur Android TV et en plein écran) */}
      {!isAndroidTV && !isAnnouncementFullscreen && (
        <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'}`}>
          <Button
            onClick={onLoginClick}
            size={isMobile ? "default" : "lg"}
            className={`shadow-lg hover:shadow-xl transition-shadow ${
              isMobile ? 'text-sm px-3 py-2' : ''
            }`}
          >
            <LogIn className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
            {isMobile ? "Connexion" : "Connexion Employés"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicPortal;
