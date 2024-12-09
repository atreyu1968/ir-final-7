import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AcademicYears from './pages/AcademicYears';
import MasterRecords from './pages/MasterRecords';
import Users from './pages/Users';
import Actions from './pages/Actions';
import Reports from './pages/Reports';
import Observatory from './pages/Observatory';
import Forum from './pages/Forum';
import Admin from './pages/Admin';
import SharedAction from './pages/SharedAction';
import SharedActionSuccess from './pages/SharedActionSuccess';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Public Shared Action Routes */}
          <Route path="/shared/:token" element={<SharedAction />} />
          <Route path="/shared/success" element={<SharedActionSuccess />} />
          
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academic-years" element={<AcademicYears />} />
            <Route path="/master-records" element={<MasterRecords />} />
            <Route path="/users" element={<Users />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/observatory" element={<Observatory />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/admin" element={<Admin />} />
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