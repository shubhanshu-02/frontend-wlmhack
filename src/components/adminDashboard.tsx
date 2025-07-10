import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  RotateCcw, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Check,
  X,
  Truck,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, itemsAPI, ordersAPI, returnsAPI } from '../services/api';
import { User, Item, Order, Return } from '../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'items' | 'orders' | 'returns'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'user' | 'item'>('user');
  const [editingItem, setEditingItem] = useState<User | Item | null>(null);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    originalPrice: 0,
    price: 0,
    condition: 'new',
    category: '',
    image: '',
    quantity: 1,
    partnerId: ''
  });

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'items') fetchItems();
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'returns') fetchReturns();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

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
      const data = await returnsAPI.getPending();
      setReturns(data);
    } catch (err: any) {
      setError('Failed to fetch returns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(userForm);
      setShowModal(false);
      setUserForm({ name: '', email: '', password: '', role: 'customer' });
      fetchUsers();
    } catch (err: any) {
      setError('Failed to create user');
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await itemsAPI.create(itemForm);
      setShowModal(false);
      setItemForm({
        name: '',
        description: '',
        originalPrice: 0,
        price: 0,
        condition: 'new',
        category: '',
        image: '',
        quantity: 1,
        partnerId: ''
      });
      fetchItems();
    } catch (err: any) {
      setError('Failed to create item');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        fetchUsers();
      } catch (err: any) {
        setError('Failed to delete user');
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.delete(id);
        fetchItems();
      } catch (err: any) {
        setError('Failed to delete item');
      }
    }
  };

  const handleOrderAction = async (orderId: string, action: 'ship' | 'deliver' | 'returned') => {
    try {
      if (action === 'ship') await ordersAPI.ship(orderId);
      else if (action === 'deliver') await ordersAPI.deliver(orderId);
      else if (action === 'returned') await ordersAPI.markReturned(orderId);
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
        await returnsAPI.reject(returnId, 'Rejected by admin');
      }
      fetchReturns();
    } catch (err: any) {
      setError(`Failed to ${action} return`);
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'returns', label: 'Returns', icon: RotateCcw }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, items, orders, and returns</p>
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
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={() => {
                    setModalType('user');
                    setShowModal(true);
                    setEditingItem(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add User</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'partner' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'items' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Item Management</h2>
                <button
                  onClick={() => {
                    setModalType('item');
                    setShowModal(true);
                    setEditingItem(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-lg p-4">
                      <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.condition === 'new' ? 'bg-green-100 text-green-800' :
                          item.condition === 'used' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.condition}
                        </span>
                        <div className="space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Management</h2>
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
                        </div>
                        <div className="flex space-x-2">
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
                      <div className="text-sm text-gray-600">
                        <p>Items: {order.items.length}</p>
                        <p>Address: {order.shippingAddress}</p>
                        <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'returns' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Return Management</h2>
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
                      <div className="text-sm text-gray-600">
                        <p>Items: {returnItem.items.length}</p>
                        <p>Created: {new Date(returnItem.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'user' ? 'Add User' : 'Add Item'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={modalType === 'user' ? handleCreateUser : handleCreateItem} className="p-6 space-y-4">
              {modalType === 'user' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="customer">Customer</option>
                      <option value="partner">Partner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                      <input
                        type="number"
                        value={itemForm.originalPrice}
                        onChange={(e) => setItemForm({ ...itemForm, originalPrice: parseFloat(e.target.value) })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        value={itemForm.price}
                        onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select
                      value={itemForm.condition}
                      onChange={(e) => setItemForm({ ...itemForm, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={itemForm.image}
                      onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={itemForm.quantity}
                      onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) })}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {modalType === 'user' ? 'Create User' : 'Create Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;