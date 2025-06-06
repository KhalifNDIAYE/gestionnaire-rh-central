
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BrandingPreviewProps {
  brandingData: {
    primaryColor: string;
    primaryFontColor: string;
    primaryGradientColor1: string;
    secondaryColor: string;
    secondaryFontColor: string;
    primaryGradientColor2: string;
    clientLogo?: string;
    clientBanner?: string;
    loginBanner?: string;
  };
}

const BrandingPreview: React.FC<BrandingPreviewProps> = ({ brandingData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu du Branding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Aperçu des couleurs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Couleurs Primaires</h4>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: brandingData.primaryColor }}
              />
              <span className="text-sm">Couleur primaire</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border flex items-center justify-center text-xs"
                style={{ 
                  backgroundColor: brandingData.primaryColor,
                  color: brandingData.primaryFontColor 
                }}
              >
                Aa
              </div>
              <span className="text-sm">Police primaire</span>
            </div>
            <div 
              className="w-full h-8 rounded border"
              style={{ 
                background: `linear-gradient(to right, ${brandingData.primaryGradientColor1}, ${brandingData.primaryGradientColor2})` 
              }}
            />
            <span className="text-sm">Dégradé primaire</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Couleurs Secondaires</h4>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: brandingData.secondaryColor }}
              />
              <span className="text-sm">Couleur secondaire</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border flex items-center justify-center text-xs"
                style={{ 
                  backgroundColor: brandingData.secondaryColor,
                  color: brandingData.secondaryFontColor 
                }}
              >
                Aa
              </div>
              <span className="text-sm">Police secondaire</span>
            </div>
          </div>
        </div>

        {/* Aperçu des logos */}
        <div className="space-y-4">
          <h4 className="font-medium">Logos et Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brandingData.clientLogo && (
              <div className="text-center">
                <img 
                  src={brandingData.clientLogo} 
                  alt="Logo Client" 
                  className="w-12 h-12 mx-auto object-contain border rounded"
                />
                <p className="text-xs mt-1">Logo Client</p>
              </div>
            )}
            
            {brandingData.clientBanner && (
              <div className="text-center">
                <img 
                  src={brandingData.clientBanner} 
                  alt="Bannière Client" 
                  className="w-full h-12 mx-auto object-contain border rounded"
                />
                <p className="text-xs mt-1">Bannière Client</p>
              </div>
            )}
            
            {brandingData.loginBanner && (
              <div className="text-center">
                <img 
                  src={brandingData.loginBanner} 
                  alt="Bannière de Connexion" 
                  className="w-full h-16 mx-auto object-contain border rounded"
                />
                <p className="text-xs mt-1">Bannière de Connexion</p>
              </div>
            )}
          </div>
        </div>

        {/* Aperçu d'un bouton avec le branding */}
        <div className="space-y-2">
          <h4 className="font-medium">Aperçu des Composants</h4>
          <div className="flex space-x-2">
            <Button 
              style={{ 
                backgroundColor: brandingData.primaryColor,
                color: brandingData.primaryFontColor 
              }}
            >
              Bouton Primaire
            </Button>
            <Button 
              variant="outline"
              style={{ 
                borderColor: brandingData.secondaryColor,
                color: brandingData.secondaryColor 
              }}
            >
              Bouton Secondaire
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingPreview;
