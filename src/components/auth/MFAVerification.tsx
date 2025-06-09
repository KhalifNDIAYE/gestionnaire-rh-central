
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Smartphone, Key } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface MFAVerificationProps {
  isOpen: boolean;
  onVerify: (code: string, isBackupCode?: boolean) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MFAVerification = ({ isOpen, onVerify, onCancel, loading = false }: MFAVerificationProps) => {
  const [activeTab, setActiveTab] = useState<'totp' | 'backup'>('totp');
  const [totpCode, setTotpCode] = useState('');
  const [backupCode, setBackupCode] = useState('');

  const handleTOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length === 6) {
      onVerify(totpCode, false);
    }
  };

  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (backupCode.trim()) {
      onVerify(backupCode.trim().toUpperCase(), true);
    }
  };

  const handleTOTPComplete = (value: string) => {
    setTotpCode(value);
    if (value.length === 6) {
      onVerify(value, false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vérification MFA requise
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'totp' | 'backup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="totp" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Authenticateur
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Code de sauvegarde
            </TabsTrigger>
          </TabsList>

          <TabsContent value="totp">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleTOTPSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Code de votre application d'authentification
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Saisissez le code à 6 chiffres affiché dans votre application
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={totpCode}
                      onChange={setTotpCode}
                      onComplete={handleTOTPComplete}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="flex-1"
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={totpCode.length !== 6 || loading}
                    >
                      {loading ? 'Vérification...' : 'Vérifier'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleBackupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-code" className="text-sm font-medium">
                      Code de récupération
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Utilisez l'un de vos codes de sauvegarde
                    </p>
                    <Input
                      id="backup-code"
                      value={backupCode}
                      onChange={(e) => setBackupCode(e.target.value)}
                      placeholder="XXXXXXXX"
                      className="text-center font-mono"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="flex-1"
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={!backupCode.trim() || loading}
                    >
                      {loading ? 'Vérification...' : 'Vérifier'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MFAVerification;
