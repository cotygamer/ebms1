import React, { useState } from 'react';
import { Camera, Plus, Eye, Edit3, Trash2, Calendar, MapPin, Users, Award, Filter, Search } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'health' | 'education' | 'environment' | 'social' | 'technology';
  status: 'planning' | 'ongoing' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  budget: number;
  location: string;
  beneficiaries: number;
  images: string[];
  achievements: string[];
}

export default function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Digital Barangay Management System',
      description: 'Implementation of comprehensive digital platform for all barangay services including online registration, QR codes, and integrated portals.',
      category: 'technology',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-03-15',
      budget: 500000,
      location: 'Barangay Hall',
      beneficiaries: 1245,
      images: ['https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'],
      achievements: ['100% digital transformation', '98% user satisfaction', 'Reduced processing time by 80%']
    },
    {
      id: '2',
      title: 'Community Health Center Upgrade',
      description: 'Complete renovation and modernization of the barangay health center with new medical equipment and facilities.',
      category: 'health',
      status: 'completed',
      startDate: '2023-06-01',
      endDate: '2023-12-15',
      budget: 750000,
      location: 'Barangay Health Center',
      beneficiaries: 1245,
      images: ['https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg'],
      achievements: ['Modern medical equipment installed', 'Increased capacity by 50%', 'Improved healthcare services']
    },
    {
      id: '3',
      title: 'Road Infrastructure Improvement',
      description: 'Major road rehabilitation project covering all main streets within the barangay with proper drainage systems.',
      category: 'infrastructure',
      status: 'completed',
      startDate: '2023-03-01',
      endDate: '2023-08-30',
      budget: 1200000,
      location: 'Main Streets',
      beneficiaries: 1245,
      images: ['https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg'],
      achievements: ['5km of roads improved', 'Better drainage system', 'Reduced flooding incidents']
    },
    {
      id: '4',
      title: 'Youth Skills Development Program',
      description: 'Comprehensive training program for youth including computer literacy, entrepreneurship, and vocational skills.',
      category: 'education',
      status: 'ongoing',
      startDate: '2024-02-01',
      budget: 300000,
      location: 'Community Center',
      beneficiaries: 150,
      images: ['https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg'],
      achievements: ['120 youth enrolled', '80% completion rate', '60 certificates awarded']
    },
    {
      id: '5',
      title: 'Environmental Protection Initiative',
      description: 'Tree planting and waste management program to promote environmental sustainability in the community.',
      category: 'environment',
      status: 'ongoing',
      startDate: '2024-01-15',
      budget: 150000,
      location: 'Various locations',
      beneficiaries: 1245,
      images: ['https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg'],
      achievements: ['500 trees planted', 'Waste segregation implemented', '30% waste reduction']
    },
    {
      id: '6',
      title: 'Senior Citizens Assistance Program',
      description: 'Monthly assistance and healthcare support program specifically designed for senior citizens in the barangay.',
      category: 'social',
      status: 'ongoing',
      startDate: '2023-01-01',
      budget: 400000,
      location: 'Barangay Hall',
      beneficiaries: 89,
      images: ['https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg'],
      achievements: ['89 seniors enrolled', 'Monthly health checkups', 'Financial assistance provided']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'infrastructure' as 'infrastructure' | 'health' | 'education' | 'environment' | 'social' | 'technology',
    status: 'planning' as 'planning' | 'ongoing' | 'completed' | 'on-hold',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
    beneficiaries: '',
    imageUrl: '',
    achievements: [] as string[]
  });
  const [newAchievement, setNewAchievement] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'infrastructure':
        return 'bg-blue-100 text-blue-800';
      case 'health':
        return 'bg-red-100 text-red-800';
      case 'education':
        return 'bg-green-100 text-green-800';
      case 'environment':
        return 'bg-emerald-100 text-emerald-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'technology':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description && newProject.budget && newProject.location && newProject.beneficiaries) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        status: newProject.status,
        startDate: newProject.startDate,
        endDate: newProject.endDate || undefined,
        budget: parseInt(newProject.budget),
        location: newProject.location,
        beneficiaries: parseInt(newProject.beneficiaries),
        images: newProject.imageUrl ? [newProject.imageUrl] : ['https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'],
        achievements: newProject.achievements
      };
      
      setProjects(prev => [project, ...prev]);
      setNewProject({
        title: '',
        description: '',
        category: 'infrastructure',
        status: 'planning',
        startDate: '',
        endDate: '',
        budget: '',
        location: '',
        beneficiaries: '',
        imageUrl: '',
        achievements: []
      });
      setShowAddProject(false);
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setNewProject(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setNewProject(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Projects & Gallery</h2>
        <button
          onClick={() => setShowAddProject(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
            </div>
            <Camera className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <Award className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ongoing</p>
              <p className="text-3xl font-bold text-yellow-600">
                {projects.filter(p => p.status === 'ongoing').length}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-3xl font-bold text-purple-600">
                ₱{projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </p>
            </div>
            <Users className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="social">Social</option>
            <option value="technology">Technology</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="planning">Planning</option>
            <option value="on-hold">On Hold</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredProjects.length} projects found
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{project.startDate} {project.endDate && `- ${project.endDate}`}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{project.beneficiaries} beneficiaries</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  ₱{project.budget.toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Impact Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Impact Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-green-800">Completed Projects</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {projects.reduce((sum, p) => sum + p.beneficiaries, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-800">Total Beneficiaries</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-1">
              ₱{projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
            </div>
            <div className="text-sm text-purple-800">Total Investment</div>
          </div>
        </div>
      </div>
      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProject.title}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProject.images[0]}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Details</h4>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedProject.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedProject.status}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Budget</label>
                      <p className="text-sm text-gray-900">₱{selectedProject.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Beneficiaries</label>
                      <p className="text-sm text-gray-900">{selectedProject.beneficiaries}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Key Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.achievements.map((achievement, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">{achievement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Project</h3>
                <button
                  onClick={() => setShowAddProject(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="environment">Environment</option>
                    <option value="social">Social</option>
                    <option value="technology">Technology</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₱)</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter budget amount"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiaries</label>
                  <input
                    type="number"
                    value={newProject.beneficiaries}
                    onChange={(e) => setNewProject({ ...newProject, beneficiaries: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of beneficiaries"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newProject.imageUrl}
                  onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL or leave blank for default"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter achievement"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                    />
                    <button
                      type="button"
                      onClick={handleAddAchievement}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  {newProject.achievements.length > 0 && (
                    <div className="space-y-2">
                      {newProject.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                          <span className="text-green-800">{achievement}</span>
                          <button
                            onClick={() => handleRemoveAchievement(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddProject(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}