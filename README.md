# Enhanced Barangay Management System (EBMS)

A comprehensive digital platform for modernizing barangay governance with real-time data synchronization across all modules.

## System Architecture

### Centralized Database Solution
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Real-time Sync**: All modules connected to the same database instance
- **Data Consistency**: Automated validation and conflict resolution
- **Audit Trail**: Complete logging of all data changes

### Module Integration
- **Resident Portal**: Document requests, incident reporting, profile management
- **Admin Portal**: User management, system settings, data monitoring
- **Barangay Official Portal**: KYC verification, document processing, complaint management
- **Medical Portal**: Health records, appointments, inventory management
- **Accounting Portal**: Financial transactions, revenue tracking
- **Disaster Portal**: Emergency management, alerts, evacuation coordination

### Data Synchronization Features
- ✅ Real-time updates across all portals
- ✅ Centralized data storage with Supabase
- ✅ Automatic conflict resolution
- ✅ Data consistency validation
- ✅ Comprehensive audit logging
- ✅ Error handling and retry mechanisms

## Setup Instructions

1. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Add your Supabase credentials to .env
   ```

2. **Database Setup**:
   - Connect to Supabase using the "Connect to Supabase" button
   - Run all migrations in the `supabase/migrations/` folder
   - **Important**: Create demo users in Supabase Dashboard > Authentication > Users:
     - superadmin@barangay.gov / password123
     - official@barangay.gov / password123
     - medical@barangay.gov / password123
     - accounting@barangay.gov / password123
     - disaster@barangay.gov / password123
     - resident@email.com / password123

3. **Start Development**:
   ```bash
   npm install
   npm run dev
   ```

## Testing Data Synchronization

1. **Access the Sync Test Panel**:
   - Login as Super Admin (superadmin@barangay.gov / password123)
   - Navigate to "Sync Tests" in the dashboard
   - Click "Run Sync Tests" to verify synchronization

2. **Verify Cross-Portal Visibility**:
   - Create documents/incidents in Resident Portal
   - Check Admin Portal and Barangay Official Portal
   - Confirm data appears in real-time

3. **Monitor Data Sync**:
   - Use the "Data Sync Monitor" to check system health
   - View real-time activity and data counts
   - Validate data consistency

## Key Features

- **Multi-Portal Architecture**: Separate interfaces for different user roles
- **Real-time Synchronization**: Instant data updates across all modules
- **Comprehensive KYC System**: Three-tier verification process
- **Document Management**: Complete lifecycle from request to release
- **Incident Reporting**: Blotter system with assignment and tracking
- **Payment Integration**: Multiple payment methods with transaction tracking
- **Emergency Management**: Disaster response and alert systems
- **Audit Trail**: Complete logging for compliance and security
