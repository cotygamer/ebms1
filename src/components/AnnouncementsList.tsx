import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Bell, 
  Calendar, 
  User, 
  Eye, 
  Search, 
  Filter,
  AlertTriangle,
  Info,
  Heart,
  Cloud,
  MapPin,
  Clock,
  Star,
  Bookmark,
  Share2,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AnnouncementsList() {
  const { announcements } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<Set<string>>(new Set());

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || announcement.type === filterType;
    const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertTriangle className="h-6 w-6" />;
      case 'event':
        return <Calendar className="h-6 w-6" />;
      case 'health':
        return <Heart className="h-6 w-6" />;
      case 'weather':
        return <Cloud className="h-6 w-6" />;
      case 'emergency':
        return <AlertTriangle className="h-6 w-6" />;
      default:
        return <Bell className="h-6 w-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'event':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'health':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'weather':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'emergency':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedAnnouncements);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAnnouncements(newExpanded);
  };

  const stats = [
    {
      title: 'Total Announcements',
      value: announcements.length,
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Important',
      value: announcements.filter(a => a.priority === 'high').length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Events',
      value: announcements.filter(a => a.type === 'event').length,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Health Updates',
      value: announcements.filter(a => a.type === 'health').length,
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Announcements</h1>
          <p className="text-gray-600">Stay updated with the latest news and events from our barangay</p>
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
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="important">Important</option>
            <option value="event">Events</option>
            <option value="health">Health</option>
            <option value="weather">Weather</option>
            <option value="emergency">Emergency</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => {
          const isExpanded = expandedAnnouncements.has(announcement.id);
          return (
            <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg border ${getTypeColor(announcement.type)}`}>
                      {getAnnouncementIcon(announcement.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)}`}>
                          {announcement.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className={`text-gray-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {announcement.content}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{announcement.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                        </div>
                        {announcement.expires_at && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Expires: {new Date(announcement.expires_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleExpanded(announcement.id)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50">
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {announcement.image_url && (
                  <div className="mb-4">
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements Found</h3>
          <p className="text-gray-600">
            {announcements.length === 0 
              ? "There are no announcements at this time. Check back later for updates."
              : "No announcements match your search criteria."
            }
          </p>
        </div>
      )}
    </div>
  );
}