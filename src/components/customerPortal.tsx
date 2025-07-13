import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, RotateCcw, X } from "lucide-react";

import { itemsAPI, ordersAPI, returnsAPI } from "../services/api";
import { Item, Order, Return } from "../types";

const CustomerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "orders" | "returns"
  >("marketplace");
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"order" | "return">("order");

  const [orderForm, setOrderForm] = useState({
    items: [{ itemId: "", qty: 1 }],
    shippingAddress: "",
  });

  const [returnForm, setReturnForm] = useState({
    orderId: "",
    itemId: "",
    reason: "",
    condition: "new" as "new" | "used" | "damaged",
  });

  // Dashboard stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalReturns: 0,
    totalSpent: 0,
    itemsInCart: 0,
  });

  useEffect(() => {
    if (activeTab === "marketplace") {
      fetchItems();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "returns") {
      fetchReturns();
    }
  }, [activeTab]);

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

      // Calculate stats
      const totalSpent = data
        .filter((order) => order.status === "delivered")
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats((prev) => ({
        ...prev,
        totalOrders: data.length,
        totalSpent,
      }));
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
      const data = await returnsAPI.getAll();
      setReturns(data);

      setStats((prev) => ({
        ...prev,
        totalReturns: data.length,
      }));
    } catch (err: unknown) {
      setError("Failed to fetch returns");
      console.error("Error fetching returns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ordersAPI.create(orderForm);
      setShowModal(false);
      setOrderForm({
        items: [{ itemId: "", qty: 1 }],
        shippingAddress: "",
      });
      fetchOrders();
    } catch (err: unknown) {
      setError("Failed to place order");
      console.error("Error placing order:", err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await ordersAPI.cancel(orderId);
        fetchOrders();
      } catch (err: unknown) {
        setError("Failed to cancel order");
        console.error("Error canceling order:", err);
      }
    }
  };

  const handleRequestReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await returnsAPI.create(returnForm);
      setShowModal(false);
      setReturnForm({
        orderId: "",
        itemId: "",
        reason: "",
        condition: "new",
      });
      fetchReturns();
    } catch (err: unknown) {
      setError("Failed to request return");
      console.error("Error requesting return:", err);
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
    { id: "marketplace", label: "Marketplace", icon: Package },
    { id: "orders", label: "My Orders", icon: ShoppingCart },
    { id: "returns", label: "My Returns", icon: RotateCcw },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Portal
        </h1>
        <p className="text-gray-600">
          Browse items, track orders, and manage returns
        </p>
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
                  setActiveTab(tab.id as "marketplace" | "orders" | "returns")
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
          {activeTab === "marketplace" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Available Items
                </h2>
                <div className="text-sm text-gray-600">
                  {stats.totalOrders} orders • ${stats.totalSpent.toFixed(2)}{" "}
                  spent
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-lg p-6 border"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.price}
                        </span>
                        <span className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.condition === "new"
                              ? "bg-green-100 text-green-800"
                              : item.condition === "used"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.condition}
                        </span>
                        <button
                          onClick={() => {
                            setOrderForm({
                              items: [{ itemId: item.id, qty: 1 }],
                              shippingAddress: "",
                            });
                            setModalType("order");
                            setShowModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Orders
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
                                onClick={() => handleCancelOrder(order._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel Order"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            {order.status === "delivered" && (
                              <button
                                onClick={() => {
                                  setReturnForm({
                                    orderId: order._id,
                                    itemId: order.items[0]?.itemId || "",
                                    reason: "",
                                    condition: "new",
                                  });
                                  setModalType("return");
                                  setShowModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Request Return"
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
                  My Returns
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
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
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
                {modalType === "order" ? "Place Order" : "Request Return"}
              </h3>

              {modalType === "order" && (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Shipping Address
                    </label>
                    <textarea
                      value={orderForm.shippingAddress}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          shippingAddress: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Place Order
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

              {modalType === "return" && (
                <form onSubmit={handleRequestReturn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Return
                    </label>
                    <textarea
                      value={returnForm.reason}
                      onChange={(e) =>
                        setReturnForm({ ...returnForm, reason: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Item Condition
                    </label>
                    <select
                      value={returnForm.condition}
                      onChange={(e) =>
                        setReturnForm({
                          ...returnForm,
                          condition: e.target.value as
                            | "new"
                            | "used"
                            | "damaged",
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Request Return
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

export default CustomerPortal;
