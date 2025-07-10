import React from 'react';
import { TrendingUp, Package, Users, Star, Award, MapPin } from 'lucide-react';
import { mockPartners } from '../data/mockData';

const PartnerDashboard: React.FC = () => {
  const dashboardStats = {
    totalPartners: 147,
    itemsProcessed: 2847,
    avgResponseTime: '2.3 hours',
    customerSatisfaction: 4.7
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Network</h1>
        <p className="text-gray-600">Local businesses helping reduce waste and serve communities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Partners</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalPartners}</p>
            </div>
          </div>
          <p className="text-sm text-blue-600">+12 this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Items Processed</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.itemsProcessed}</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+340 this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.avgResponseTime}</p>
            </div>
          </div>
          <p className="text-sm text-yellow-600">-0.5hrs vs last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.customerSatisfaction}/5</p>
            </div>
          </div>
          <p className="text-sm text-purple-600">+0.2 vs last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Partners</h2>
          <div className="space-y-4">
            {mockPartners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{partner.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{partner.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{partner.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{partner.totalSales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Become a Partner</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Business Benefits</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Access to high-quality returned inventory</li>
                <li>• Competitive pricing on bulk purchases</li>
                <li>• Support local sustainability initiatives</li>
                <li>• Increase revenue with minimal overhead</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Requirements</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Valid business license</li>
                <li>• Local pickup/delivery capability</li>
                <li>• Commitment to quality standards</li>
                <li>• Customer service excellence</li>
              </ul>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Apply to Become a Partner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;