import axios from "axios";
import Cookies from "js-cookie";
import { Item, User, Order, Return } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post<{ message: string }>(
      "/api/auth/register",
      userData
    );
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<{ token: string }>(
      "/api/auth/login",
      credentials
    );
    return response.data;
  },

  logout: () => {
    Cookies.remove("auth_token");
  },
};

// Items API
export const itemsAPI = {
  getAll: async (filters?: Record<string, unknown>) => {
    const response = await api.get<Item[]>("/api/items", { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Item>(`/api/items/${id}`);
    return response.data;
  },

  create: async (itemData: {
    name: string;
    description: string;
    price: number;
    qty: number;
  }) => {
    const response = await api.post<Item>("/api/items", itemData);
    return response.data;
  },

  update: async (id: string, itemData: Partial<Item>) => {
    const response = await api.put<Item>(`/api/items/${id}`, itemData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/items/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: { items: { itemId: string; qty: number }[] }) => {
    const response = await api.post<Order>("/api/orders", orderData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<Order[]>("/api/orders");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.put<Order>(`/api/orders/${id}/cancel`);
    return response.data;
  },

  update: async (id: string, orderData: Partial<Order>) => {
    const response = await api.put<Order>(`/api/orders/${id}`, orderData);
    return response.data;
  },

  ship: async (id: string) => {
    const response = await api.put<Order>(`/api/orders/${id}/ship`);
    return response.data;
  },

  deliver: async (id: string) => {
    const response = await api.put<Order>(`/api/orders/${id}/deliver`);
    return response.data;
  },

  markReturned: async (id: string) => {
    const response = await api.put<Order>(`/api/orders/${id}/returned`);
    return response.data;
  },
};

// Returns API
export const returnsAPI = {
  create: async (returnData: {
    orderId: string;
    itemId: string;
    reason: string;
    condition: "new" | "used" | "damaged";
  }) => {
    const response = await api.post<Return>("/api/returns", returnData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<Return[]>("/api/returns");
    return response.data;
  },

  getPending: async () => {
    const response = await api.get<Return[]>("/api/returns/pending");
    return response.data;
  },

  approve: async (id: string, refundAmount?: number) => {
    const response = await api.put<Return>(`/api/returns/${id}/approve`, {
      refundAmount,
    });
    return response.data;
  },

  reject: async (id: string, reason?: string) => {
    const response = await api.put<Return>(`/api/returns/${id}/reject`, {
      reason,
    });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post<User>("/api/admin/user", userData);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get<User[]>("/api/admin/user");
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put<User>(`/api/admin/user/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/admin/user/${id}`);
    return response.data;
  },
};
