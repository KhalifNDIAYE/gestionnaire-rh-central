
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Users, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MFAVerification from './MFAVerification';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const { login } = useAuth();

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Première tentative de connexion sans MFA
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'application RH",
        });
      } else {
        // Vérifier si l'utilisateur a la MFA activée
        // Pour la démo, on suppose que certains utilisateurs ont la MFA
        if (email === 'admin@company.com') {
          setShowMFAVerification(true);
        } else {
          toast({
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async (code: string, isBackupCode: boolean = false) => {
    setMfaLoading(true);
    
    try {
      const success = await login(email, password, code);
      if (success) {
        setShowMFAVerification(false);
        toast({
          title: "Connexion réussie",
          description: "Authentification MFA validée",
        });
      } else {
        toast({
          title: "Code invalide",
          description: isBackupCode ? "Code de sauvegarde incorrect" : "Code d'authentification incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la vérification MFA",
        variant: "destructive",
      });
    } finally {
      setMfaLoading(false);
    }
  };

  const handleCancelMFA = () => {
    setShowMFAVerification(false);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">RH Management</h1>
            <p className="text-gray-600">Gestion des Ressources Humaines</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-xl">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInitialLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@entreprise.com"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Se connecter
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Comptes de démonstration :</p>
                <div className="text-xs space-y-1">
                  <p><strong>Admin (avec MFA):</strong> admin@company.com</p>
                  <p><strong>RH:</strong> marie.dubois@company.com</p>
                  <p><strong>Gestionnaire:</strong> pierre.martin@company.com</p>
                  <p><strong>Agent:</strong> sophie.leroy@company.com</p>
                  <p className="text-blue-600 font-medium">Mot de passe: password</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MFAVerification
        isOpen={showMFAVerification}
        onVerify={handleMFAVerification}
        onCancel={handleCancelMFA}
        loading={mfaLoading}
      />
    </>
  );
};

export default LoginForm;
