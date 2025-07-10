import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  RotateCcw, 
  Check, 
  X,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, returnsAPI } from '../services/api';
import { Order, Return } from '../types';

const PartnerPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'returns'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'returns') fetchReturns();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersAPI.getAll();
      // Filter orders for this partner (in a real app, this would be done on the backend)
      setOrders(data);
    } catch (err: any) {
      setError('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReturns = async () => {
    try {
      setIsLoading(true);
      const data = await returnsAPI.getPending();
      setReturns(data);
    } catch (err: any) {
      setError('Failed to fetch returns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderAction = async (orderId: string, action: 'ship' | 'deliver') => {
    try {
      if (action === 'ship') {
        await ordersAPI.ship(orderId);
      } else if (action === 'deliver') {
        await ordersAPI.deliver(orderId);
      }
      fetchOrders();
    } catch (err: any) {
      setError(`Failed to ${action} order`);
    }
  };

  const handleReturnAction = async (returnId: string, action: 'approve' | 'reject', refundAmount?: number) => {
    try {
      if (action === 'approve' && refundAmount) {
        await returnsAPI.approve(returnId, refundAmount);
      } else if (action === 'reject') {
        await returnsAPI.reject(returnId, 'Rejected by partner');
      }
      fetchReturns();
    } catch (err: any) {
      setError(`Failed to ${action} return`);
    }
  };

  const getOrderStats = () => {
    const placed = orders.filter(o => o.status === 'placed').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return { placed, shipped, delivered, totalRevenue };
  };

  const stats = getOrderStats();

  const tabs = [
    { id: 'orders', label: 'Order Fulfillment', icon: Package },
    { id: 'returns', label: 'Return Processing', icon: RotateCcw }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Portal</h1>
        <p className="text-gray-600">Manage order fulfillment and process returns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.placed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shipped}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Fulfillment</h2>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Order #{order._id.slice(-8)}</h3>
                          <p className="text-sm text-gray-600">Total: ${order.totalAmount}</p>
                          <p className="text-sm text-gray-600">Items: {order.items.length}</p>
                          <p className="text-sm text-gray-600">Address: {order.shippingAddress}</p>
                          <p className="text-sm text-gray-600">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                          {order.status === 'placed' && (
                            <button
                              onClick={() => handleOrderAction(order._id, 'ship')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                            >
                              <Truck className="h-4 w-4" />
                              <span>Ship</span>
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleOrderAction(order._id, 'deliver')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Deliver</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'returns' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Return Processing</h2>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {returns.map((returnItem) => (
                    <div key={returnItem._id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Return #{returnItem._id.slice(-8)}</h3>
                          <p className="text-sm text-gray-600">Order: {returnItem.orderId.slice(-8)}</p>
                          <p className="text-sm text-gray-600">Reason: {returnItem.reason}</p>
                          <p className="text-sm text-gray-600">Items: {returnItem.items.length}</p>
                          <p className="text-sm text-gray-600">Created: {new Date(returnItem.createdAt).toLocaleDateString()}</p>
                        </div>
                        {returnItem.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReturnAction(returnItem._id, 'approve', 50)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                            >
                              <Check className="h-4 w-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReturnAction(returnItem._id, 'reject')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                            >
                              <X className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="bg-white rounded p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Return Items:</h4>
                        <div className="space-y-2">
                          {returnItem.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>Item ID: {item.itemId.slice(-8)}</span>
                              <span>Qty: {item.quantity}</span>
                              <span>Condition: {item.condition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;