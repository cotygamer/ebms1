import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Building2, Eye, EyeOff, Shield, Users, Heart, Calculator, AlertTriangle } from 'lucide-react';

export default function BMSLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Navigation will be handled by the AuthProvider based on user role
      }
    } catch (err: any) {
      console.error('BMS Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupDemoUsers = async () => {
    setSetupLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-demo-users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Demo users created successfully! You can now login with the credentials shown below.');
      } else {
        console.error('Setup error:', result);
        alert('Error setting up demo users. Check console for details.');
      }
    } catch (error) {
      console.error('Setup error:', error);
      alert('Error setting up demo users. Check console for details.');
    } finally {
      setSetupLoading(false);
    }
  };

  const portals = [
    {
      name: 'Super Admin',
      description: 'Complete system administration',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      credentials: 'superadmin@barangay.gov'
    },
    {
      name: 'Barangay Official',
      description: 'Resident management & verification',
      icon: Users,
      color: 'from-green-500 to-green-600',
      credentials: 'official@barangay.gov'
    },
    {
      name: 'Medical Portal',
      description: 'Health center management',
      icon: Heart,
      color: 'from-red-400 to-pink-500',
      credentials: 'medical@barangay.gov'
    },
    {
      name: 'Accounting Portal',
      description: 'Financial management',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      credentials: 'accounting@barangay.gov'
    },
    {
      name: 'Disaster Portal',
      description: 'Emergency management',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      credentials: 'disaster@barangay.gov'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center space-x-3 text-white hover:text-blue-200 transition-colors">
              <Building2 className="h-6 w-6" />
              <span>Back to Public Site</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">BMS Portal</h1>
                <p className="text-sm text-blue-200">Barangay Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-20"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Barangay Management System
            </h1>
            <p className="text-xl text-blue-200 mb-2">
              Secure Portal Access for Officials & Staff
            </p>
            <p className="text-sm text-blue-300">
              Administrative Dashboard • Centralized Management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Login Form */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white border-opacity-20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Shield className="h-6 w-6 mr-3" />
                  Portal Access
                </h2>
                <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-600/30">
                  <h2 className="text-lg font-semibold text-white mb-3">
                    Demo Credentials & Setup
                  </h2>
                  <button
                    onClick={handleSetupDemoUsers}
                    disabled={setupLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg mb-4 font-medium transition-colors"
                  >
                    {setupLoading ? 'Setting up...' : 'Setup Demo Users'}
                  </button>
                  <p className="text-blue-100 mt-2">
                    <strong>Click "Setup Demo Users" first</strong> to create all demo accounts automatically.
                  </p>
                </div>
              </div>

              <div className="p-8">
                {error && (
                  <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {error}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Official Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter your official email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-blue-200" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-200" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-blue-900 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isLoading ? 'Signing in...' : 'Access Portal'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-blue-200">
                    Need help accessing your account?{' '}
                    <a href="mailto:support@barangaysanmiguel.gov" className="text-white hover:text-blue-100 font-medium">
                      Contact IT Support
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Portal Information */}
            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <h3 className="text-xl font-bold text-white mb-4">Available Portals</h3>
                <div className="space-y-4">
                  {portals.map((portal, index) => (
                    <div key={index} className="bg-white bg-opacity-10 rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${portal.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <portal.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{portal.name}</h4>
                          <p className="text-sm text-blue-200">{portal.description}</p>
                          <p className="text-xs text-blue-300 font-mono">{portal.credentials}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <h3 className="text-lg font-bold text-white mb-4">Demo Credentials</h3>
                <div className="space-y-2 text-sm text-blue-100 font-mono">
                  <p><strong>Super Admin:</strong> superadmin@barangay.gov / password123</p>
                  <p><strong>Barangay Official:</strong> official@barangay.gov / password123</p>
                  <p><strong>Medical Staff:</strong> medical@barangay.gov / password123</p>
                  <p><strong>Accounting Staff:</strong> accounting@barangay.gov / password123</p>
                  <p><strong>Disaster Staff:</strong> disaster@barangay.gov / password123</p>
                </div>
                <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-400 border-opacity-30 rounded-lg">
                  <p className="text-xs text-yellow-100">
                    <strong>Note:</strong> These are demo accounts for testing. In production, use secure passwords and proper user management.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-blue-200 mb-2">Looking for resident services?</p>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-all border border-white border-opacity-30"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Resident Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}