import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import Dashboard from '../components/dashboard/Dashboard';
import EmployeesPage from './EmployeesPage';
import FunctionsPage from './FunctionsPage';
import ProjectsPage from './ProjectsPage';
import LeaveRequestsPage from './LeaveRequestsPage';
import PayrollPage from './PayrollPage';
import MemorandumPage from './MemorandumPage';
import OrganigrammePage from './OrganigrammePage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import DirectoryPage from './DirectoryPage';
import CommunicationPage from './CommunicationPage';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PublicPortal from '../components/portal/PublicPortal';

// Lazy load pour le module de calcul des salaires
const SalaryCalculationPage = React.lazy(() => import('./SalaryCalculationPage'));
const TimeTrackingPage = React.lazy(() => import('./TimeTrackingPage'));

const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAndroidTV, setIsAndroidTV] = useState(false);

  // Détecter Android TV et les paramètres URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tvParam = urlParams.get('tv');
    const isTV = tvParam === 'true' || /Android.*TV|BRAVIA|GoogleTV|SmartTV/i.test(navigator.userAgent);
    setIsAndroidTV(isTV);
  }, []);

  // Si pas d'utilisateur connecté, afficher le portail public ou le formulaire de connexion
  if (!user) {
    if (showLoginForm) {
      return (
        <LoginForm 
          onBackToPortal={() => setShowLoginForm(false)} 
          isAndroidTV={isAndroidTV}
        />
      );
    }
    
    return (
      <PublicPortal 
        onLoginClick={() => setShowLoginForm(true)}
        isAndroidTV={isAndroidTV}
      />
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeesPage />;
      case 'functions':
        return <FunctionsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'leave-requests':
        return <LeaveRequestsPage />;
      case 'payroll':
        return <PayrollPage />;
      case 'memorandum':
        return <MemorandumPage />;
      case 'organigramme':
        return <OrganigrammePage />;
      case 'directory':
        return <DirectoryPage />;
      case 'communication':
        return (
          <React.Suspense fallback={<div className="p-6">Chargement...</div>}>
            <CommunicationPage />
          </React.Suspense>
        );
      case 'salary':
        return (
          <React.Suspense fallback={<div className="p-6">Chargement...</div>}>
            <SalaryCalculationPage />
          </React.Suspense>
        );
      case 'profile':
        return <ProfilePage />;
      case 'time-tracking':
        return (
          <React.Suspense fallback={<div className="p-6">Chargement...</div>}>
            <TimeTrackingPage />
          </React.Suspense>
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeItem={currentPage} onItemClick={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={currentPage} />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
