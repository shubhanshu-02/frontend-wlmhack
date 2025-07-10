import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ItemGrid from './components/ItemGrid';
import FilterSidebar from './components/FilterSidebar';
import EcoRewards from './components/EcoRewards';
import AdminDashboard from './components/adminDashboard';
import CustomerPortal from './components/customerPortal';
import PartnerPortal from './components/partnerPortal';
import AuthModal from './components/AuthModal';
import { Item, FilterOptions } from './types';
import { itemsAPI } from './services/api';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'marketplace' | 'admin' | 'customer' | 'partner' | 'rewards'>('marketplace');
  const [items, setItems] = useState<Item[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    condition: 'all',
    category: 'all',
    priceRange: [0, 1000],
    location: 'all'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  // Set default view based on user role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        setCurrentView('admin');
      } else if (user.role === 'customer') {
        setCurrentView('customer');
      } else if (user.role === 'partner') {
        setCurrentView('partner');
      }
    } else {
      setCurrentView('marketplace');
    }
  }, [isAuthenticated, user]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const fetchedItems = await itemsAPI.getAll();
      setItems(fetchedItems);
    } catch (err: any) {
      setError('Failed to load items');
      console.error('Error fetching items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filters.condition !== 'all' && item.condition !== filters.condition) return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) return false;
    return true;
  });

  const handleReserveItem = (item: Item) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    // This would be handled in the customer portal
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && currentView === 'marketplace') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchItems}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      
      {currentView === 'marketplace' && (
        <>
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>
              <div className="lg:w-3/4">
                <ItemGrid items={filteredItems} onReserveItem={handleReserveItem} />
              </div>
            </div>
          </div>
        </>
      )}
      
      {currentView === 'admin' && user?.role === 'admin' && <AdminDashboard />}
      {currentView === 'customer' && user?.role === 'customer' && <CustomerPortal />}
      {currentView === 'partner' && user?.role === 'partner' && <PartnerPortal />}
      {currentView === 'rewards' && <EcoRewards />}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;