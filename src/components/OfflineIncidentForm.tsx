import React, { useState } from 'react';
import { useOfflineData } from '../hooks/useOfflineData';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { AlertTriangle, Upload, CheckCircle, WifiOff, Camera, MapPin } from 'lucide-react';

export default function OfflineIncidentForm() {
  const { user } = useAuth();
  const { createOffline, isOnline } = useOfflineData(
    'incidents',
    () => dataService.getIncidents()
  );

  const [formData, setFormData] = useState({
    incidentType: '',
    subject: '',
    description: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dateOccurred: '',
    timeOccurred: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const incidentTypes = [
    'Noise Complaint',
    'Theft',
    'Vandalism',
    'Dispute',
    'Traffic Violation',
    'Public Disturbance',
    'Property Damage',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const incidentData = {
        reporter_name: user?.name || 'Anonymous',
        reporter_email: user?.email || '',
        incident_type: formData.incidentType,
        subject: formData.subject,
        description: formData.description,
        location: formData.location,
        priority: formData.priority,
        status: 'pending',
        date_occurred: formData.dateOccurred,
        time_occurred: formData.timeOccurred,
        date_submitted: new Date().toISOString().split('T')[0]
      };

      if (isOnline) {
        // Submit directly when online
        await dataService.createIncident(incidentData);
        setSubmitMessage('Incident report submitted successfully!');
      } else {
        // Queue for offline submission
        await createOffline(incidentData);
        setSubmitMessage('Incident report saved offline. Will sync when connection is restored.');
      }

      // Reset form
      setFormData({
        incidentType: '',
        subject: '',
        description: '',
        location: '',
        priority: 'medium',
        dateOccurred: '',
        timeOccurred: ''
      });
    } catch (error) {
      console.error('Failed to submit incident report:', error);
      setSubmitMessage('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Report Incident
        </h3>
        {!isOnline && (
          <div className="flex items-center text-red-600 text-sm">
            <WifiOff className="h-4 w-4 mr-1" />
            Offline Mode
          </div>
        )}
      </div>

      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              You're offline. Your report will be saved and submitted when connection is restored.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Type *
            </label>
            <select
              value={formData.incidentType}
              onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select incident type</option>
              {incidentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the incident"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of what happened"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Where did this incident occur?"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Occurred
            </label>
            <input
              type="date"
              value={formData.dateOccurred}
              onChange={(e) => setFormData({ ...formData, dateOccurred: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Occurred
            </label>
            <input
              type="time"
              value={formData.timeOccurred}
              onChange={(e) => setFormData({ ...formData, timeOccurred: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.incidentType || !formData.subject || !formData.description}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Upload className="h-4 w-4 mr-2 animate-pulse" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Submitting...' : isOnline ? 'Submit Report' : 'Save Offline'}
        </button>

        {submitMessage && (
          <div className={`p-3 rounded-lg ${
            submitMessage.includes('successfully') || submitMessage.includes('saved offline')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              {submitMessage.includes('successfully') || submitMessage.includes('saved offline') ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              {submitMessage}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}