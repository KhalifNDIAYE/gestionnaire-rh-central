
import { apiService } from './apiService';

export interface CommunicationAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'meeting' | 'news' | 'urgent';
  imageUrl?: string;
  meetingDate?: string;
  meetingLocation?: string;
  authorId: string;
  authorName: string;
  isActive: boolean;
  priority: number;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationSettings {
  carouselDuration: number; // en millisecondes
  autoplay: boolean;
}

// Mock data pour fallback
const mockAnnouncements: CommunicationAnnouncement[] = [
  {
    id: '1',
    title: 'Réunion mensuelle équipe',
    content: 'Réunion de présentation des résultats du mois et planification des objectifs.',
    type: 'meeting',
    imageUrl: '/placeholder.svg?height=200&width=400',
    meetingDate: '2024-06-10T14:00:00Z',
    meetingLocation: 'Salle de conférence A',
    authorId: 'comm1',
    authorName: 'Service Communication',
    isActive: true,
    priority: 1,
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z'
  },
  {
    id: '2',
    title: 'Nouvelle politique de télétravail',
    content: 'Mise en place de nouvelles règles pour le télétravail à partir du 15 juin.',
    type: 'info',
    imageUrl: '/placeholder.svg?height=200&width=400',
    authorId: 'comm1',
    authorName: 'Service Communication',
    isActive: true,
    priority: 2,
    expirationDate: '2024-06-30',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  },
  {
    id: '3',
    title: 'Succès du projet Alpha',
    content: 'Félicitations à toute l\'équipe pour la réussite du projet Alpha livré en avance.',
    type: 'news',
    authorId: 'comm1',
    authorName: 'Service Communication',
    isActive: true,
    priority: 3,
    createdAt: '2024-06-01T11:00:00Z',
    updatedAt: '2024-06-01T11:00:00Z'
  }
];

const defaultSettings: CommunicationSettings = {
  carouselDuration: 15000, // 15 secondes
  autoplay: true
};

export const communicationService = {
  async getActiveAnnouncements(): Promise<CommunicationAnnouncement[]> {
    try {
      const announcements = await apiService.get<CommunicationAnnouncement[]>('/communications/announcements?active=true');
      return announcements.sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.error('Error fetching announcements from API, using fallback:', error);
      return mockAnnouncements.filter(a => a.isActive).sort((a, b) => a.priority - b.priority);
    }
  },

  async createAnnouncement(announcement: Omit<CommunicationAnnouncement, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunicationAnnouncement> {
    try {
      const newAnnouncement = await apiService.post<CommunicationAnnouncement>('/communications/announcements', announcement);
      return newAnnouncement;
    } catch (error) {
      console.error('Error creating announcement via API:', error);
      throw new Error('Impossible de créer l\'annonce');
    }
  },

  async updateAnnouncement(id: string, announcement: Partial<CommunicationAnnouncement>): Promise<CommunicationAnnouncement> {
    try {
      const updatedAnnouncement = await apiService.put<CommunicationAnnouncement>(`/communications/announcements/${id}`, announcement);
      return updatedAnnouncement;
    } catch (error) {
      console.error('Error updating announcement via API:', error);
      throw new Error('Impossible de mettre à jour l\'annonce');
    }
  },

  async deleteAnnouncement(id: string): Promise<void> {
    try {
      await apiService.delete(`/communications/announcements/${id}`);
    } catch (error) {
      console.error('Error deleting announcement via API:', error);
      throw new Error('Impossible de supprimer l\'annonce');
    }
  },

  async getCommunicationSettings(): Promise<CommunicationSettings> {
    try {
      const settings = await apiService.get<CommunicationSettings>('/communications/settings');
      return settings;
    } catch (error) {
      console.error('Error fetching communication settings, using defaults:', error);
      return defaultSettings;
    }
  },

  async updateCommunicationSettings(settings: Partial<CommunicationSettings>): Promise<CommunicationSettings> {
    try {
      const updatedSettings = await apiService.put<CommunicationSettings>('/communications/settings', settings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating communication settings:', error);
      throw new Error('Impossible de mettre à jour les paramètres de communication');
    }
  }
};
