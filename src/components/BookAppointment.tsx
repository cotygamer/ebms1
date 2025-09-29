import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Plus,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Eye,
  Edit,
  Trash2,
  Stethoscope,
  FileText,
  Heart,
  Shield,
  Activity
} from 'lucide-react';

interface Appointment {
  id: string;
  service: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  assignedStaff?: string;
  location: string;
}

export default function BookAppointment() {
  const { user } = useAuth();
  const { addAppointment, appointments } = useData();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    service: '',
    serviceType: '',
    date: '',
    time: '',
    notes: ''
  });

  // Filter appointments for current user
  const userAppointments = appointments.filter(apt => 
    apt.resident_email === user?.email || apt.residentEmail === user?.email
  );

  const services = [
    {
      category: 'Medical Services',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      types: [
        'General Consultation',
        'Health Checkup',
        'Blood Pressure Monitoring',
        'Vaccination',
        'Medical Certificate',
        'Prenatal Checkup',
        'Family Planning Consultation'
      ]
    },
    {
      category: 'Document Services',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      types: [
        'Barangay Clearance',
        'Certificate of Indigency',
        'Certificate of Residency',
        'Business Permit Application',
        'Building Permit Consultation'
      ]
    },
    {
      category: 'Social Services',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      types: [
        'Senior Citizen Registration',
        'PWD Registration',
        'Solo Parent Registration',
        'Scholarship Application',
        'Financial Assistance Consultation'
      ]
    },
    {
      category: 'Legal Services',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      types: [
        'Legal Consultation',
        'Mediation Services',
        'Complaint Filing',
        'Notarization Services',
        'Legal Document Review'
      ]
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const handleBookAppointment = async () => {
    if (newAppointment.service && newAppointment.serviceType && newAppointment.date && newAppointment.time) {
      try {
        await addAppointment({
          residentId: user?.id,
          residentName: user?.name || '',
          residentEmail: user?.email || '',
          residentPhone: user?.phone || '',
          service: newAppointment.service,
          serviceType: newAppointment.serviceType,
          appointmentDate: newAppointment.date,
          appointmentTime: newAppointment.time,
          status: 'scheduled',
          notes: newAppointment.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        setNewAppointment({
          service: '',
          serviceType: '',
          date: '',
          time: '',
          notes: ''
        });
        setShowBookingForm(false);
      } catch (error) {
        console.error('Failed to book appointment:', error);
        alert('Failed to book appointment. Please try again.');
      }
    }
  };

  const stats = [
    {
      title: 'Total Appointments',
      value: userAppointments.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Upcoming',
      value: userAppointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Completed',
      value: userAppointments.filter(apt => apt.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'This Month',
      value: userAppointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date || apt.appointmentDate);
        const now = new Date();
        return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
          <p className="text-gray-600 mt-1">Schedule appointments for various barangay services</p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Book Appointment
        </button>
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

      {/* Available Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className={`${service.bgColor} rounded-xl p-6 border border-gray-200`}>
              <div className="flex items-center mb-4">
                <service.icon className={`h-6 w-6 ${service.color} mr-3`} />
                <h4 className="font-semibold text-gray-900">{service.category}</h4>
              </div>
              <div className="space-y-2">
                {service.types.slice(0, 3).map((type, typeIndex) => (
                  <div key={typeIndex} className="text-sm text-gray-700">
                    • {type}
                  </div>
                ))}
                {service.types.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{service.types.length - 3} more services
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setNewAppointment({ ...newAppointment, service: service.category });
                  setShowBookingForm(true);
                }}
                className="w-full mt-4 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Appointments</h3>
        </div>
        
        {userAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{appointment.service}</div>
                        <div className="text-sm text-gray-600">{appointment.service_type || appointment.serviceType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(appointment.appointment_date || appointment.appointmentDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {appointment.appointment_time || appointment.appointmentTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-2 capitalize">{appointment.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {appointment.assigned_staff || appointment.assignedStaff || 'To be assigned'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {appointment.status === 'scheduled' && (
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Cancel Appointment"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments</h3>
            <p className="text-gray-600 mb-6">
              You haven't booked any appointments yet. Schedule your first appointment with our services.
            </p>
            <button
              onClick={() => setShowBookingForm(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Book Appointment
            </button>
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Book New Appointment</h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service Category *
                </label>
                <select
                  value={newAppointment.service}
                  onChange={(e) => {
                    setNewAppointment({ ...newAppointment, service: e.target.value, serviceType: '' });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select service category</option>
                  {services.map((service) => (
                    <option key={service.category} value={service.category}>{service.category}</option>
                  ))}
                </select>
              </div>

              {newAppointment.service && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Specific Service *
                  </label>
                  <select
                    value={newAppointment.serviceType}
                    onChange={(e) => setNewAppointment({ ...newAppointment, serviceType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select specific service</option>
                    {services.find(s => s.category === newAppointment.service)?.types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Time *
                  </label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any specific requirements or additional information..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Important Notes</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Appointments are subject to staff availability</li>
                      <li>• Please arrive 15 minutes before your scheduled time</li>
                      <li>• Bring valid ID and any required documents</li>
                      <li>• Cancellations should be made at least 24 hours in advance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookAppointment}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Appointment Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Service</label>
                      <p className="text-sm text-gray-900">{selectedAppointment.service}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{selectedAppointment.serviceType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusIcon(selectedAppointment.status)}
                        <span className="ml-2 capitalize">{selectedAppointment.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Schedule & Location</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <p className="text-sm text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <p className="text-sm text-gray-900">{selectedAppointment.time}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">{selectedAppointment.location || 'Barangay Hall'}</p>
                    </div>
                    {selectedAppointment.assignedStaff && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Assigned Staff</label>
                        <p className="text-sm text-gray-900">{selectedAppointment.assignedStaff}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
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