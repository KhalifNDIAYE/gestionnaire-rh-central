
import React, { useState } from 'react';
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
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

// Lazy load pour le module de calcul des salaires
const SalaryCalculationPage = React.lazy(() => import('./SalaryCalculationPage'));
const TimeTrackingPage = React.lazy(() => import('./TimeTrackingPage'));

const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginForm />;
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
        <Header />
        <main className="flex-1 p-6">
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
