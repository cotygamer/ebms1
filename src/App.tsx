import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/NotificationSystem';
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
import BusinessPortal from './pages/BusinessPortal';
import SecurityPortal from './pages/SecurityPortal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}-dashboard`} />} />
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
      
      {/* Additional disaster portal route for barangay officials */}
      <Route 
        path="/disaster-portal" 
        element={user && (user.role === 'disaster-portal' || user.role === 'barangay-official' || user.role === 'super-admin') ? <DisasterPortal /> : <Navigate to="/login" />} 
      />
      
      {/* Business Portal Routes */}
      <Route 
        path="/business-portal" 
        element={<BusinessPortal />} 
      />
      
      {/* Security Portal Routes */}
      <Route 
        path="/security-portal" 
        element={user && (user.role === 'security-personnel' || user.role === 'barangay-official' || user.role === 'super-admin') ? <SecurityPortal /> : <Navigate to="/login" />} 
      />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <div className="App">
                <AppRoutes />
              </div>
            </Router>
          </DataProvider>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;