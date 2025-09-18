import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, DollarSign, FileText, TrendingUp, ArrowLeft, PieChart, Bell, Plus, LogOut, Receipt, CreditCard, Banknote, Target, BarChart3, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AccountingPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'expenses', label: 'Expenses', icon: Calculator },
    { id: 'budget', label: 'Budget Planning', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'announcements', label: 'Financial Updates', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              {user?.role === 'barangay-official' && (
                <Link
                  to="/barangay-official-dashboard"
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="ml-2 hidden sm:inline">Back</span>
                </Link>
              )}
              <div className="flex items-center space-x-3">
                <Calculator className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Accounting Portal</h1>
                  <p className="text-sm text-gray-600">Financial Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-gray-600">Welcome, {user?.name}</span>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700 border-l-4 border-green-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <AccountingOverview />}
            {activeTab === 'transactions' && <TransactionManagement />}
            {activeTab === 'revenue' && <RevenueManagement />}
            {activeTab === 'expenses' && <ExpenseManagement />}
            {activeTab === 'budget' && <BudgetPlanning />}
            {activeTab === 'reports' && <FinancialReports />}
            {activeTab === 'announcements' && <FinancialAnnouncements />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountingOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const financialData = {
    totalRevenue: 2450000,
    totalExpenses: 1890000,
    netIncome: 560000,
    pendingPayments: 125000,
  };

  const recentTransactions = [
    { id: 1, type: 'Revenue', description: 'Barangay Clearance Fees', amount: 15000, date: '2024-03-15', category: 'Document Fees' },
    { id: 2, type: 'Expense', description: 'Office Supplies', amount: -8500, date: '2024-03-14', category: 'Operations' },
    { id: 3, type: 'Revenue', description: 'Business Permit Fees', amount: 25000, date: '2024-03-13', category: 'Permits' },
    { id: 4, type: 'Expense', description: 'Utilities Payment', amount: -12000, date: '2024-03-12', category: 'Utilities' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="quarterly">This Quarter</option>
          <option value="yearly">This Year</option>
        </select>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ₱{financialData.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ₱{financialData.totalExpenses.toLocaleString()}
              </p>
            </div>
            <Calculator className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">-5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-blue-600">
                ₱{financialData.netIncome.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-orange-600">
                ₱{financialData.pendingPayments.toLocaleString()}
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">3 pending invoices</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <PieChart className="h-16 w-16" />
            <span className="ml-2">Chart visualization would go here</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <TrendingUp className="h-16 w-16" />
            <span className="ml-2">Trend chart would go here</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'Revenue' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'Revenue' ? (
                    <DollarSign className="h-5 w-5 text-green-600" />
                  ) : (
                    <Calculator className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₱{Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{transaction.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionManagement() {
  const [transactions] = useState([
    { id: 1, date: '2024-03-15', description: 'Barangay Clearance - Juan Dela Cruz', type: 'Revenue', amount: 50, category: 'Document Fees', method: 'GCash' },
    { id: 2, date: '2024-03-15', description: 'Office Supplies Purchase', type: 'Expense', amount: -2500, category: 'Operations', method: 'Cash' },
    { id: 3, date: '2024-03-14', description: 'Business Permit - Maria Santos', type: 'Revenue', amount: 1200, category: 'Permits', method: 'Maya' },
    { id: 4, date: '2024-03-14', description: 'Electricity Bill', type: 'Expense', amount: -8500, category: 'Utilities', method: 'Bank Transfer' },
    { id: 5, date: '2024-03-13', description: 'Certificate of Residency - Pedro Garcia', type: 'Revenue', amount: 30, category: 'Document Fees', method: 'Cash Pickup' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-600">₱1,280</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Expenses</p>
              <p className="text-2xl font-bold text-red-600">₱11,000</p>
            </div>
            <Calculator className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
            </div>
            <Receipt className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Flow</p>
              <p className="text-2xl font-bold text-purple-600">-₱9,720</p>
            </div>
            <Wallet className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                      ₱{Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RevenueManagement() {
  const [revenueData] = useState([
    { id: 1, source: 'Barangay Clearance', amount: 45000, month: 'March 2024', status: 'Collected' },
    { id: 2, source: 'Business Permits', amount: 125000, month: 'March 2024', status: 'Collected' },
    { id: 3, source: 'Cedula', amount: 15000, month: 'March 2024', status: 'Pending' },
    { id: 4, source: 'Community Tax', amount: 35000, month: 'March 2024', status: 'Collected' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Revenue Management</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Add Revenue Entry
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₱{item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Collected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExpenseManagement() {
  const [expenseData] = useState([
    { id: 1, category: 'Office Supplies', amount: 25000, date: '2024-03-15', description: 'Paper, pens, folders' },
    { id: 2, category: 'Utilities', amount: 18000, date: '2024-03-14', description: 'Electricity and water bills' },
    { id: 3, category: 'Maintenance', amount: 35000, date: '2024-03-12', description: 'Building repairs' },
    { id: 4, category: 'Transportation', amount: 12000, date: '2024-03-10', description: 'Official travel expenses' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Expense Management</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Add Expense
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenseData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₱{item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BudgetPlanning() {
  const budgetData = [
    { category: 'Personnel Services', allocated: 500000, spent: 125000, remaining: 375000 },
    { category: 'Office Supplies', allocated: 100000, spent: 45000, remaining: 55000 },
    { category: 'Utilities', allocated: 150000, spent: 38000, remaining: 112000 },
    { category: 'Infrastructure', allocated: 800000, spent: 200000, remaining: 600000 },
    { category: 'Health Programs', allocated: 200000, spent: 75000, remaining: 125000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Budget Planning</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Update Budget
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetData.map((item, index) => {
                const usagePercent = (item.spent / item.allocated) * 100;
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{item.allocated.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{item.spent.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{item.remaining.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className={`h-2 rounded-full ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(usagePercent, 100)}%` }}></div>
                        </div>
                        <span className="text-sm">{usagePercent.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">Adjust</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinancialReports() {
  const reports = [
    { id: 1, name: 'Monthly Financial Statement', type: 'PDF', date: '2024-03-15', size: '2.4 MB' },
    { id: 2, name: 'Revenue Analysis Report', type: 'Excel', date: '2024-03-14', size: '1.8 MB' },
    { id: 3, name: 'Expense Breakdown', type: 'PDF', date: '2024-03-12', size: '1.2 MB' },
    { id: 4, name: 'Budget vs Actual Report', type: 'Excel', date: '2024-03-10', size: '2.1 MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                report.type === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {report.type}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Generated on {report.date} • {report.size}
            </p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                Download
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancialAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Online Payment System Available',
      content: 'Residents can now pay barangay fees online through GCash, Maya, and other digital payment methods.',
      type: 'payment',
      status: 'published',
      date: '2024-03-15',
      author: 'Accounting Officer'
    },
    {
      id: 2,
      title: 'Updated Fee Schedule for 2024',
      content: 'Please see the updated fee schedule for all barangay services effective March 2024.',
      type: 'fees',
      status: 'draft',
      date: '2024-03-12',
      author: 'Finance Team'
    }
  ]);

  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'payment'
  });

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement = {
        id: Date.now(),
        ...newAnnouncement,
        status: 'published',
        date: new Date().toISOString().split('T')[0],
        author: user?.name || 'Accounting Officer'
      };
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement({ title: '', content: '', type: 'payment' });
      setShowAddAnnouncement(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Financial Announcements</h2>
        <button
          onClick={() => setShowAddAnnouncement(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </button>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    announcement.type === 'payment' ? 'bg-green-100 text-green-800' :
                    announcement.type === 'fees' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {announcement.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    announcement.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {announcement.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{announcement.content}</p>
                <p className="text-sm text-gray-500">By {announcement.author} • {announcement.date}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Announcement Modal */}
      {showAddAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create Financial Announcement</h3>
              <button
                onClick={() => setShowAddAnnouncement(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Announcement title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="payment">Payment Update</option>
                  <option value="fees">Fee Changes</option>
                  <option value="budget">Budget Information</option>
                  <option value="financial">Financial Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={4}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Announcement content"
                ></textarea>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddAnnouncement(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAnnouncement}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}