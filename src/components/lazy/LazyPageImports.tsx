import { lazy } from 'react';

// Lazy loading des pages pour réduire la taille du bundle principal
export const EmployeesPage = lazy(() => import('../../pages/EmployeesPage'));
export const FunctionsPage = lazy(() => import('../../pages/FunctionsPage'));
export const ProjectsPage = lazy(() => import('../../pages/ProjectsPage'));
export const LeaveRequestsPage = lazy(() => import('../../pages/LeaveRequestsPage'));
export const PayrollPage = lazy(() => import('../../pages/PayrollPage'));
export const MemorandumPage = lazy(() => import('../../pages/MemorandumPage'));
export const OrganigrammePage = lazy(() => import('../../pages/OrganigrammePage'));
export const ProfilePage = lazy(() => import('../../pages/ProfilePage'));
export const SettingsPage = lazy(() => import('../../pages/SettingsPage'));
export const DirectoryPage = lazy(() => import('../../pages/DirectoryPage'));
export const CommunicationPage = lazy(() => import('../../pages/CommunicationPage'));
export const SalaryCalculationPage = lazy(() => import('../../pages/SalaryCalculationPage'));
export const TimeTrackingPage = lazy(() => import('../../pages/TimeTrackingPage'));