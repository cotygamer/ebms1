import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  BarChart3, 
  PieChart, 
  FileText, 
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  LogOut,
  ArrowLeft,
  Save,
  X,
  Banknote,
  CreditCard,
  Building2,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function AccountingPortal() {
  const { user, logout } = useAuth();
  const { transactions, documents, addTransaction, updateTransaction, deleteTransaction } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newTransaction, setNewTransaction] = useState({
    type: 'revenue' as 'revenue' | 'expense',
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
    referenceNumber: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.category) {
      addTransaction({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        transactionDate: new Date().toISOString().split('T')[0]
      });
      setNewTransaction({
        type: 'revenue',
        description: '',
        amount: '',
        category: '',
        paymentMethod: '',
        referenceNumber: ''
      });
      setShowTransactionForm(false);
    }
  };

  // Calculate financial metrics
  const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const documentRevenue = documents.filter(d => d.paymentStatus === 'paid').reduce((sum, d) => sum + d.fee, 0);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₱${totalRevenue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Total Expenses', 
      value: `₱${totalExpenses.toLocaleString()}`, 
      icon: TrendingDown, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      label: 'Net Income', 
      value: `₱${netIncome.toLocaleString()}`, 
      icon: DollarSign, 
      color: netIncome >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netIncome >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    { 
      label: 'Document Revenue', 
      value: `₱${documentRevenue.toLocaleString()}`, 
      icon: Receipt, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-12 w-12 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Plus className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Add Transaction</h4>
              <p className="text-sm text-gray-600">Record income/expense</p>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('transactions')}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Receipt className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">View Transactions</h4>
              <p className="text-sm text-gray-600">Browse all records</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Generate Report</h4>
              <p className="text-sm text-gray-600">Financial reports</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <Download className="h-8 w-8 text-yellow-600 mr-3" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Export Data</h4>
              <p className="text-sm text-gray-600">Download records</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button 
            onClick={() => setActiveTab('transactions')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'revenue' ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.category} • {transaction.transactionDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'revenue' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">₱{totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-800">Total Revenue</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <TrendingDown className="h-12 w-12 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600 mb-1">₱{totalExpenses.toLocaleString()}</div>
            <div className="text-sm text-red-800">Total Expenses</div>
          </div>
          
          <div className={`text-center p-4 rounded-lg ${netIncome >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <DollarSign className={`h-12 w-12 mx-auto mb-2 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div className={`text-2xl font-bold mb-1 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₱{netIncome.toLocaleString()}
            </div>
            <div className={`text-sm ${netIncome >= 0 ? 'text-green-800' : 'text-red-800'}`}>Net Income</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Transaction Management</h2>
        <button
          onClick={() => setShowTransactionForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Document Fees">Document Fees</option>
            <option value="Permit Fees">Permit Fees</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Utilities">Utilities</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Salaries">Salaries</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    {transaction.referenceNumber && (
                      <div className="text-xs text-gray-500">Ref: {transaction.referenceNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'revenue' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.transactionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'transactions':
        return renderTransactions();
      case 'reports':
        return <div className="text-center py-12"><BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Financial reports coming soon</p></div>;
      default:
        return renderDashboard();
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Calculator },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              {user?.role === 'barangay-official' && (
                <Link
                  to="/barangay-official-dashboard"
                  className="text-blue-200 hover:text-white flex items-center"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="ml-2 hidden sm:inline">Back</span>
                </Link>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <Calculator className="mr-3 h-8 w-8" />
                  Accounting Portal
                </h1>
                <p className="text-blue-100 mt-2 text-sm sm:text-base">Financial Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-blue-100 text-sm">Welcome, {user?.name}</p>
                <p className="text-xs text-blue-200 capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
              <button
                onClick={() => setShowTransactionForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter transaction description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {newTransaction.type === 'revenue' ? (
                      <>
                        <option value="Document Fees">Document Fees</option>
                        <option value="Permit Fees">Permit Fees</option>
                        <option value="Fines">Fines</option>
                        <option value="Other Revenue">Other Revenue</option>
                      </>
                    ) : (
                      <>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Salaries">Salaries</option>
                        <option value="Other Expenses">Other Expenses</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={newTransaction.paymentMethod}
                  onChange={(e) => setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number (Optional)</label>
                <input
                  type="text"
                  value={newTransaction.referenceNumber}
                  onChange={(e) => setNewTransaction({ ...newTransaction, referenceNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Transaction reference number"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTransactionForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{selectedTransaction.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedTransaction.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className={`text-sm font-semibold ${
                    selectedTransaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₱{selectedTransaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <p className="text-sm text-gray-900">{selectedTransaction.category}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <p className="text-sm text-gray-900">{selectedTransaction.paymentMethod}</p>
              </div>
              
              {selectedTransaction.referenceNumber && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Reference Number</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.referenceNumber}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-700">Transaction Date</label>
                <p className="text-sm text-gray-900">{selectedTransaction.transactionDate}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}