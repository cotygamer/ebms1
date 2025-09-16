import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { offlineService } from './services/offlineService';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import BarangayOfficialDashboard from './pages/BarangayOfficialDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import MedicalPortal from './pages/MedicalPortal';
import AccountingPortal from './pages/AccountingPortal';
import DisasterPortal from './pages/DisasterPortal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppRoutes() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={getRedirectPath(user.role)} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}-dashboard`} />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to={`/${user.role}-dashboard`} />} />
      
      {/* Protected Routes */}
      <Route 
        path="/super-admin-dashboard" 
        element={user?.role === 'super-admin' ? <SuperAdminDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/barangay-official-dashboard" 
        element={user?.role === 'barangay-official' ? <BarangayOfficialDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/resident-dashboard" 
        element={user?.role === 'resident' ? <ResidentDashboard /> : <Navigate to="/login" />} 
      />
      
      {/* Portal Routes */}
      <Route 
        path="/medical-portal" 
        element={user && user.role === 'medical-portal' ? <MedicalPortal /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/accounting-portal" 
        element={user && user.role === 'accounting-portal' ? <AccountingPortal /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/disaster-portal" 
        element={user && user.role === 'disaster-portal' ? <DisasterPortal /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/disaster-portal-dashboard" 
        element={user && (user.role === 'disaster-portal' || user.role === 'barangay-official') ? <DisasterPortal /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

// Helper function to get the correct redirect path based on user role
function getRedirectPath(role: string): string {
  switch (role) {
    case 'super-admin':
      return '/super-admin-dashboard';
    case 'barangay-official':
      return '/barangay-official-dashboard';
    case 'resident':
      return '/resident-dashboard';
    case 'medical-portal':
      return '/medical-portal';
    case 'accounting-portal':
      return '/accounting-portal';
    case 'disaster-portal':
      return '/disaster-portal';
    default:
      return '/login';
  }
}

function App() {
  useEffect(() => {
    // Initialize offline service when app starts
    offlineService.initialize().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;