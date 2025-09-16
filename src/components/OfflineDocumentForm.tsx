import React, { useState } from 'react';
import { useOfflineData } from '../hooks/useOfflineData';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { FileText, Upload, AlertTriangle, CheckCircle, WifiOff } from 'lucide-react';

export default function OfflineDocumentForm() {
  const { user } = useAuth();
  const { createOffline, isOnline } = useOfflineData(
    'documents',
    () => dataService.getDocuments()
  );

  const [formData, setFormData] = useState({
    documentType: '',
    purpose: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const documentTypes = [
    'Barangay Clearance',
    'Certificate of Indigency',
    'Certificate of Residency',
    'Business Permit',
    'Building Permit'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const documentData = {
        resident_id: user?.id,
        document_type: formData.documentType,
        purpose: formData.purpose,
        notes: formData.notes,
        status: 'pending',
        fee: 50.00, // Default fee
        payment_status: 'unpaid',
        requested_date: new Date().toISOString()
      };

      if (isOnline) {
        // Submit directly when online
        await dataService.createDocument(documentData);
        setSubmitMessage('Document request submitted successfully!');
      } else {
        // Queue for offline submission
        await createOffline(documentData);
        setSubmitMessage('Document request saved offline. Will sync when connection is restored.');
      }

      // Reset form
      setFormData({ documentType: '', purpose: '', notes: '' });
    } catch (error) {
      console.error('Failed to submit document request:', error);
      setSubmitMessage('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Request Document
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
              You're offline. Your request will be saved and submitted when connection is restored.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type *
          </label>
          <select
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select document type</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose *
          </label>
          <input
            type="text"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Employment, Business registration"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional information or special requests"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.documentType || !formData.purpose}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Submitting...' : isOnline ? 'Submit Request' : 'Save Offline'}
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