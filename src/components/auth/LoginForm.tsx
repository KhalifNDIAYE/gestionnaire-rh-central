import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Users, Lock, ArrowLeft, Tv } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MFAVerification from './MFAVerification';

interface LoginFormProps {
  onBackToPortal?: () => void;
  isAndroidTV?: boolean;
}

const LoginForm = ({ onBackToPortal, isAndroidTV = false }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const { login } = useAuth();

  // Détecter si on est sur Android TV via user agent
  useEffect(() => {
    const isTV = /Android.*TV|BRAVIA|GoogleTV|SmartTV/i.test(navigator.userAgent);
    if (isTV && !isAndroidTV) {
      // Rediriger vers le portail TV si détecté
      window.location.href = '/?tv=true';
    }
  }, [isAndroidTV]);

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'application RH",
        });
      } else {
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
      <div className={`min-h-screen ${isAndroidTV ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-4`}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center ${isAndroidTV ? 'w-20 h-20' : 'w-16 h-16'} bg-blue-600 rounded-full mb-4`}>
              {isAndroidTV ? <Tv className="w-10 h-10 text-white" /> : <Users className="w-8 h-8 text-white" />}
            </div>
            <h1 className={`${isAndroidTV ? 'text-4xl text-white' : 'text-3xl text-gray-900'} font-bold mb-2`}>
              RH Management
            </h1>
            <p className={`${isAndroidTV ? 'text-xl text-gray-300' : 'text-gray-600'}`}>
              {isAndroidTV ? 'Connexion Android TV' : 'Gestion des Ressources Humaines'}
            </p>
          </div>

          <Card className={`shadow-xl ${isAndroidTV ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={`text-center text-xl ${isAndroidTV ? 'text-white' : ''}`}>
                Connexion Employés
              </CardTitle>
              {onBackToPortal && !isAndroidTV && (
                <Button
                  variant="ghost"
                  onClick={onBackToPortal}
                  className="absolute top-4 left-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au portail
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInitialLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={isAndroidTV ? 'text-white' : ''}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@entreprise.com"
                    required
                    disabled={loading}
                    className={isAndroidTV ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className={isAndroidTV ? 'text-white' : ''}>
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className={isAndroidTV ? 'bg-gray-700 border-gray-600 text-white' : ''}
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

              <div className={`mt-6 p-4 ${isAndroidTV ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <p className={`${isAndroidTV ? 'text-sm text-gray-300' : 'text-sm text-gray-600'} mb-2`}>
                  Comptes de démonstration :
                </p>
                <div className={`text-xs space-y-1 ${isAndroidTV ? 'text-gray-400' : ''}`}>
                  <p><strong>Admin (avec MFA):</strong> admin@company.com</p>
                  <p><strong>RH:</strong> marie.dubois@company.com</p>
                  <p><strong>Gestionnaire:</strong> pierre.martin@company.com</p>
                  <p><strong>Agent:</strong> sophie.leroy@company.com</p>
                  <p className={`${isAndroidTV ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                    Mot de passe: password
                  </p>
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
