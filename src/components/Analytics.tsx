import React from 'react';
import { Users, UserCheck, FileText, TrendingUp, AlertTriangle, CheckCircle, Activity, Shield, Building2, Heart, Calculator, MapPin, BarChart3, PieChart } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Analytics Overview</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-3xl font-bold text-blue-600">1,245</p>
              <p className="text-sm text-green-600">+23 this month</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Residents</p>
              <p className="text-3xl font-bold text-green-600">892</p>
              <p className="text-sm text-green-600">71.6% verified</p>
            </div>
            <UserCheck className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents Processed</p>
              <p className="text-3xl font-bold text-purple-600">2,341</p>
              <p className="text-sm text-green-600">+156 this month</p>
            </div>
            <FileText className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
              <p className="text-3xl font-bold text-yellow-600">₱125,450</p>
              <p className="text-sm text-green-600">+12.5% this month</p>
            </div>
            <TrendingUp className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Portal Performance Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portal Performance Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="text-xs font-semibold text-green-600">98.5% Uptime</span>
            </div>
            <h4 className="font-semibold text-red-800">Medical Portal</h4>
            <p className="text-xs text-red-700">156 patients served this month</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="h-6 w-6 text-green-600" />
              <span className="text-xs font-semibold text-green-600">99.2% Uptime</span>
            </div>
            <h4 className="font-semibold text-green-800">Accounting Portal</h4>
            <p className="text-xs text-green-700">₱125k revenue processed</p>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <span className="text-xs font-semibold text-green-600">100% Uptime</span>
            </div>
            <h4 className="font-semibold text-orange-800">Disaster Portal</h4>
            <p className="text-xs text-orange-700">Enhanced with weather & maps</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-xs font-semibold text-green-600">97.8% Uptime</span>
            </div>
            <h4 className="font-semibold text-purple-800">Security Portal</h4>
            <p className="text-xs text-purple-700">23 incidents managed</p>
          </div>
        </div>
      </div>

      {/* System Integration Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Integration Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <Activity className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-blue-600 mb-2">99.1%</div>
            <div className="text-sm text-blue-800">Cross-Portal Sync Rate</div>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-sm text-green-800">Authentication Success</div>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <BarChart3 className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
            <div className="text-sm text-purple-800">Integrated Portals</div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">892</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '71.6%' }}></div>
                </div>
                <span className="text-sm text-gray-600">71.6%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Semi-verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">234</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18.8%' }}></div>
                </div>
                <span className="text-sm text-gray-600">18.8%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Non-verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">119</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '9.6%' }}></div>
                </div>
                <span className="text-sm text-gray-600">9.6%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">Juan Dela Cruz verified successfully</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">New barangay clearance request</p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">New resident registration</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">Document verification pending</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="text-2xl font-bold text-blue-600">23</h4>
            <p className="text-sm text-blue-800">New Registrations</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="text-2xl font-bold text-green-600">156</h4>
            <p className="text-sm text-green-800">Documents Processed</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="text-2xl font-bold text-purple-600">₱45,300</h4>
            <p className="text-sm text-purple-800">Revenue Collected</p>
          </div>
        </div>
      </div>
    </div>
  );
}