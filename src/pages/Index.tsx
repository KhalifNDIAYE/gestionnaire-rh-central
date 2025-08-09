import React, { useState, useEffect, Suspense } from 'react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { CustomizableDashboard } from '../components/dashboard/CustomizableDashboard';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PublicPortal from '../components/portal/PublicPortal';

// Lazy loading des pages pour optimiser le bundle
import {
  EmployeesPage,
  FunctionsPage,
  ProjectsPage,
  LeaveRequestsPage,
  PayrollPage,
  MemorandumPage,
  OrganigrammePage,
  ProfilePage,
  SettingsPage,
  DirectoryPage,
  CommunicationPage,
  SalaryCalculationPage,
  TimeTrackingPage
} from '../components/lazy/LazyPageImports';

const LoadingFallback = () => (
  <div className="p-6 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2">Chargement...</span>
  </div>
);

// Lazy load du dashboard de monitoring
const MonitoringDashboard = React.lazy(() => 
  import('../components/monitoring/MonitoringDashboard').then(module => ({ 
    default: module.MonitoringDashboard 
  }))
);

const AppContent = () => {
  const { user, profile, loading } = useSupabaseAuth();
  const navigate = useNavigate();
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

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <CustomizableDashboard />;
      case 'employees':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <EmployeesPage />
          </Suspense>
        );
      case 'functions':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <FunctionsPage />
          </Suspense>
        );
      case 'projects':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProjectsPage />
          </Suspense>
        );
      case 'leave-requests':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LeaveRequestsPage />
          </Suspense>
        );
      case 'payroll':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PayrollPage />
          </Suspense>
        );
      case 'memorandum':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MemorandumPage />
          </Suspense>
        );
      case 'organigramme':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <OrganigrammePage />
          </Suspense>
        );
      case 'directory':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DirectoryPage />
          </Suspense>
        );
      case 'communication':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CommunicationPage />
          </Suspense>
        );
      case 'salary':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SalaryCalculationPage />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage />
          </Suspense>
        );
      case 'time-tracking':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TimeTrackingPage />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SettingsPage />
          </Suspense>
        );
      case 'monitoring':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MonitoringDashboard />
          </Suspense>
        );
      default:
        return <CustomizableDashboard />;
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
  return <AppContent />;
};

export default Index;
