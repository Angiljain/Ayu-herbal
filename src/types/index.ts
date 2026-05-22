export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  featured: boolean;
  visible: boolean;
  benefits: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  sales: {
    total: number;
  };
  products: {
    total: number;
    outOfStock: number;
    featured: number;
  };
  categories: {
    name: string;
    count: number;
  }[];
}
