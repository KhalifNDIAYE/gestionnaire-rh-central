
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
  const announcementRef = useRef<HTMLDivElement>(null);

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
      {!isAnnouncementFullscreen && (
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
              onClick={toggleAnnouncementFullscreen}
              className={`${isAndroidTV ? 'text-lg px-6 py-3' : ''}`}
            >
              {isAnnouncementFullscreen ? (
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
      )}

      {/* Indication pour le plein écran */}
      {!isAnnouncementFullscreen && !isAndroidTV && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
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
        />
      </div>

      {/* Bouton de connexion pour les employés (masqué sur Android TV et en plein écran) */}
      {!isAndroidTV && !isAnnouncementFullscreen && (
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
