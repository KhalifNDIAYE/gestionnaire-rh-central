
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, LogIn, LogOut, Coffee, CoffeeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { timeTrackingService } from '@/services/timeTrackingService';

interface ClockInOutButtonsProps {
  employeeId: string;
  employeeName: string;
  onUpdate: () => void;
}

const ClockInOutButtons = ({ employeeId, employeeName, onUpdate }: ClockInOutButtonsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClockAction = async (type: 'clock-in' | 'clock-out' | 'break-start' | 'break-end') => {
    setIsLoading(true);
    try {
      await timeTrackingService.createTimeEntry({
        employeeId,
        employeeName,
        type
      });

      const actionTexts = {
        'clock-in': 'Entrée enregistrée',
        'clock-out': 'Sortie enregistrée',
        'break-start': 'Début de pause enregistré',
        'break-end': 'Fin de pause enregistrée'
      };

      toast({
        title: 'Pointage effectué',
        description: actionTexts[type]
      });

      onUpdate();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer le pointage',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pointage rapide
        </CardTitle>
        <CardDescription>
          Heure actuelle: {currentTime}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => handleClockAction('clock-in')}
            disabled={isLoading}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-green-600 hover:bg-green-700"
          >
            <LogIn className="w-6 h-6" />
            <span>Entrée</span>
          </Button>
          
          <Button
            onClick={() => handleClockAction('clock-out')}
            disabled={isLoading}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-red-600 hover:bg-red-700"
          >
            <LogOut className="w-6 h-6" />
            <span>Sortie</span>
          </Button>
          
          <Button
            onClick={() => handleClockAction('break-start')}
            disabled={isLoading}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Coffee className="w-6 h-6" />
            <span>Début pause</span>
          </Button>
          
          <Button
            onClick={() => handleClockAction('break-end')}
            disabled={isLoading}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <CoffeeIcon className="w-6 h-6" />
            <span>Fin pause</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClockInOutButtons;
