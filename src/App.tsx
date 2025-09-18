import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { offlineService } from './services/offlineService';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import BMSLogin from './pages/BMSLogin';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import BarangayOfficialDashboard from './pages/BarangayOfficialDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import MedicalPortal from './pages/MedicalPortal';
import AccountingPortal from './pages/AccountingPortal';
import DisasterPortal from './pages/DisasterPortal';
import PeaceOrderPortal from './pages/PeaceOrderPortal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}-dashboard`} />} />
      <Route path="/bms" element={!user ? <BMSLogin /> : <Navigate to={`/${user.role === 'resident' ? 'resident' : user.role}-dashboard`} />} />
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
      <Route 
        path="/peace-order-portal" 
        element={user && (user.role === 'peace-order-portal' || user.role === 'barangay-official' || user.role === 'super-admin') ? <PeaceOrderPortal /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
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