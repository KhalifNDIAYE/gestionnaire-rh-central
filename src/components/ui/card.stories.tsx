import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Badge } from './badge';

/**
 * Le composant Card est un conteneur polyvalent pour afficher du contenu structuré.
 * Il est composé de plusieurs sous-composants pour une flexibilité maximale.
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Un composant carte flexible pour organiser et présenter du contenu.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Carte simple avec titre et contenu
 */
export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Titre de la carte</CardTitle>
        <CardDescription>Description de la carte</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenu principal de la carte avec des informations détaillées.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Carte avec pied de page et actions
 */
export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Projet React</CardTitle>
        <CardDescription>Application web moderne avec TypeScript</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Cette application utilise React, TypeScript, et Tailwind CSS pour créer une interface utilisateur moderne et responsive.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Annuler</Button>
        <Button>Déployer</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Carte avec badges et statut
 */
export const WithBadges: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Employé du mois</CardTitle>
            <CardDescription>Performance exceptionnelle</CardDescription>
          </div>
          <Badge>Actif</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Nom:</strong> Marie Dupont</p>
          <p><strong>Département:</strong> Développement</p>
          <p><strong>Score:</strong> 95/100</p>
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Carte de profil utilisateur
 */
export const UserProfile: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
            JD
          </div>
          <div>
            <CardTitle>Jean Dupont</CardTitle>
            <CardDescription>Développeur Full Stack</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">📧 jean.dupont@example.com</p>
          <p className="text-sm text-muted-foreground">📞 +33 1 23 45 67 89</p>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Node.js</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Voir le profil</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Carte de statistiques
 */
export const StatsCard: Story = {
  render: () => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">€45,231.89</div>
        <p className="text-xs text-muted-foreground">
          +20.1% par rapport au mois dernier
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Grille de cartes
 */
export const CardGrid: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,350</div>
          <p className="text-xs text-muted-foreground">+180.1% depuis le mois dernier</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€12,234</div>
          <p className="text-xs text-muted-foreground">+19% depuis le mois dernier</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Produits actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">573</div>
          <p className="text-xs text-muted-foreground">+201 depuis la semaine dernière</p>
        </CardContent>
      </Card>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};