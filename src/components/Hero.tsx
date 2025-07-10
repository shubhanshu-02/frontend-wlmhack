import React from 'react';
import { Recycle, TrendingDown, MapPin } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Give Returns a Second Life
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              Discover quality returned items from local Walmart stores. Save money, reduce waste, and help the environment—all while supporting your community.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-yellow-400" />
                <span>Up to 60% off retail prices</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span>Local pickup only</span>
              </div>
              <div className="flex items-center space-x-2">
                <Recycle className="h-5 w-5 text-yellow-400" />
                <span>Eco-friendly choice</span>
              </div>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors">
              Start Shopping Local
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Impact This Month</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center">
                  <span>Items redirected locally</span>
                  <span className="text-2xl font-bold text-yellow-400">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CO₂ emissions saved</span>
                  <span className="text-2xl font-bold text-green-400">1.2 tons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Community savings</span>
                  <span className="text-2xl font-bold text-yellow-400">$94,520</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;