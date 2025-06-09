
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mfaService } from '../../services/mfaService';
import MFASetup from '../auth/MFASetup';

const SecuritySettings = () => {
  const { user } = useAuth();
  const [showMFASetup, setShowMFASetup] = useState(false);

  if (!user) return null;

  const mfaStatus = mfaService.getMFAStatus(user);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Paramètres de sécurité</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres de sécurité de votre compte
        </p>
      </div>

      {/* Authentification à deux facteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentification à deux facteurs (MFA)
            {mfaStatus.isEnabled ? (
              <Badge variant="outline" className="text-green-600">
                Activée
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600">
                Désactivée
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire 
            à votre compte en exigeant un code depuis votre téléphone en plus de votre mot de passe.
          </p>

          {mfaStatus.isEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">MFA activée</p>
                  <p className="text-sm text-green-700">
                    Votre compte est protégé par l'authentification à deux facteurs
                  </p>
                </div>
              </div>

              {mfaStatus.lastUsed && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Dernière utilisation : {new Date(mfaStatus.lastUsed).toLocaleDateString('fr-FR')}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span>Codes de sauvegarde restants :</span>
                <Badge variant="outline">
                  {mfaStatus.backupCodesRemaining}
                </Badge>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowMFASetup(true)}
              >
                Gérer la MFA
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-medium text-orange-900">MFA désactivée</p>
                  <p className="text-sm text-orange-700">
                    Votre compte n'est pas protégé par l'authentification à deux facteurs
                  </p>
                </div>
              </div>

              <Button onClick={() => setShowMFASetup(true)}>
                Activer la MFA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations de sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              Utilisez un mot de passe fort et unique
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              Activez l'authentification à deux facteurs
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              Ne partagez jamais vos codes d'accès
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              Déconnectez-vous des appareils partagés
            </li>
          </ul>
        </CardContent>
      </Card>

      <MFASetup 
        isOpen={showMFASetup} 
        onClose={() => setShowMFASetup(false)} 
      />
    </div>
  );
};

export default SecuritySettings;
