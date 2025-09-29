import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Search,
  Users,
  Hash,
  Bell,
  BellOff,
  Settings,
  User,
  Clock,
  CheckCircle,
  X,
  Plus,
  Shield
} from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  timestamp: string;
  channel: string;
  isOfficial?: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'announcements' | 'help' | 'events';
  memberCount: number;
  isOfficial: boolean;
}

export default function CommunityChat() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: Channel[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'Community-wide discussions and conversations',
      type: 'general',
      memberCount: 1245,
      isOfficial: false
    },
    {
      id: 'announcements',
      name: 'Official Announcements',
      description: 'Official announcements from barangay officials',
      type: 'announcements',
      memberCount: 1245,
      isOfficial: true
    },
    {
      id: 'help',
      name: 'Help & Support',
      description: 'Ask questions and get help from the community',
      type: 'help',
      memberCount: 892,
      isOfficial: false
    },
    {
      id: 'events',
      name: 'Community Events',
      description: 'Discuss upcoming events and activities',
      type: 'events',
      memberCount: 567,
      isOfficial: false
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'official1',
      userName: 'Barangay Captain',
      userRole: 'barangay-official',
      content: 'Good morning everyone! Reminder that the community health drive is happening this weekend. Please bring your health cards.',
      timestamp: '2024-03-18T08:00:00Z',
      channel: 'announcements',
      isOfficial: true
    },
    {
      id: '2',
      userId: 'resident1',
      userName: 'Maria Santos',
      userRole: 'resident',
      content: 'Thank you for the reminder! What time does it start?',
      timestamp: '2024-03-18T08:15:00Z',
      channel: 'announcements'
    },
    {
      id: '3',
      userId: 'official1',
      userName: 'Barangay Captain',
      userRole: 'barangay-official',
      content: 'The health drive starts at 8:00 AM and runs until 4:00 PM. See you there!',
      timestamp: '2024-03-18T08:20:00Z',
      channel: 'announcements',
      isOfficial: true
    },
    {
      id: '4',
      userId: 'resident2',
      userName: 'Juan Dela Cruz',
      userRole: 'resident',
      content: 'Has anyone noticed the street light on Main Street is not working? It\'s been dark for 3 nights now.',
      timestamp: '2024-03-18T19:30:00Z',
      channel: 'general'
    },
    {
      id: '5',
      userId: 'resident3',
      userName: 'Ana Garcia',
      userRole: 'resident',
      content: 'Yes, I reported it yesterday. The maintenance team said they\'ll fix it this week.',
      timestamp: '2024-03-18T19:45:00Z',
      channel: 'general'
    }
  ]);

  const filteredMessages = messages.filter(message => 
    message.channel === activeChannel &&
    (message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
     message.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const message: Message = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        channel: activeChannel,
        isOfficial: user.role !== 'resident'
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'announcements':
        return <Bell className="h-4 w-4" />;
      case 'help':
        return <Shield className="h-4 w-4" />;
      case 'events':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Hash className="h-4 w-4" />;
    }
  };

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'announcements':
        return 'text-red-600 bg-red-50';
      case 'help':
        return 'text-blue-600 bg-blue-50';
      case 'events':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex">
      {/* Channels Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Community Chat</h2>
              <p className="text-sm text-gray-600">Connect with neighbors</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Channels</h3>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  activeChannel === channel.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`p-1 rounded ${getChannelColor(channel.type)} mr-3`}>
                  {getChannelIcon(channel.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{channel.name}</span>
                    {channel.isOfficial && (
                      <Shield className="h-3 w-3 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{channel.memberCount} members</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getChannelColor(channels.find(c => c.id === activeChannel)?.type || 'general')}`}>
                {getChannelIcon(channels.find(c => c.id === activeChannel)?.type || 'general')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {channels.find(c => c.id === activeChannel)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {channels.find(c => c.id === activeChannel)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                message.isOfficial ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {message.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{message.userName}</span>
                  {message.isOfficial && (
                    <Shield className="h-3 w-3 text-blue-600" />
                  )}
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                </div>
                <div className={`p-3 rounded-lg ${
                  message.isOfficial 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50'
                }`}>
                  <p className="text-gray-800">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200">
          {channels.find(c => c.id === activeChannel)?.isOfficial && user?.role === 'resident' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  This is an official announcements channel. Only barangay officials can post messages.
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  channels.find(c => c.id === activeChannel)?.isOfficial && user?.role === 'resident'
                    ? "You can only read messages in this channel"
                    : "Type your message..."
                }
                disabled={channels.find(c => c.id === activeChannel)?.isOfficial && user?.role === 'resident'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || (channels.find(c => c.id === activeChannel)?.isOfficial && user?.role === 'resident')}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Paperclip className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}