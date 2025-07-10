import React from 'react';
import { Filter, MapPin, DollarSign, Package, Star } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterSidebarProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'open-box', label: 'Open Box' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Home & Kitchen', label: 'Home & Kitchen' },
    { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Toys & Games', label: 'Toys & Games' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Atlanta, GA', label: 'Atlanta, GA' },
    { value: 'Dallas, TX', label: 'Dallas, TX' },
    { value: 'Phoenix, AZ', label: 'Phoenix, AZ' },
    { value: 'Miami, FL', label: 'Miami, FL' },
    { value: 'Seattle, WA', label: 'Seattle, WA' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Package className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Condition</h3>
        </div>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label key={condition.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="condition"
                value={condition.value}
                checked={filters.condition === condition.value}
                onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{condition.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Star className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Category</h3>
        </div>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Price Range</h3>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1000"
            step="25"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Location</h3>
        </div>
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {locations.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>
      </div>

      <button 
        onClick={() => setFilters({ condition: 'all', category: 'all', priceRange: [0, 1000], location: 'all' })}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;