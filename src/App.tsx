import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import { useAuthStore } from './stores/authStore';
import { useAcademicYearStore } from './stores/academicYearStore';
import { useMasterRecordsStore } from './stores/masterRecordsStore';
import { useDocsConfigStore } from './stores/docsConfigStore';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const AcademicYears = React.lazy(() => import('./pages/AcademicYears'));
const MasterRecords = React.lazy(() => import('./pages/MasterRecords'));
const Users = React.lazy(() => import('./pages/Users'));
const Actions = React.lazy(() => import('./pages/Actions'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Observatory = React.lazy(() => import('./pages/Observatory'));
const Forum = React.lazy(() => import('./pages/Forum'));
const Admin = React.lazy(() => import('./pages/Admin'));
const SharedAction = React.lazy(() => import('./pages/SharedAction'));
const SharedActionSuccess = React.lazy(() => import('./pages/SharedActionSuccess'));

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuthStore();
  const { initializeStore: initializeAcademicYear } = useAcademicYearStore();
  const { initializeStore: initializeMasterRecords } = useMasterRecordsStore();
  const { initializeStore: initializeDocsConfig } = useDocsConfigStore();

  // Initialize stores
  useEffect(() => {
    initializeAcademicYear();
    initializeMasterRecords();
    initializeDocsConfig();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Login />
                </React.Suspense>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Public Shared Action Routes */}
          <Route
            path="/shared/:token"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <SharedAction />
              </React.Suspense>
            }
          />
          <Route
            path="/shared/success"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <SharedActionSuccess />
              </React.Suspense>
            }
          />
          
          {/* Protected Routes */}
          <Route
            element={
              isAuthenticated ? (
                <Layout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route
              path="/dashboard"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </React.Suspense>
              }
            />
            <Route
              path="/academic-years"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AcademicYears />
                </React.Suspense>
              }
            />
            <Route
              path="/master-records"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MasterRecords />
                </React.Suspense>
              }
            />
            <Route
              path="/users"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Users />
                </React.Suspense>
              }
            />
            <Route
              path="/actions"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Actions />
                </React.Suspense>
              }
            />
            <Route
              path="/reports"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Reports />
                </React.Suspense>
              }
            />
            <Route
              path="/observatory"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Observatory />
                </React.Suspense>
              }
            />
            <Route
              path="/forum"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Forum />
                </React.Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Admin />
                </React.Suspense>
              }
            />
          </Route>

          {/* Redirect root to dashboard or login */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;