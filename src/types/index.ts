export interface Item {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  price: number;
  condition: 'new' | 'used' | 'damaged' | 'like-new' | 'open-box';
  category: string;
  image: string;
  quantity: number;
  partnerId: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'partner' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'placed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
  partnerId: string;
}

export interface Return {
  _id: string;
  orderId: string;
  customerId: string;
  items: ReturnItem[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  refundAmount?: number;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnItem {
  itemId: string;
  quantity: number;
  condition: 'new' | 'used' | 'damaged' | 'like-new' | 'open-box';
}

export interface FilterOptions {
  condition: string;
  category: string;
  priceRange: [number, number];
  location: string;
}

export interface Partner {
  _id: string;
  name: string;
  email: string;
  role: 'partner';
  location: string,
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}