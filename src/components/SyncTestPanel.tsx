import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  AlertCircle, 
  Users,
  Bell,
  DollarSign,
  RefreshCw
} from 'lucide-react';

interface TestResult {
  test: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  timestamp?: string;
}

export default function SyncTestPanel() {
  const { user } = useAuth();
  const { addDocument, addComplaint, addAnnouncement, addTransaction } = useData();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (testName: string, status: TestResult['status'], message: string) => {
    setTestResults(prev => prev.map(result => 
      result.test === testName 
        ? { ...result, status, message, timestamp: new Date().toISOString() }
        : result
    ));
  };

  const runSynchronizationTests = async () => {
    setIsRunning(true);
    
    // Initialize test results
    const tests = [
      { test: 'Document Creation Test', status: 'pending' as const, message: 'Waiting to start...' },
      { test: 'Incident Report Test', status: 'pending' as const, message: 'Waiting to start...' },
      { test: 'Announcement Test', status: 'pending' as const, message: 'Waiting to start...' },
      { test: 'Transaction Test', status: 'pending' as const, message: 'Waiting to start...' },
      { test: 'Cross-Portal Visibility Test', status: 'pending' as const, message: 'Waiting to start...' },
      { test: 'Data Consistency Test', status: 'pending' as const, message: 'Waiting to start...' }
    ];
    
    setTestResults(tests);

    try {
      // Test 1: Document Creation
      updateTestResult('Document Creation Test', 'running', 'Creating test document...');
      await addDocument({
        residentId: user?.id || 'test-resident',
        documentType: 'Test Document - Sync Verification',
        status: 'pending',
        fee: 0,
        paymentStatus: 'unpaid',
        purpose: 'System synchronization test'
      });
      updateTestResult('Document Creation Test', 'success', 'Document created and synced successfully');

      // Wait a moment for real-time sync
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 2: Incident Report
      updateTestResult('Incident Report Test', 'running', 'Creating test incident report...');
      await addComplaint({
        residentName: user?.name || 'Test User',
        residentEmail: user?.email || 'test@example.com',
        type: 'test',
        subject: 'Test Incident - Sync Verification',
        description: 'This is a test incident to verify synchronization across all portals.',
        status: 'pending',
        priority: 'low',
        dateSubmitted: new Date().toISOString().split('T')[0],
        assignedTo: '',
        location: 'Test Location',
        dateOccurred: new Date().toISOString().split('T')[0],
        timeOccurred: new Date().toTimeString().split(' ')[0],
        witnessName: '',
        witnessContact: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      updateTestResult('Incident Report Test', 'success', 'Incident report created and synced successfully');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 3: Announcement
      updateTestResult('Announcement Test', 'running', 'Creating test announcement...');
      await addAnnouncement({
        title: 'Test Announcement - Sync Verification',
        content: 'This is a test announcement to verify synchronization across all portals.',
        type: 'notice',
        priority: 'low',
        status: 'published',
        author: user?.name || 'System Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      updateTestResult('Announcement Test', 'success', 'Announcement created and synced successfully');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 4: Transaction
      updateTestResult('Transaction Test', 'running', 'Creating test transaction...');
      await addTransaction({
        type: 'revenue',
        description: 'Test Transaction - Sync Verification',
        amount: 1,
        category: 'Test Category',
        paymentMethod: 'test',
        referenceNumber: `TEST-${Date.now()}`,
        transactionDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      updateTestResult('Transaction Test', 'success', 'Transaction created and synced successfully');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 5: Cross-Portal Visibility
      updateTestResult('Cross-Portal Visibility Test', 'running', 'Checking data visibility across portals...');
      const [documents, incidents, announcements, transactions] = await Promise.all([
        dataService.getDocuments(),
        dataService.getIncidents(),
        dataService.getAnnouncements(),
        dataService.getTransactions()
      ]);

      const hasTestData = 
        documents.some(d => d.document_type?.includes('Test Document')) &&
        incidents.some(i => i.subject?.includes('Test Incident')) &&
        announcements.some(a => a.title?.includes('Test Announcement')) &&
        transactions.some(t => t.description?.includes('Test Transaction'));

      if (hasTestData) {
        updateTestResult('Cross-Portal Visibility Test', 'success', 'All test data visible across portals');
      } else {
        updateTestResult('Cross-Portal Visibility Test', 'error', 'Some test data not visible across portals');
      }

      // Test 6: Data Consistency
      updateTestResult('Data Consistency Test', 'running', 'Validating data consistency...');
      const consistencyResult = await dataService.validateDataConsistency();
      
      if (consistencyResult.valid) {
        updateTestResult('Data Consistency Test', 'success', 'Data consistency validated successfully');
      } else {
        updateTestResult('Data Consistency Test', 'error', `Data consistency issues: ${consistencyResult.issues?.length || 0} problems found`);
      }

    } catch (error) {
      console.error('Test execution failed:', error);
      // Update any pending tests as errors
      setTestResults(prev => prev.map(result => 
        result.status === 'pending' || result.status === 'running'
          ? { ...result, status: 'error', message: `Test failed: ${error.message}` }
          : result
      ));
    } finally {
      setIsRunning(false);
    }
  };

  const getTestIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTestColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getModuleIcon = (testName: string) => {
    if (testName.includes('Document')) return <FileText className="h-4 w-4" />;
    if (testName.includes('Incident')) return <AlertCircle className="h-4 w-4" />;
    if (testName.includes('Announcement')) return <Bell className="h-4 w-4" />;
    if (testName.includes('Transaction')) return <DollarSign className="h-4 w-4" />;
    if (testName.includes('Visibility')) return <Users className="h-4 w-4" />;
    return <TestTube className="h-4 w-4" />;
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <TestTube className="h-6 w-6 mr-2" />
          Synchronization Test Panel
        </h2>
        <button
          onClick={runSynchronizationTests}
          disabled={isRunning}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Sync Tests'}
        </button>
      </div>

      {/* Test Results Summary */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-blue-600">{totalTests}</p>
              </div>
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getTestColor(result.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTestIcon(result.status)}
                    {getModuleIcon(result.test)}
                    <div>
                      <h4 className="font-medium text-gray-900">{result.test}</h4>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  {result.timestamp && (
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Test Instructions</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• Click "Run Sync Tests" to verify data synchronization across all modules</p>
          <p>• Tests will create sample data and verify it appears in all relevant portals</p>
          <p>• Check the Admin Portal and Barangay Official Portal to confirm test data visibility</p>
          <p>• All test data is clearly marked with "Test" in the title/description</p>
          <p>• Test data can be safely deleted after verification</p>
        </div>
      </div>
    </div>
  );
}