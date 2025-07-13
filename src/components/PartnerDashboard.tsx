import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  X,
  Truck,
  CheckCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { itemsAPI, ordersAPI, returnsAPI } from "../services/api";
import { Item, Order, Return } from "../types";

const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "items" | "orders" | "returns"
  >("overview");
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"item" | "return">("item");

  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: 0,
    qty: 1,
  });

  const [returnAction, setReturnAction] = useState({
    returnId: "",
    action: "approve" as "approve" | "reject",
    refundAmount: 0,
    reason: "",
  });

  // Dashboard stats
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    pendingReturns: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (activeTab === "overview") {
      fetchOverview();
    } else if (activeTab === "items") {
      fetchItems();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "returns") {
      fetchReturns();
    }
  }, [activeTab]);

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      const [itemsData, ordersData, returnsData] = await Promise.all([
        itemsAPI.getAll(),
        ordersAPI.getAll(),
        returnsAPI.getPending(),
      ]);

      setItems(itemsData);
      setOrders(ordersData);
      setReturns(returnsData);

      // Calculate stats
      const totalRevenue = ordersData
        .filter((order) => order.status === "delivered")
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalItems: itemsData.length,
        totalOrders: ordersData.length,
        pendingReturns: returnsData.length,
        totalRevenue,
      });
    } catch (err: unknown) {
      setError("Failed to fetch overview data");
      console.error("Error fetching overview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await itemsAPI.getAll();
      setItems(data);
    } catch (err: unknown) {
      setError("Failed to fetch items");
      console.error("Error fetching items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (err: unknown) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReturns = async () => {
    try {
      setIsLoading(true);
      const data = await returnsAPI.getPending();
      setReturns(data);
    } catch (err: unknown) {
      setError("Failed to fetch returns");
      console.error("Error fetching returns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await itemsAPI.create(itemForm);
      setShowModal(false);
      setItemForm({
        name: "",
        description: "",
        price: 0,
        qty: 1,
      });
      fetchItems();
    } catch (err: unknown) {
      setError("Failed to create item");
      console.error("Error creating item:", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await itemsAPI.delete(id);
        fetchItems();
      } catch (err: unknown) {
        setError("Failed to delete item");
        console.error("Error deleting item:", err);
      }
    }
  };

  const handleOrderAction = async (
    orderId: string,
    action: "ship" | "deliver" | "returned"
  ) => {
    try {
      if (action === "ship") await ordersAPI.ship(orderId);
      else if (action === "deliver") await ordersAPI.deliver(orderId);
      else if (action === "returned") await ordersAPI.markReturned(orderId);
      fetchOrders();
    } catch (err: unknown) {
      setError(`Failed to ${action} order`);
      console.error(`Error ${action}ing order:`, err);
    }
  };

  const handleReturnAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (returnAction.action === "approve") {
        await returnsAPI.approve(
          returnAction.returnId,
          returnAction.refundAmount
        );
      } else if (returnAction.action === "reject") {
        await returnsAPI.reject(returnAction.returnId, returnAction.reason);
      }
      setShowModal(false);
      setReturnAction({
        returnId: "",
        action: "approve",
        refundAmount: 0,
        reason: "",
      });
      fetchReturns();
    } catch (err: unknown) {
      setError(`Failed to ${returnAction.action} return`);
      console.error(`Error ${returnAction.action}ing return:`, err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReturnStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "items", label: "Items", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "returns", label: "Returns", icon: RotateCcw },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Partner Dashboard
        </h1>
        <p className="text-gray-600">Manage your items, orders, and returns</p>
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
                onClick={() =>
                  setActiveTab(
                    tab.id as "overview" | "items" | "orders" | "returns"
                  )
                }
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalItems}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600">Active inventory</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalOrders}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-green-600">All time orders</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <RotateCcw className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending Returns</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.pendingReturns}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-yellow-600">Awaiting review</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600">
                    From delivered orders
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Recent Orders
                  </h2>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Order #{order._id.slice(-6)}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>${order.totalAmount}</span>
                              <span>•</span>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Recent Items
                  </h2>
                  <div className="space-y-4">
                    {items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-green-100 rounded-full">
                            <Package className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>${item.price}</span>
                              <span>•</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Item Management
                </h2>
                <button
                  onClick={() => {
                    setModalType("item");
                    setShowModal(true);
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
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${item.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteItem(item.id)}
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

          {activeTab === "orders" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Management
                </h2>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.customerId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {order.status === "placed" && (
                              <button
                                onClick={() =>
                                  handleOrderAction(order._id, "ship")
                                }
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark as Shipped"
                              >
                                <Truck className="h-4 w-4" />
                              </button>
                            )}
                            {order.status === "shipped" && (
                              <button
                                onClick={() =>
                                  handleOrderAction(order._id, "deliver")
                                }
                                className="text-green-600 hover:text-green-900"
                                title="Mark as Delivered"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {order.status === "delivered" && (
                              <button
                                onClick={() =>
                                  handleOrderAction(order._id, "returned")
                                }
                                className="text-purple-600 hover:text-purple-900"
                                title="Mark as Returned"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "returns" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Return Management
                </h2>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Return ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {returns.map((returnItem) => (
                        <tr key={returnItem._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{returnItem._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{returnItem.orderId.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {returnItem.customerId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {returnItem.reason}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReturnStatusColor(
                                returnItem.status
                              )}`}
                            >
                              {returnItem.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              returnItem.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {returnItem.status === "pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    setReturnAction({
                                      ...returnAction,
                                      returnId: returnItem._id,
                                      action: "approve",
                                    });
                                    setShowModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve Return"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setReturnAction({
                                      ...returnAction,
                                      returnId: returnItem._id,
                                      action: "reject",
                                    });
                                    setShowModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject Return"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === "item" ? "Add New Item" : ""}
                {returnAction.returnId &&
                  returnAction.action === "approve" &&
                  "Approve Return"}
                {returnAction.returnId &&
                  returnAction.action === "reject" &&
                  "Reject Return"}
              </h3>

              {modalType === "item" && (
                <form onSubmit={handleCreateItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, name: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={itemForm.description}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={itemForm.qty}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          qty: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Create Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {returnAction.returnId && (
                <form onSubmit={handleReturnAction} className="space-y-4">
                  {returnAction.action === "approve" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Refund Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={returnAction.refundAmount}
                        onChange={(e) =>
                          setReturnAction({
                            ...returnAction,
                            refundAmount: parseFloat(e.target.value),
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  )}
                  {returnAction.action === "reject" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Reason for Rejection
                      </label>
                      <textarea
                        value={returnAction.reason}
                        onChange={(e) =>
                          setReturnAction({
                            ...returnAction,
                            reason: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className={`flex-1 px-4 py-2 rounded-lg text-white ${
                        returnAction.action === "approve"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {returnAction.action === "approve" ? "Approve" : "Reject"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
