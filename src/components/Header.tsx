import React from 'react';
import { Search, ShoppingCart, User, Award, Building2, LogOut, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: 'marketplace' | 'admin' | 'customer' | 'partner' | 'rewards';
  setCurrentView: (view: 'marketplace' | 'admin' | 'customer' | 'partner' | 'rewards') => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onAuthClick }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      onAuthClick();
    }
  };

  const getNavigationItems = () => {
    if (!isAuthenticated || !user) {
      return [
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
        { id: 'rewards', label: 'Eco Rewards', icon: Award }
      ];
    }

    switch (user.role) {
      case 'admin':
        return [
          { id: 'admin', label: 'Admin Dashboard', icon: Settings },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
          { id: 'rewards', label: 'Eco Rewards', icon: Award }
        ];
      case 'customer':
        return [
          { id: 'customer', label: 'My Portal', icon: User },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
          { id: 'rewards', label: 'Eco Rewards', icon: Award }
        ];
      case 'partner':
        return [
          { id: 'partner', label: 'Partner Portal', icon: Building2 },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
          { id: 'rewards', label: 'Eco Rewards', icon: Award }
        ];
      default:
        return [
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
          { id: 'rewards', label: 'Eco Rewards', icon: Award }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Walmart</h1>
                <p className="text-xs text-blue-600">Local Resale</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search returned items near you..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    currentView === item.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleAuthAction}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isAuthenticated ? (
                  <>
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
              
              {isAuthenticated && user && (
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;