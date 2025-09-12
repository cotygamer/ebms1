# Barangay Management System - Setup Guide

## 🚀 Quick Start Guide

### Step 1: System Requirements
- **Node.js**: Version 18 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet**: Stable connection for database operations
- **Storage**: At least 500MB free space

### Step 2: Database Setup (Supabase)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new account or sign in
   - Create a new project

2. **Configure Database**
   - Copy your project URL and anon key
   - Go to SQL Editor in Supabase dashboard
   - Run all migration files from `/supabase/migrations/` in order:
     ```sql
     -- Run these files in order:
     1. create_users_table.sql
     2. create_residents_table.sql
     3. create_business_portal_tables.sql
     4. create_security_portal_tables.sql
     ```

3. **Enable Row Level Security**
   - Ensure RLS is enabled for all tables
   - Verify policies are created correctly

### Step 3: Environment Configuration

1. **Create Environment File**
   ```bash
   # Create .env file in project root
   touch .env
   ```

2. **Add Supabase Credentials**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Step 4: Application Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open browser to `http://localhost:5173`
   - Use demo credentials to test different roles

## 👥 User Account Setup

### Default Demo Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | superadmin@barangay.gov | password123 | Full system access |
| Barangay Official | official@barangay.gov | password123 | Administrative functions |
| Medical Staff | medical@barangay.gov | password123 | Health center management |
| Accounting Staff | accounting@barangay.gov | password123 | Financial management |
| Disaster Staff | disaster@barangay.gov | password123 | Emergency management |
| Security Personnel | security@barangay.gov | password123 | Security operations |
| Business Owner | business@email.com | password123 | Business permits |
| Resident | resident@email.com | password123 | Personal services |

### Creating New Users

1. **Via Super Admin Dashboard**
   - Login as Super Admin
   - Go to User Management
   - Click "Add User"
   - Fill in complete user details
   - Assign appropriate role and permissions

2. **Via Registration Page**
   - Public registration for residents
   - Requires verification by officials
   - Three-tier verification system

## 🔧 System Configuration

### Basic Settings (Super Admin Only)

1. **Barangay Information**
   - Navigate to System Settings → General
   - Update barangay name, address, contact info
   - Set operating hours and timezone

2. **Payment Gateway Setup**
   - Go to Integrations → Payment Gateway
   - Configure GCash, Maya, or DragonPay
   - Enable/disable payment methods
   - Set API keys and merchant information

3. **Google Maps Integration**
   - Go to Integrations → Google Maps
   - Add Google Maps API key
   - Enable location services

### Module Configuration

1. **Enable/Disable Modules**
   - Access Module Control Center
   - Toggle modules based on needs
   - Configure module-specific settings

2. **Portal Access Control**
   - Set user permissions for each portal
   - Configure role-based access
   - Manage portal availability

## 📋 Essential Workflows

### Resident Registration Process

1. **Initial Registration**
   - Resident fills registration form
   - Provides basic information
   - Status: "Non-verified"

2. **Document Submission**
   - Upload required documents
   - Government ID verification
   - Address proof submission
   - Status: "Semi-verified"

3. **Official Verification**
   - Barangay official reviews documents
   - Conducts verification process
   - Approves or requests additional info
   - Status: "Verified"

4. **QR Code Generation**
   - System generates unique QR code
   - Resident can access digital ID
   - QR code enables service access

### Document Processing Workflow

1. **Request Submission**
   - Resident submits document request
   - Selects document type and provides details
   - System calculates fees

2. **Payment Processing**
   - Online payment via configured gateways
   - Cash payment option available
   - Payment confirmation

3. **Document Preparation**
   - Official processes request
   - Generates required document
   - Quality review and approval

4. **Release and Delivery**
   - Document ready for pickup/download
   - Notification sent to resident
   - Digital copy available

### Business Permit Workflow

1. **Application Submission**
   - Business owner submits application
   - Provides business details and requirements
   - Uploads required documents

2. **Review Process**
   - Officials review application
   - Verify submitted documents
   - Conduct site inspection if needed

3. **Approval/Rejection**
   - Decision made based on compliance
   - Notification sent to applicant
   - Feedback provided if rejected

4. **Permit Issuance**
   - Approved permits generated
   - Digital and physical copies available
   - Renewal reminders scheduled

## 🔍 Testing Procedures

### Functional Testing

1. **User Authentication**
   - Test login with all user roles
   - Verify role-based access restrictions
   - Test password reset functionality

2. **Data Operations**
   - Create, read, update, delete operations
   - Form validation and error handling
   - File upload and download

3. **QR Code System**
   - Generate QR codes for verified users
   - Test QR code validation
   - Verify user matching accuracy

4. **Portal Integration**
   - Test navigation between portals
   - Verify data consistency
   - Check permission enforcement

### Security Testing

1. **Access Control**
   - Attempt unauthorized access
   - Test role permission boundaries
   - Verify data isolation

2. **Input Validation**
   - Test with malicious inputs
   - Verify sanitization works
   - Check SQL injection protection

3. **Session Management**
   - Test session timeouts
   - Verify secure logout
   - Check concurrent session handling

## 🐛 Common Issues & Solutions

### Database Connection Issues
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify Supabase project status
# Check RLS policies are enabled
```

### QR Code Generation Problems
```typescript
// Ensure user is verified
if (user.verificationStatus !== 'verified') {
  // Complete verification first
}

// Check QR code expiration
if (needsQRCodeRefresh(qrData)) {
  // Generate new QR code
}
```

### File Upload Failures
```typescript
// Check file validation
const validation = validateFileUpload(file, allowedTypes, maxSizeMB);
if (!validation.isValid) {
  // Handle validation error
}
```

### Permission Denied Errors
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Verify user role
SELECT role FROM users WHERE id = auth.uid();
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks

1. **Daily**
   - Monitor system performance
   - Check error logs
   - Verify backup completion

2. **Weekly**
   - Review user activity
   - Update announcements
   - Check security incidents

3. **Monthly**
   - Generate system reports
   - Review and update documentation
   - Perform security audits

4. **Quarterly**
   - System updates and patches
   - Feature enhancements
   - User training sessions

### Emergency Procedures

1. **System Downtime**
   - Check Supabase status
   - Verify hosting service
   - Review error logs
   - Contact technical support

2. **Data Recovery**
   - Access latest backup
   - Restore from Supabase dashboard
   - Verify data integrity
   - Notify users of restoration

3. **Security Incidents**
   - Immediately change affected passwords
   - Review access logs
   - Update security policies
   - Report to authorities if needed

## 📚 Additional Resources

- **User Manual**: Detailed user guides for each portal
- **API Documentation**: Technical API reference
- **Video Tutorials**: Step-by-step video guides
- **FAQ**: Frequently asked questions and answers

## 🔄 Version History

- **v2.1.0** (Current): Complete system with all portals
- **v2.0.0**: Added Business and Security portals
- **v1.5.0**: Enhanced QR code system
- **v1.0.0**: Initial release with core features

---

For technical support, contact the system administrator or refer to the troubleshooting section above.