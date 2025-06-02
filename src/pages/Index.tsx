
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import Dashboard from '../components/dashboard/Dashboard';
import EmployeesPage from './EmployeesPage';
import FunctionsPage from './FunctionsPage';
import LeaveRequestsPage from './LeaveRequestsPage';
import PayrollPage from './PayrollPage';
import MemorandumPage from './MemorandumPage';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

// Lazy load pour le module de calcul des salaires
const SalaryCalculationPage = React.lazy(() => import('./SalaryCalculationPage'));

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
      case 'leave-requests':
        return <LeaveRequestsPage />;
      case 'payroll':
        return <PayrollPage />;
      case 'memorandum':
        return <MemorandumPage />;
      case 'salary':
        return (
          <React.Suspense fallback={<div className="p-6">Chargement...</div>}>
            <SalaryCalculationPage />
          </React.Suspense>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Mon Profil</h1>
            <p>Page de profil en cours de développement...</p>
          </div>
        );
      case 'departments':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Gestion des Départements</h1>
            <p>Page de gestion des départements en cours de développement...</p>
          </div>
        );
      case 'time-tracking':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Système de Pointage</h1>
            <p>Module de pointage en cours de développement...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Paramètres</h1>
            <p>Page de paramètres en cours de développement...</p>
          </div>
        );
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
