
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

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

type DbAnnouncement = Database['public']['Tables']['communication_announcements']['Row'];
type DbSettings = Database['public']['Tables']['communication_settings']['Row'];

// Fonction utilitaire pour convertir les données de la DB vers notre interface
const mapDbAnnouncementToInterface = (dbAnnouncement: DbAnnouncement): CommunicationAnnouncement => ({
  id: dbAnnouncement.id,
  title: dbAnnouncement.title,
  content: dbAnnouncement.content,
  type: dbAnnouncement.type as CommunicationAnnouncement['type'],
  imageUrl: dbAnnouncement.image_url || undefined,
  meetingDate: dbAnnouncement.meeting_date || undefined,
  meetingLocation: dbAnnouncement.meeting_location || undefined,
  authorId: dbAnnouncement.author_id,
  authorName: dbAnnouncement.author_name,
  isActive: dbAnnouncement.is_active,
  priority: dbAnnouncement.priority,
  expirationDate: dbAnnouncement.expiration_date || undefined,
  createdAt: dbAnnouncement.created_at,
  updatedAt: dbAnnouncement.updated_at,
});

const mapDbSettingsToInterface = (dbSettings: DbSettings): CommunicationSettings => ({
  carouselDuration: dbSettings.carousel_duration,
  autoplay: dbSettings.autoplay,
});

export const communicationService = {
  async getActiveAnnouncements(): Promise<CommunicationAnnouncement[]> {
    try {
      const { data, error } = await supabase
        .from('communication_announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }

      return data.map(mapDbAnnouncementToInterface);
    } catch (error) {
      console.error('Error in getActiveAnnouncements:', error);
      throw error;
    }
  },

  async getAllAnnouncements(): Promise<CommunicationAnnouncement[]> {
    try {
      const { data, error } = await supabase
        .from('communication_announcements')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all announcements:', error);
        throw error;
      }

      return data.map(mapDbAnnouncementToInterface);
    } catch (error) {
      console.error('Error in getAllAnnouncements:', error);
      throw error;
    }
  },

  async createAnnouncement(announcement: Omit<CommunicationAnnouncement, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunicationAnnouncement> {
    try {
      const { data, error } = await supabase
        .from('communication_announcements')
        .insert({
          title: announcement.title,
          content: announcement.content,
          type: announcement.type,
          image_url: announcement.imageUrl || null,
          meeting_date: announcement.meetingDate || null,
          meeting_location: announcement.meetingLocation || null,
          author_id: announcement.authorId,
          author_name: announcement.authorName,
          is_active: announcement.isActive,
          priority: announcement.priority,
          expiration_date: announcement.expirationDate || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating announcement:', error);
        throw error;
      }

      return mapDbAnnouncementToInterface(data);
    } catch (error) {
      console.error('Error in createAnnouncement:', error);
      throw error;
    }
  },

  async updateAnnouncement(id: string, announcement: Partial<CommunicationAnnouncement>): Promise<CommunicationAnnouncement> {
    try {
      const updateData: any = {};
      
      if (announcement.title !== undefined) updateData.title = announcement.title;
      if (announcement.content !== undefined) updateData.content = announcement.content;
      if (announcement.type !== undefined) updateData.type = announcement.type;
      if (announcement.imageUrl !== undefined) updateData.image_url = announcement.imageUrl || null;
      if (announcement.meetingDate !== undefined) updateData.meeting_date = announcement.meetingDate || null;
      if (announcement.meetingLocation !== undefined) updateData.meeting_location = announcement.meetingLocation || null;
      if (announcement.authorId !== undefined) updateData.author_id = announcement.authorId;
      if (announcement.authorName !== undefined) updateData.author_name = announcement.authorName;
      if (announcement.isActive !== undefined) updateData.is_active = announcement.isActive;
      if (announcement.priority !== undefined) updateData.priority = announcement.priority;
      if (announcement.expirationDate !== undefined) updateData.expiration_date = announcement.expirationDate || null;

      const { data, error } = await supabase
        .from('communication_announcements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating announcement:', error);
        throw error;
      }

      return mapDbAnnouncementToInterface(data);
    } catch (error) {
      console.error('Error in updateAnnouncement:', error);
      throw error;
    }
  },

  async deleteAnnouncement(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('communication_announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting announcement:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteAnnouncement:', error);
      throw error;
    }
  },

  async getCommunicationSettings(): Promise<CommunicationSettings> {
    try {
      const { data, error } = await supabase
        .from('communication_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching communication settings:', error);
        throw error;
      }

      return mapDbSettingsToInterface(data);
    } catch (error) {
      console.error('Error in getCommunicationSettings:', error);
      throw error;
    }
  },

  async updateCommunicationSettings(settings: Partial<CommunicationSettings>): Promise<CommunicationSettings> {
    try {
      const updateData: any = {};
      
      if (settings.carouselDuration !== undefined) updateData.carousel_duration = settings.carouselDuration;
      if (settings.autoplay !== undefined) updateData.autoplay = settings.autoplay;

      const { data, error } = await supabase
        .from('communication_settings')
        .update(updateData)
        .select()
        .single();

      if (error) {
        console.error('Error updating communication settings:', error);
        throw error;
      }

      return mapDbSettingsToInterface(data);
    } catch (error) {
      console.error('Error in updateCommunicationSettings:', error);
      throw error;
    }
  },

  // Fonction pour écouter les changements en temps réel
  subscribeToAnnouncements(callback: (announcements: CommunicationAnnouncement[]) => void) {
    const channel = supabase
      .channel('communication_announcements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'communication_announcements'
        },
        async () => {
          // Recharger toutes les annonces actives quand il y a un changement
          try {
            const announcements = await this.getActiveAnnouncements();
            callback(announcements);
          } catch (error) {
            console.error('Error reloading announcements:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToSettings(callback: (settings: CommunicationSettings) => void) {
    const channel = supabase
      .channel('communication_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'communication_settings'
        },
        async () => {
          // Recharger les paramètres quand il y a un changement
          try {
            const settings = await this.getCommunicationSettings();
            callback(settings);
          } catch (error) {
            console.error('Error reloading settings:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
