import React from 'react';
import { Clock, MapPin, Leaf, Star, ShoppingCart } from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext';

interface ItemCardProps {
  item: Item;
  onReserve: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onReserve }) => {
  const { isAuthenticated } = useAuth();

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'damaged': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'new': return 'New';
      case 'used': return 'Used';
      case 'damaged': return 'Damaged';
      default: return condition;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const calculateSavings = () => {
    return item.originalPrice - item.price;
  };

  const calculateEcoScore = () => {
    // Mock eco score calculation based on condition and savings
    const baseScore = item.condition === 'new' ? 95 : item.condition === 'used' ? 85 : 70;
    return baseScore;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
            {getConditionLabel(item.condition)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Leaf className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-600">{calculateEcoScore()}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">${item.price}</span>
            {item.originalPrice > item.price && (
              <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
            )}
          </div>
          <div className="text-sm text-green-600 font-medium">
            Save ${calculateSavings()}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Local Pickup</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="text-gray-600">Quantity: {item.quantity}</div>
          <div className="text-green-600">
            Eco-friendly choice
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onReserve(item)}
            disabled={!isAuthenticated || item.quantity === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{item.quantity === 0 ? 'Out of Stock' : isAuthenticated ? 'Add to Cart' : 'Sign In to Buy'}</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Star className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;