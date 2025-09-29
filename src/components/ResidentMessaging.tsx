import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  Mail,
  Phone,
  Calendar,
  User,
  Reply,
  Search,
  Filter,
  X,
  AlertTriangle,
  Bell,
  Star,
  RefreshCw
} from 'lucide-react';

export default function ResidentMessaging() {
  const { user } = useAuth();
  const { messages, addMessage } = useData();
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    category: 'general' as 'general' | 'complaint' | 'suggestion' | 'inquiry' | 'emergency',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Filter messages for current user
  const userMessages = messages.filter(msg => msg.sender_email === user?.email);
  
  const filteredMessages = userMessages.filter(message => {
    const matchesSearch = (message.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.message || message.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = async () => {
    if (newMessage.subject && newMessage.message && user) {
      try {
        await addMessage({
          sender_name: user.name,
          sender_email: user.email,
          sender_phone: user.phone || '',
          subject: newMessage.subject,
          message: newMessage.message,
          category: newMessage.category,
          priority: newMessage.priority,
          status: 'unread',
          source: 'portal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        setNewMessage({
          subject: '',
          message: '',
          category: 'general',
          priority: 'medium'
        });
        setShowComposeModal(false);
      } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'replied':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'read':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'archived':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'replied':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'complaint':
        return 'text-red-600 bg-red-50';
      case 'suggestion':
        return 'text-yellow-600 bg-yellow-50';
      case 'inquiry':
        return 'text-blue-600 bg-blue-50';
      case 'emergency':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const stats = [
    {
      title: 'Total Messages',
      value: userMessages.length,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Reply',
      value: userMessages.filter(m => m.status === 'read' || m.status === 'unread').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Replied',
      value: userMessages.filter(m => m.status === 'replied').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'This Month',
      value: userMessages.filter(m => {
        const msgDate = new Date(m.created_at);
        const now = new Date();
        return msgDate.getMonth() === now.getMonth() && msgDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Messages</h1>
              <p className="text-gray-600">Send messages to barangay officials and view replies</p>
            </div>
          </div>
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Message
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredMessages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                message.status === 'unread' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`} onClick={() => setSelectedMessage(message)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{message.subject || 'No Subject'}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(message.category)}`}>
                        {(message.category || 'general').toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {(message.priority || 'medium').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {message.message || message.content || 'No content'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(message.created_at).toLocaleDateString()}
                      </div>
                      {message.replied_at && (
                        <div className="flex items-center text-green-600">
                          <Reply className="h-3 w-3 mr-1" />
                          Replied by {message.replied_by}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span className="ml-2 capitalize">{message.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages</h3>
            <p className="text-gray-600 mb-6">
              {userMessages.length === 0 
                ? "You haven't sent any messages yet. Start a conversation with barangay officials."
                : "No messages match your search criteria."
              }
            </p>
            <button
              onClick={() => setShowComposeModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Send Message
            </button>
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Send Message to Barangay</h3>
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What is this message about?"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    value={newMessage.category}
                    onChange={(e) => setNewMessage({ ...newMessage, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="inquiry">Service Inquiry</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priority
                  </label>
                  <select
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Message *
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Message Guidelines</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Be clear and specific about your concern or inquiry</li>
                      <li>• Include relevant details like dates, locations, or reference numbers</li>
                      <li>• For emergencies, call our hotline instead: +63 2 8123 4567</li>
                      <li>• Expect a response within 24-48 hours during business days</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.subject || !newMessage.message}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  <Send className="h-4 w-4 mr-2 inline" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedMessage.category)}`}>
                    {selectedMessage.category.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusIcon(selectedMessage.status)}
                    <span className="ml-2 capitalize">{selectedMessage.status}</span>
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-4">{selectedMessage.subject}</h4>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Sent on {new Date(selectedMessage.created_at).toLocaleDateString()} at {new Date(selectedMessage.created_at).toLocaleTimeString()}
                </div>
              </div>

              {/* Reply Section */}
              {selectedMessage.reply && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                    <Reply className="h-5 w-5 mr-2" />
                    Official Reply
                  </h4>
                  <p className="text-green-800 leading-relaxed mb-4">{selectedMessage.reply}</p>
                  <div className="flex items-center text-sm text-green-700">
                    <User className="h-4 w-4 mr-2" />
                    Replied by {selectedMessage.replied_by} on {selectedMessage.replied_at ? new Date(selectedMessage.replied_at).toLocaleDateString() : ''}
                  </div>
                </div>
              )}

              {!selectedMessage.reply && selectedMessage.status !== 'archived' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Awaiting Reply</h4>
                      <p className="text-sm text-yellow-700">
                        Your message has been received and is being reviewed by barangay officials.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}