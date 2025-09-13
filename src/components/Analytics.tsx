import React from 'react';
import { useData } from '../contexts/DataContext';
import { Users, UserCheck, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Analytics() {
  const { residents, documents, transactions, announcements } = useData();
  
  // Calculate real-time statistics
  const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const documentRevenue = documents.filter(d => d.paymentStatus === 'paid').reduce((sum, d) => sum + d.fee, 0);
  const pendingDocuments = documents.filter(d => d.status === 'pending').length;
  const processedDocuments = documents.filter(d => d.status === 'released').length;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Analytics Overview</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-3xl font-bold text-blue-600">{residents.length}</p>
              <p className="text-sm text-green-600">Active residents</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Residents</p>
              <p className="text-3xl font-bold text-green-600">
                {residents.filter(r => r.verificationStatus === 'verified').length}
              </p>
              <p className="text-sm text-green-600">
                {residents.length > 0 ? Math.round((residents.filter(r => r.verificationStatus === 'verified').length / residents.length) * 100) : 0}% verified
              </p>
            </div>
            <UserCheck className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents Processed</p>
              <p className="text-3xl font-bold text-purple-600">{processedDocuments}</p>
              <p className="text-sm text-yellow-600">{pendingDocuments} pending</p>
            </div>
            <FileText className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
              <p className="text-3xl font-bold text-yellow-600">₱{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">Total income</p>
            </div>
            <TrendingUp className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status Distribution</h3>
          <div className="space-y-4">
            {['verified', 'semi-verified', 'details-updated', 'non-verified'].map((status) => {
              const count = residents.filter(r => r.verificationStatus === status).length;
              const percentage = residents.length > 0 ? (count / residents.length) * 100 : 0;
              const colors = {
                'verified': { bg: 'bg-green-500', text: 'text-green-600' },
                'semi-verified': { bg: 'bg-yellow-500', text: 'text-yellow-600' },
                'details-updated': { bg: 'bg-blue-500', text: 'text-blue-600' },
                'non-verified': { bg: 'bg-red-500', text: 'text-red-600' }
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 ${colors[status as keyof typeof colors].bg} rounded mr-3`}></div>
                    <span className="text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[status as keyof typeof colors].bg} h-2 rounded-full`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">₱{totalRevenue.toLocaleString()}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Expenses</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">₱{totalExpenses.toLocaleString()}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ 
                    width: `${totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0}%` 
                  }}></div>
                </div>
                <span className="text-sm text-gray-600">Outgoing</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded mr-3 ${(totalRevenue - totalExpenses) >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                <span className="text-sm text-gray-700">Net Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${(totalRevenue - totalExpenses) >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  ₱{(totalRevenue - totalExpenses).toLocaleString()}
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${(totalRevenue - totalExpenses) >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`} 
                    style={{ width: '100%' }}></div>
                </div>
                <span className={`text-sm ${(totalRevenue - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(totalRevenue - totalExpenses) >= 0 ? 'Profit' : 'Loss'}
                </span>
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
            <h4 className="text-2xl font-bold text-blue-600">{residents.length}</h4>
            <p className="text-sm text-blue-800">Total Residents</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="text-2xl font-bold text-green-600">{documents.length}</h4>
            <p className="text-sm text-green-800">Document Requests</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="text-2xl font-bold text-purple-600">₱{totalRevenue.toLocaleString()}</h4>
            <p className="text-sm text-purple-800">Revenue Collected</p>
          </div>
        </div>
      </div>

      {/* Document Processing Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Processing Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.status === 'pending').length}</h4>
            <p className="text-sm text-yellow-800">Pending</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="text-2xl font-bold text-blue-600">{documents.filter(d => d.status === 'processing').length}</h4>
            <p className="text-sm text-blue-800">Processing</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="text-2xl font-bold text-green-600">{documents.filter(d => d.status === 'ready').length}</h4>
            <p className="text-sm text-green-800">Ready</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="text-2xl font-bold text-purple-600">{documents.filter(d => d.status === 'released').length}</h4>
            <p className="text-sm text-purple-800">Released</p>
          </div>
        </div>
      </div>

      {/* Announcements Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <h4 className="text-2xl font-bold text-indigo-600">{announcements.length}</h4>
            <p className="text-sm text-indigo-800">Total Announcements</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <h4 className="text-2xl font-bold text-red-600">{announcements.filter(a => a.priority === 'high').length}</h4>
            <p className="text-sm text-red-800">High Priority</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="text-2xl font-bold text-green-600">{announcements.filter(a => a.status === 'published').length}</h4>
            <p className="text-sm text-green-800">Published</p>
          </div>
        </div>
      </div>
    </div>
  );
}