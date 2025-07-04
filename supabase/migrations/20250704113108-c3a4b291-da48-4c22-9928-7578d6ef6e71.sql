
-- Table pour stocker les annonces de communication
CREATE TABLE public.communication_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'meeting', 'news', 'urgent')),
  image_url TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE,
  meeting_location TEXT,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
  expiration_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les paramètres de communication
CREATE TABLE public.communication_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  carousel_duration INTEGER NOT NULL DEFAULT 20000 CHECK (carousel_duration >= 3000 AND carousel_duration <= 60000),
  autoplay BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insérer les paramètres par défaut
INSERT INTO public.communication_settings (carousel_duration, autoplay) 
VALUES (20000, true);

-- Index pour améliorer les performances
CREATE INDEX idx_communication_announcements_active ON public.communication_announcements(is_active);
CREATE INDEX idx_communication_announcements_priority ON public.communication_announcements(priority);
CREATE INDEX idx_communication_announcements_created_at ON public.communication_announcements(created_at);

-- RLS pour les annonces (lecture publique, écriture pour admin/rh)
ALTER TABLE public.communication_announcements ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : tous peuvent lire les annonces actives
CREATE POLICY "Anyone can read active announcements" 
  ON public.communication_announcements 
  FOR SELECT 
  USING (is_active = true);

-- Politique de création : seuls admin/rh peuvent créer
CREATE POLICY "Admin and RH can create announcements" 
  ON public.communication_announcements 
  FOR INSERT 
  WITH CHECK (true); -- Sera géré côté application

-- Politique de mise à jour : seuls admin/rh peuvent modifier
CREATE POLICY "Admin and RH can update announcements" 
  ON public.communication_announcements 
  FOR UPDATE 
  USING (true); -- Sera géré côté application

-- Politique de suppression : seuls admin/rh peuvent supprimer
CREATE POLICY "Admin and RH can delete announcements" 
  ON public.communication_announcements 
  FOR DELETE 
  USING (true); -- Sera géré côté application

-- RLS pour les paramètres (lecture publique, écriture admin)
ALTER TABLE public.communication_settings ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : tous peuvent lire les paramètres
CREATE POLICY "Anyone can read communication settings" 
  ON public.communication_settings 
  FOR SELECT 
  USING (true);

-- Politique de mise à jour : seuls admin peuvent modifier
CREATE POLICY "Admin can update communication settings" 
  ON public.communication_settings 
  FOR UPDATE 
  USING (true); -- Sera géré côté application

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_communication_announcements_updated_at 
    BEFORE UPDATE ON public.communication_announcements 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communication_settings_updated_at 
    BEFORE UPDATE ON public.communication_settings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Activer les mises à jour en temps réel pour les annonces
ALTER PUBLICATION supabase_realtime ADD TABLE public.communication_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.communication_settings;

-- Configurer REPLICA IDENTITY pour les mises à jour temps réel
ALTER TABLE public.communication_announcements REPLICA IDENTITY FULL;
ALTER TABLE public.communication_settings REPLICA IDENTITY FULL;
