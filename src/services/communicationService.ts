
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
let mockAnnouncements: CommunicationAnnouncement[] = [
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

let mockSettings: CommunicationSettings = {
  carouselDuration: 15000, // 15 secondes
  autoplay: true
};

export const communicationService = {
  async getActiveAnnouncements(): Promise<CommunicationAnnouncement[]> {
    try {
      const announcements = await apiService.get<CommunicationAnnouncement[]>('/communications/announcements?active=true');
      return announcements.sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.log('Using mock data for announcements');
      return mockAnnouncements.filter(a => a.isActive).sort((a, b) => a.priority - b.priority);
    }
  },

  async createAnnouncement(announcement: Omit<CommunicationAnnouncement, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunicationAnnouncement> {
    try {
      const newAnnouncement = await apiService.post<CommunicationAnnouncement>('/communications/announcements', announcement);
      return newAnnouncement;
    } catch (error) {
      console.log('Using mock data for creating announcement');
      
      // Créer une nouvelle annonce avec des données mock
      const newAnnouncement: CommunicationAnnouncement = {
        ...announcement,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Ajouter à la liste mock
      mockAnnouncements.push(newAnnouncement);
      
      return newAnnouncement;
    }
  },

  async updateAnnouncement(id: string, announcement: Partial<CommunicationAnnouncement>): Promise<CommunicationAnnouncement> {
    try {
      const updatedAnnouncement = await apiService.put<CommunicationAnnouncement>(`/communications/announcements/${id}`, announcement);
      return updatedAnnouncement;
    } catch (error) {
      console.log('Using mock data for updating announcement');
      
      // Trouver et mettre à jour l'annonce dans les données mock
      const index = mockAnnouncements.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAnnouncements[index] = {
          ...mockAnnouncements[index],
          ...announcement,
          updatedAt: new Date().toISOString()
        };
        return mockAnnouncements[index];
      }
      
      throw new Error('Annonce non trouvée');
    }
  },

  async deleteAnnouncement(id: string): Promise<void> {
    try {
      await apiService.delete(`/communications/announcements/${id}`);
    } catch (error) {
      console.log('Using mock data for deleting announcement');
      
      // Supprimer de la liste mock
      const index = mockAnnouncements.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAnnouncements.splice(index, 1);
      }
    }
  },

  async getCommunicationSettings(): Promise<CommunicationSettings> {
    try {
      const settings = await apiService.get<CommunicationSettings>('/communications/settings');
      return settings;
    } catch (error) {
      console.log('Using mock data for communication settings');
      return mockSettings;
    }
  },

  async updateCommunicationSettings(settings: Partial<CommunicationSettings>): Promise<CommunicationSettings> {
    try {
      const updatedSettings = await apiService.put<CommunicationSettings>('/communications/settings', settings);
      return updatedSettings;
    } catch (error) {
      console.log('Using mock data for updating communication settings');
      
      // Mettre à jour les paramètres mock
      mockSettings = { ...mockSettings, ...settings };
      return mockSettings;
    }
  }
};
