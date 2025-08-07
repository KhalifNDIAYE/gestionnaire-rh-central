import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Mail, Download, Trash2 } from 'lucide-react';

/**
 * Le composant Button est un élément d'interface polyvalent qui permet aux utilisateurs 
 * d'effectuer des actions. Il supporte plusieurs variantes, tailles et peut inclure des icônes.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Un composant bouton flexible avec support pour les icônes et différents styles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Style visuel du bouton',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Taille du bouton',
    },
    disabled: {
      control: 'boolean',
      description: 'Désactive le bouton',
    },
    asChild: {
      control: 'boolean',
      description: 'Rend le bouton comme un enfant',
    },
  },
  args: {
    children: 'Button',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Le bouton par défaut avec le style principal
 */
export const Default: Story = {
  args: {
    children: 'Bouton principal',
  },
};

/**
 * Bouton de destruction pour les actions dangereuses
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Supprimer',
  },
};

/**
 * Bouton avec bordure uniquement
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Annuler',
  },
};

/**
 * Bouton secondaire pour les actions moins importantes
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondaire',
  },
};

/**
 * Bouton fantôme sans arrière-plan
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

/**
 * Bouton style lien
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Lien',
  },
};

/**
 * Différentes tailles de boutons
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Petit</Button>
      <Button size="default">Moyen</Button>
      <Button size="lg">Grand</Button>
    </div>
  ),
};

/**
 * Boutons avec icônes
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button>
        <Mail className="mr-2 h-4 w-4" />
        Envoyer email
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Télécharger
      </Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Supprimer
      </Button>
    </div>
  ),
};

/**
 * Bouton icône uniquement
 */
export const IconOnly: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Mail className="h-4 w-4" />,
  },
};

/**
 * États du bouton
 */
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button>Normal</Button>
      <Button disabled>Désactivé</Button>
    </div>
  ),
};

/**
 * Toutes les variantes en un coup d'œil
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};