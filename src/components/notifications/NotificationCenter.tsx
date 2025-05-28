
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, Clock, User, Calendar } from 'lucide-react';

interface Notification {
  id: string;
  type: 'leave_request' | 'payroll' | 'system' | 'approval';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'leave_request',
    title: 'Nouvelle demande de congé',
    message: 'Jean Dupont a soumis une demande de congé pour juin 2024',
    timestamp: '2024-05-28T10:30:00Z',
    read: false,
    actionRequired: true
  },
  {
    id: '2',
    type: 'payroll',
    title: 'Bulletins de paie générés',
    message: 'Les bulletins de paie de mai 2024 sont disponibles',
    timestamp: '2024-05-28T09:15:00Z',
    read: false
  },
  {
    id: '3',
    type: 'approval',
    title: 'Demande approuvée',
    message: 'Votre demande de congé a été approuvée',
    timestamp: '2024-05-27T16:45:00Z',
    read: true
  },
];

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave_request':
        return <Calendar className="w-4 h-4" />;
      case 'payroll':
        return <Bell className="w-4 h-4" />;
      case 'approval':
        return <Check className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Tout marquer lu
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    notification.read ? 'bg-gray-200' : 'bg-blue-100'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">
                        {notification.title}
                      </h4>
                      {notification.actionRequired && (
                        <Badge variant="outline" className="text-xs">
                          Action requise
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
