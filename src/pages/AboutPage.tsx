import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Target, Eye, Heart, ArrowLeft, Award, Calendar, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">About Barangay San Miguel</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">About Our Barangay</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Learn about our history, mission, and commitment to serving the community of San Miguel
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our History</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Barangay San Miguel has a rich history dating back to the early 1900s. Originally 
                  a small farming community, it has grown into a vibrant residential area while 
                  maintaining its close-knit community spirit.
                </p>
                <p>
                  Named after Saint Michael the Archangel, our barangay has always been guided by 
                  principles of protection, justice, and service to others. Over the decades, we 
                  have evolved from a rural settlement to a modern community with digital services 
                  and innovative governance.
                </p>
                <p>
                  Today, Barangay San Miguel stands as a model of progressive local governance, 
                  combining traditional Filipino values with modern technology to better serve 
                  our residents.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <div className="text-center">
                <Building2 className="h-24 w-24 text-blue-600 mx-auto mb-6" />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Established</h4>
                <p className="text-4xl font-bold text-blue-600 mb-2">1923</p>
                <p className="text-gray-600">Over 100 years of community service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision</h3>
            <p className="text-xl text-gray-600">Our guiding principles and aspirations for the community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Our Mission</h4>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                To provide excellent public service through transparent, accountable, and innovative 
                governance that promotes the welfare, safety, and prosperity of all residents while 
                preserving our community values and fostering sustainable development.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Our Vision</h4>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                To be a model barangay that exemplifies progressive governance, where every resident 
                enjoys a high quality of life in a safe, clean, and digitally-enabled community that 
                celebrates Filipino values and embraces innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h3>
            <p className="text-xl text-gray-600">The principles that guide our every action</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Service</h4>
              <p className="text-gray-600">
                Dedicated to serving our community with compassion, integrity, and excellence in all our endeavors.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Unity</h4>
              <p className="text-gray-600">
                Fostering a strong sense of community where every resident feels valued, heard, and included.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Excellence</h4>
              <p className="text-gray-600">
                Striving for the highest standards in governance, service delivery, and community development.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-yellow-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Innovation</h4>
              <p className="text-gray-600">
                Embracing technology and creative solutions to improve services and enhance quality of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Key Achievements</h3>
            <p className="text-xl text-gray-600">Milestones in our journey of community development</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">2024 - Digital Transformation</h4>
                  <p className="text-gray-600">Launch of comprehensive digital barangay management system</p>
                </div>
              </div>
              <p className="text-gray-600 ml-16">
                Successfully implemented a fully digital platform for resident services, including online 
                document processing, QR-based identification, and integrated health, accounting, and 
                disaster management portals.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">2023 - Excellence in Governance Award</h4>
                  <p className="text-gray-600">Recognized by the Department of Interior and Local Government</p>
                </div>
              </div>
              <p className="text-gray-600 ml-16">
                Received the "Most Outstanding Barangay" award for exemplary governance, transparency, 
                and innovative service delivery programs that significantly improved resident satisfaction.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">2022 - Community Health Program</h4>
                  <p className="text-gray-600">100% vaccination coverage achieved</p>
                </div>
              </div>
              <p className="text-gray-600 ml-16">
                Successfully implemented comprehensive health programs resulting in 100% COVID-19 vaccination 
                coverage and establishment of regular health monitoring systems for all residents.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">2021 - Infrastructure Development</h4>
                  <p className="text-gray-600">Major road and facility improvements completed</p>
                </div>
              </div>
              <p className="text-gray-600 ml-16">
                Completed major infrastructure projects including road improvements, new community center, 
                upgraded health station, and installation of modern street lighting and CCTV systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demographics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Community Profile</h3>
            <p className="text-xl text-gray-600">Understanding our diverse and vibrant community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,245</div>
              <div className="text-gray-700 font-medium">Total Population</div>
              <div className="text-sm text-gray-600 mt-1">As of 2024</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">324</div>
              <div className="text-gray-700 font-medium">Households</div>
              <div className="text-sm text-gray-600 mt-1">Registered families</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2.5</div>
              <div className="text-gray-700 font-medium">Sq. Kilometers</div>
              <div className="text-sm text-gray-600 mt-1">Total land area</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">8</div>
              <div className="text-gray-700 font-medium">Puroks/Sitios</div>
              <div className="text-sm text-gray-600 mt-1">Sub-communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">Barangay San Miguel</span>
          </div>
          <p className="text-gray-400">&copy; 2024 Barangay San Miguel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}