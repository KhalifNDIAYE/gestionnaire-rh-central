
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, QrCode, Key, Copy, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mfaService, MFASetup as MFASetupData } from '../../services/mfaService';
import { toast } from '@/hooks/use-toast';

interface MFASetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const MFASetup = ({ isOpen, onClose }: MFASetupProps) => {
  const { user, enableMFA, disableMFA } = useAuth();
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [mfaData, setMfaData] = useState<MFASetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen && user && !user.mfaEnabled) {
      initializeMFA();
    }
  }, [isOpen, user]);

  const initializeMFA = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const setupData = await mfaService.setupMFA(user.email, user.name);
      setMfaData(setupData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la MFA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!mfaData || !verificationCode) return;

    setLoading(true);
    try {
      const isValid = mfaService.verifyToken(mfaData.secret, verificationCode);
      
      if (isValid) {
        await enableMFA(mfaData.secret);
        setStep('backup');
        toast({
          title: "MFA activée",
          description: "L'authentification à deux facteurs a été activée avec succès",
        });
      } else {
        toast({
          title: "Code invalide",
          description: "Le code de vérification est incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la vérification du code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    setLoading(true);
    try {
      await disableMFA();
      toast({
        title: "MFA désactivée",
        description: "L'authentification à deux facteurs a été désactivée",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de désactiver la MFA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodes(prev => new Set([...prev, index]));
    setTimeout(() => {
      setCopiedCodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 2000);
  };

  const copyAllCodes = () => {
    if (mfaData?.backupCodes) {
      const allCodes = mfaData.backupCodes.join('\n');
      navigator.clipboard.writeText(allCodes);
      toast({
        title: "Codes copiés",
        description: "Tous les codes de sauvegarde ont été copiés",
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentification à deux facteurs (MFA)
          </DialogTitle>
        </DialogHeader>

        {user.mfaEnabled ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                MFA Activée
                <Badge variant="outline" className="text-green-600">Sécurisé</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Votre compte est protégé par l'authentification à deux facteurs.
                Vous devrez saisir un code depuis votre application d'authentification lors de la connexion.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDisableMFA}
                disabled={loading}
              >
                Désactiver la MFA
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Configuration</TabsTrigger>
              <TabsTrigger value="verify" disabled={!mfaData}>Vérification</TabsTrigger>
              <TabsTrigger value="backup" disabled={step !== 'backup'}>Codes de sauvegarde</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Scanner le QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Scannez ce QR code avec votre application d'authentification 
                    (Google Authenticator, Microsoft Authenticator, Authy, etc.)
                  </p>
                  
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : mfaData ? (
                    <div className="flex justify-center">
                      <img 
                        src={mfaData.qrCodeUrl} 
                        alt="QR Code MFA" 
                        className="border rounded-lg"
                      />
                    </div>
                  ) : null}

                  {mfaData && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Ou saisissez manuellement cette clé :
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={mfaData.secret} 
                          readOnly 
                          className="font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(mfaData.secret)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => setStep('verify')} 
                    disabled={!mfaData}
                    className="w-full"
                  >
                    Continuer vers la vérification
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verify" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Vérifier le code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Saisissez le code à 6 chiffres affiché dans votre application d'authentification
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Code de vérification</Label>
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button 
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6 || loading}
                    className="w-full"
                  >
                    {loading ? 'Vérification...' : 'Vérifier et activer la MFA'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Codes de sauvegarde
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800">
                      <strong>Important :</strong> Sauvegardez ces codes dans un endroit sûr. 
                      Ils vous permettront d'accéder à votre compte si vous perdez votre appareil d'authentification.
                      Chaque code ne peut être utilisé qu'une seule fois.
                    </p>
                  </div>

                  {mfaData?.backupCodes && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">Codes de récupération</Label>
                        <Button size="sm" variant="outline" onClick={copyAllCodes}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copier tous
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {mfaData.backupCodes.map((code, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={code} 
                              readOnly 
                              className="font-mono text-sm"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyBackupCode(code, index)}
                            >
                              {copiedCodes.has(index) ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={onClose} className="w-full">
                    Terminer la configuration
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MFASetup;
