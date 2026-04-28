export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category_id?: number;
  category?: Category;
  images: string; // JSON string
  sizes: string;  // JSON string
  colors: string; // JSON string
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
}

export interface Stock {
  id: number;
  product_id: number;
  size: string;
  color: string;
  quantity: number;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  whatsapp_sent: boolean;
  created_at: string;
  items: OrderItem[];
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_users: number;
  pending_orders: number;
}
