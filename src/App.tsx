import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { WorkflowPage } from './pages/public/WorkflowPage';
import { SecurityPage } from './pages/public/SecurityPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Authenticated Shell & Dashboard Pages
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { InstrumentsList } from './pages/dashboard/InstrumentsList';
import { NewInstrument } from './pages/dashboard/NewInstrument';
import { InstrumentDetails } from './pages/dashboard/InstrumentDetails';
import { VerificationQueue } from './pages/dashboard/VerificationQueue';
import { ApprovalsPage } from './pages/dashboard/ApprovalsPage';
import { MaturityCalendar } from './pages/dashboard/MaturityCalendar';
import { RenewalsPage } from './pages/dashboard/RenewalsPage';
import { ReleasesPage } from './pages/dashboard/ReleasesPage';
import { DocumentsPage } from './pages/dashboard/DocumentsPage';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { AuditTrailPage } from './pages/dashboard/AuditTrailPage';
import { UserManagementPage } from './pages/dashboard/UserManagementPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/workflow" element={<WorkflowPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated Application Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="instruments" element={<InstrumentsList />} />
              <Route path="instruments/new" element={<NewInstrument />} />
              <Route path="instruments/:id" element={<InstrumentDetails />} />
              <Route path="verification" element={<VerificationQueue />} />
              <Route path="approvals" element={<ApprovalsPage />} />
              <Route path="maturity" element={<MaturityCalendar />} />
              <Route path="renewals" element={<RenewalsPage />} />
              <Route path="releases" element={<ReleasesPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="audit" element={<AuditTrailPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
