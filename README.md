# Comprehensive Barangay Management System

A modern, full-featured digital platform for efficient barangay administration and community services.

## 🏛️ System Overview

This comprehensive Barangay Management System provides a complete digital solution for local government administration, featuring multiple specialized portals and integrated services for residents, officials, and service providers.

## ✨ Key Features

### 🏠 **Resident Portal**
- Complete resident registration and profile management
- Government ID verification system
- QR code generation for secure identification
- Document request and tracking
- Family tree management
- Personal information management

### 👥 **Administrative Portals**
- **Super Admin Dashboard**: Complete system oversight and configuration
- **Barangay Official Dashboard**: Administrative functions and approvals
- **Medical Portal**: Health center management and patient records
- **Accounting Portal**: Financial management and revenue tracking
- **Disaster Portal**: Emergency management and response coordination

### 🏢 **Business Portal**
- Digital business permit applications
- Document upload and management
- Real-time application tracking
- Online fee payment
- Permit download and renewal

### 🛡️ **Security Portal**
- Incident reporting system
- Blotter entry management
- Evidence upload and tracking
- Security analytics and reporting

### 🌐 **Public Services**
- Government-compliant landing page
- Transparency seal and citizen's charter
- Freedom of Information (FOI) request system
- Real-time application tracking
- Public announcements and news

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Deployment**: Bolt Hosting

## 📊 Database Schema

### Core Tables
- `users` - System users with role-based access
- `residents` - Resident profiles and information
- `family_members` - Family tree relationships
- `documents` - Document requests and processing
- `announcements` - Public announcements and notices
- `projects` - Community projects and achievements
- `transactions` - Financial transactions
- `inventory_items` - Medical inventory management
- `patients` - Medical records
- `medical_records` - Patient visit records
- `system_settings` - System configuration

### Business Portal Tables
- `business_permits` - Business permit applications
- `business_documents` - Required business documents
- `business_payments` - Payment tracking

### Security Portal Tables
- `security_incidents` - Incident reports
- `blotter_entries` - Official blotter records
- `incident_evidence` - Evidence files and documentation

## 🔐 Security Features

- **Role-Based Access Control (RBAC)**: Secure permissions system
- **Row Level Security (RLS)**: Database-level security policies
- **Data Encryption**: Sensitive information protection
- **Audit Trails**: Complete activity logging
- **Session Management**: Secure authentication with timeouts
- **Input Validation**: Comprehensive data sanitization
- **File Upload Security**: Validated file types and sizes

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd barangay-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Run the migration files in `/supabase/migrations/`
   - Execute them in your Supabase SQL editor
   - Ensure Row Level Security is enabled

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 👤 User Roles & Access

### Super Admin
- **Email**: superadmin@barangay.gov
- **Access**: Complete system control, user management, system settings
- **Features**: All modules, user creation, system configuration

### Barangay Official
- **Email**: official@barangay.gov
- **Access**: Administrative functions, resident management, portal oversight
- **Features**: Resident verification, document approval, portal access

### Medical Staff
- **Email**: medical@barangay.gov
- **Access**: Health center management
- **Features**: Patient records, inventory, medical announcements

### Accounting Staff
- **Email**: accounting@barangay.gov
- **Access**: Financial management
- **Features**: Transaction tracking, budget management, financial reports

### Disaster Staff
- **Email**: disaster@barangay.gov
- **Access**: Emergency management
- **Features**: Alert systems, evacuation management, resource tracking

### Security Personnel
- **Email**: security@barangay.gov
- **Access**: Security and peace & order
- **Features**: Incident reports, blotter entries, security analytics

### Business Owner
- **Email**: business@email.com
- **Access**: Business permit services
- **Features**: Permit applications, document upload, payment processing

### Resident
- **Email**: resident@email.com
- **Access**: Personal services and information
- **Features**: Profile management, document requests, QR code access

**Default Password**: `password123` (for all demo accounts)

## 📱 Mobile Responsiveness

The system is fully responsive and optimized for:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🔧 Configuration

### System Settings
Access via Super Admin Dashboard → System Settings:
- Barangay information and contact details
- Operating hours and timezone
- Payment gateway configuration
- Notification preferences
- Security policies
- Appearance customization

### Module Control
Enable/disable system modules:
- Core modules (always enabled)
- Portal modules (configurable)
- Feature modules (optional)
- Integration modules (API-dependent)

## 📈 Analytics & Reporting

### Available Reports
- Resident demographics and statistics
- Document processing metrics
- Financial reports and revenue tracking
- Security incident analysis
- Business permit statistics
- System usage analytics

### Export Formats
- PDF reports
- Excel spreadsheets
- CSV data files
- JSON data exports

## 🔄 Data Backup & Recovery

### Automated Backups
- Daily database backups
- File storage backups
- Configuration backups
- Audit trail preservation

### Manual Backup
- Export all data via Admin Dashboard
- Download system configurations
- Backup user files and documents

## 🐛 Debugging & Troubleshooting

### Error Handling
- Comprehensive error boundaries
- Centralized error logging
- User-friendly error messages
- Development mode debugging

### Common Issues
1. **Login Problems**: Check credentials and user status
2. **QR Code Issues**: Ensure user is verified and QR code is not expired
3. **Upload Failures**: Verify file size and type restrictions
4. **Database Errors**: Check Supabase connection and RLS policies

### Debug Mode
Enable in System Settings → System → Debug Mode for:
- Detailed error logging
- Performance monitoring
- API request tracking
- Component state inspection

## 🔒 Privacy & Compliance

### Data Protection
- GDPR-compliant data handling
- User consent management
- Data retention policies
- Secure data deletion

### Government Compliance
- Transparency seal implementation
- Citizen's charter publication
- FOI request processing
- Public information access

## 🤝 Support & Maintenance

### Regular Maintenance
- Weekly system health checks
- Monthly security updates
- Quarterly feature updates
- Annual system reviews

### Support Channels
- System administrator contact
- Technical support documentation
- User training materials
- Community feedback system

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for Philippine barangay administration
- Compliant with government transparency requirements
- Optimized for Filipino users and workflows

---

**Version**: 2.1.0  
**Last Updated**: March 2024  
**Maintained By**: Barangay Development Team