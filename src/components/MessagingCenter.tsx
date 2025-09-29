import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Archive, 
  Star,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  MoreVertical,
  X,
  Plus,
  Inbox,
  Users,
  Bell,
  Flag,
  ArrowLeft,
  Download,
  Paperclip
} from 'lucide-react';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  category: 'general' | 'complaint' | 'suggestion' | 'inquiry' | 'emergency';
  priority: 'low' | 'medium' | 'high';
  status: 'unread' | 'read' | 'replied' | 'archived';
  submittedAt: string;
  repliedAt?: string;
  repliedBy?: string;
  reply?: string;
  source: 'website' | 'portal' | 'phone' | 'walk-in';
}

export default function MessagingCenter() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderName: 'Maria Santos',
      senderEmail: 'maria.santos@email.com',
      senderPhone: '+63 912 345 6789',
      subject: 'Inquiry about Barangay Clearance',
      message: 'Good day! I would like to inquire about the requirements for getting a barangay clearance. I need it for my job application. How long does the processing take and what documents do I need to bring? Thank you.',
      category: 'inquiry',
      priority: 'medium',
      status: 'unread',
      submittedAt: '2024-03-20T09:30:00Z',
      source: 'website'
    },
    {
      id: '2',
      senderName: 'Juan Dela Cruz',
      senderEmail: 'juan.delacruz@email.com',
      subject: 'Suggestion for Community Garden',
      message: 'Hello! I would like to suggest creating a community garden in the vacant lot near the health center. This could help promote healthy living and community bonding. I am willing to volunteer and help organize this project.',
      category: 'suggestion',
      priority: 'low',
      status: 'read',
      submittedAt: '2024-03-19T14:15:00Z',
      source: 'website'
    },
    {
      id: '3',
      senderName: 'Ana Garcia',
      senderEmail: 'ana.garcia@email.com',
      senderPhone: '+63 917 123 4567',
      subject: 'Street Light Not Working',
      message: 'The street light on Main Street corner has been broken for a week now. It makes the area very dark and unsafe at night. Can someone please fix this as soon as possible?',
      category: 'complaint',
      priority: 'high',
      status: 'replied',
      submittedAt: '2024-03-18T20:45:00Z',
      repliedAt: '2024-03-19T08:00:00Z',
      repliedBy: 'Barangay Official',
      reply: 'Thank you for reporting this issue. We have forwarded your concern to our maintenance team and they will fix the street light within 2-3 business days.',
      source: 'website'
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
  };

  const handleReply = (messageId: string) => {
    if (replyText.trim()) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? {
          ...msg,
          status: 'replied',
          reply: replyText,
          repliedAt: new Date().toISOString(),
          repliedBy: user?.name || 'Barangay Official'
        } : msg
      ));
      setReplyText('');
      setShowReplyModal(false);
      setSelectedMessage(null);
    }
  };

  const handleArchive = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'archived' } : msg
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'complaint':
        return <AlertTriangle className="h-4 w-4" />;
      case 'suggestion':
        return <Star className="h-4 w-4" />;
      case 'inquiry':
        return <MessageSquare className="h-4 w-4" />;
      case 'emergency':
        return <Bell className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Messages',
      value: messages.length,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Unread',
      value: messages.filter(m => m.status === 'unread').length,
      icon: Bell,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Replied',
      value: messages.filter(m => m.status === 'replied').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'High Priority',
      value: messages.filter(m => m.priority === 'high').length,
      icon: Flag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
            Messaging Center
          </h2>
          <p className="text-gray-600 mt-2">Manage community messages and inquiries from residents</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all`}>
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search messages by name, subject, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value="all">All Categories</option>
              <option value="inquiry">Inquiry</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="emergency">Emergency</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredMessages.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                message.status === 'unread' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`} onClick={() => {
                setSelectedMessage(message);
                if (message.status === 'unread') {
                  handleMarkAsRead(message.id);
                }
              }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {message.senderName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`font-semibold ${message.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.senderName}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(message.category)}`}>
                          {getCategoryIcon(message.category)}
                          <span className="ml-1">{message.category.toUpperCase()}</span>
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {message.priority.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className={`font-medium mb-2 ${message.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.subject}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {message.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(message.submittedAt).toLocaleDateString()} at {new Date(message.submittedAt).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {message.senderEmail}
                        </div>
                        {message.senderPhone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {message.senderPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {message.status === 'unread' && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {messages.length === 0 
                ? "No messages have been received yet from the community."
                : "No messages match your search criteria."
              }
            </p>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Sender Information */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Sender Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-blue-700">Name</label>
                    <p className="text-blue-900 font-medium">{selectedMessage.senderName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Email</label>
                    <p className="text-blue-900">{selectedMessage.senderEmail}</p>
                  </div>
                  {selectedMessage.senderPhone && (
                    <div>
                      <label className="text-sm font-medium text-blue-700">Phone</label>
                      <p className="text-blue-900">{selectedMessage.senderPhone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-blue-700">Source</label>
                    <p className="text-blue-900 capitalize">{selectedMessage.source}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedMessage.category)}`}>
                    {getCategoryIcon(selectedMessage.category)}
                    <span className="ml-2">{selectedMessage.category.toUpperCase()}</span>
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-4">{selectedMessage.subject}</h4>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Received on {new Date(selectedMessage.submittedAt).toLocaleDateString()} at {new Date(selectedMessage.submittedAt).toLocaleTimeString()}
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
                    Replied by {selectedMessage.repliedBy} on {selectedMessage.repliedAt ? new Date(selectedMessage.repliedAt).toLocaleDateString() : ''}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleArchive(selectedMessage.id)}
                    className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </button>
                </div>
                
                {selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => setShowReplyModal(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply to Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Reply to Message</h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">Original Message</h4>
                <p className="text-sm text-gray-700 mb-2"><strong>From:</strong> {selectedMessage.senderName}</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Subject:</strong> {selectedMessage.subject}</p>
                <p className="text-sm text-gray-600">{selectedMessage.message}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your reply here..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReply(selectedMessage.id)}
                  disabled={!replyText.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all"
                >
                  <Send className="h-4 w-4 mr-2 inline" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}