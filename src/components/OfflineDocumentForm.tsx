import React, { useState } from 'react';
import { useOfflineData } from '../hooks/useOfflineData';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { FileText, Upload, AlertTriangle, CheckCircle, WifiOff, RefreshCw } from 'lucide-react';

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
        resident_id: user?.id || '',
        document_type: formData.documentType,
        purpose: formData.purpose,
        notes: formData.notes,
        status: 'pending',
        fee: 50.00, // Default fee
        payment_status: 'unpaid',
        requested_date: new Date().toISOString().split('T')[0],
        tracking_number: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      };

      console.log('Submitting document request:', documentData);

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
      
      // Trigger data refresh
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('refreshAllData'));
      }, 1000);
    } catch (error) {
      console.error('Failed to submit document request:', error);
      setSubmitMessage(`Failed to submit request: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Request New Document</h3>
        <p className="text-gray-600">Fill out the form below to request a barangay document</p>
      </div>

      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800">Offline Mode</h4>
              <p className="text-sm text-yellow-700">
                Your request will be saved and submitted when connection is restored.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Document Type *
          </label>
          <select
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select document type</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Purpose *
          </label>
          <input
            type="text"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Employment, Business registration, School enrollment"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional information or special requests..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.documentType || !formData.purpose}
          className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-3" />
              {isOnline ? 'Submit Request' : 'Save Offline'}
            </>
          )}
        </button>

        {submitMessage && (
          <div className={`p-4 rounded-lg ${
            submitMessage.includes('successfully') || submitMessage.includes('saved offline')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              {submitMessage.includes('successfully') || submitMessage.includes('saved offline') ? (
                <CheckCircle className="h-5 w-5 mr-3" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-3" />
              )}
              <div>
                <h4 className="font-medium">
                  {submitMessage.includes('successfully') || submitMessage.includes('saved offline') ? 'Success!' : 'Error'}
                </h4>
                <p className="text-sm">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}