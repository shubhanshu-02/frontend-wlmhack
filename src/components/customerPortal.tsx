import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  Package, 
  RotateCcw, 
  Eye,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { itemsAPI, ordersAPI, returnsAPI } from '../services/api';
import { Item, Order, Return } from '../types';

interface CartItem extends Item {
  cartQuantity: number;
}

const CustomerPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'orders' | 'returns'>('browse');
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    if (activeTab === 'browse') fetchItems();
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'returns') fetchReturns();
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await itemsAPI.getAll();
      setItems(data);
    } catch (err: any) {
      setError('Failed to fetch items');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersAPI.getAll();
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
      const data = await returnsAPI.getAll();
      setReturns(data);
    } catch (err: any) {
      setError('Failed to fetch returns');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: Item) => {
    const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      if (existingItem.cartQuantity < item.quantity) {
        setCartItems(prev => 
          prev.map(cartItem => 
            cartItem._id === item._id 
              ? { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 }
              : cartItem
          )
        );
      }
    } else {
      setCartItems(prev => [...prev, { ...item, cartQuantity: 1 }]);
    }
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item._id !== itemId));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item._id === itemId ? { ...item, cartQuantity: quantity } : item
        )
      );
    }
  };

  const handleCheckout = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        itemId: item._id,
        quantity: item.cartQuantity,
        price: item.price,
        partnerId: item.partnerId
      }));

      await ordersAPI.create({
        items: orderItems,
        shippingAddress: 'Local Pickup'
      });

      setCartItems([]);
      setShowCart(false);
      alert('Order placed successfully!');
      fetchItems();
    } catch (err: any) {
      setError('Failed to place order');
    }
  };

  const handleReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const returnItems = selectedOrder.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        condition: 'used' as const
      }));

      await returnsAPI.create({
        orderId: selectedOrder._id,
        items: returnItems,
        reason: returnReason
      });

      setShowReturnModal(false);
      setReturnReason('');
      setSelectedOrder(null);
      alert('Return request submitted successfully!');
      fetchReturns();
    } catch (err: any) {
      setError('Failed to submit return request');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  const tabs = [
    { id: 'browse', label: 'Browse Items', icon: Package },
    { id: 'orders', label: 'Order History', icon: Clock },
    { id: 'returns', label: 'Returns', icon: RotateCcw }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
        <p className="text-gray-600">Browse items, manage orders, and request returns</p>
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
          {activeTab === 'browse' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Items</h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={() => setShowCart(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart ({cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)})</span>
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.condition === 'new' ? 'bg-green-100 text-green-800' :
                          item.condition === 'used' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.condition}
                        </span>
                        <span className="text-sm text-gray-600">{item.category}</span>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.quantity === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {item.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
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
                          <p className="text-sm text-gray-600">Status: {order.status}</p>
                          <p className="text-sm text-gray-600">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReturnModal(true);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span>Return</span>
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Items: {order.items.length}</p>
                        <p>Address: {order.shippingAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'returns' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Return Requests</h2>
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
                          <p className="text-sm text-gray-600">Status: {returnItem.status}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          returnItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                          returnItem.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {returnItem.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Items: {returnItem.items.length}</p>
                        <p>Created: {new Date(returnItem.createdAt).toLocaleDateString()}</p>
                        {returnItem.refundAmount && (
                          <p>Refund Amount: ${returnItem.refundAmount}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.condition}</p>
                        <span className="font-bold text-gray-900">${item.price}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item._id, Math.max(0, item.cartQuantity - 1))}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.cartQuantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item._id, Math.min(item.quantity, item.cartQuantity + 1))}
                          disabled={item.cartQuantity >= item.quantity}
                          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateCartQuantity(item._id, 0)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Request Return</h2>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleReturnRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order #{selectedOrder._id.slice(-8)}
                </label>
                <p className="text-sm text-gray-600">Total: ${selectedOrder.totalAmount}</p>
                <p className="text-sm text-gray-600">Items: {selectedOrder.items.length}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Reason
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please explain why you want to return this order..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Submit Return Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;