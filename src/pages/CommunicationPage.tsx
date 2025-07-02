
import React from 'react';
import { Megaphone } from 'lucide-react';
import AnnouncementManager from '../components/communication/AnnouncementManager';

const CommunicationPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Megaphone className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
          <p className="text-gray-600">Gérez les annonces et communications</p>
        </div>
      </div>

      <AnnouncementManager />
    </div>
  );
};

export default CommunicationPage;
