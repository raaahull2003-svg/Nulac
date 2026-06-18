export type ProductCategory = 'milk' | 'ghee' | 'paneer' | 'dahi';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  origin: string;
  nutrition: {
    energy: string;
    fat: string;
    protein: string;
    carbohydrates: string;
    calcium: string;
  };
  benefits: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string; // e.g. "Glass Bottle" or "A2 Premium" or size
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  date: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  deliverySlot: string;
  deliveryFrequency: 'once' | 'daily' | 'alternate';
  date: string;
  status: 'pending' | 'on_the_way' | 'delivered';
}

export interface Subscription {
  id: string;
  product: Product;
  qtyPerDay: number;
  frequency: 'daily' | 'alternate' | 'custom';
  selectedDays?: string[]; // e.g., ['Mon', 'Wed', 'Fri']
  startDate: string;
  durationMonths: number;
  status: 'active' | 'paused' | 'expired';
}

export type ScreenId =
  | 'splash'
  | 'auth'
  | 'home'
  | 'products'
  | 'productDetails'
  | 'cart'
  | 'checkout'
  | 'success'
  | 'subscription'
  | 'blog'
  | 'blogDetail'
  | 'contact'
  | 'profile'
  | 'notifications';

export interface UserSession {
  isLoggedIn: boolean;
  isGuest: boolean;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface FlutterFile {
  path: string;
  name: string;
  language: 'dart' | 'yaml' | 'json';
  content: string;
}

export interface FolderNode {
  name: string;
  path: string;
  children?: FolderNode[];
  fileKey?: string; // link to FlutterFile
}

export interface RazorpayTransaction {
  id: string; // pay_NLC123456
  amount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  methodDetail: string; // e.g. "Google Pay (raaahull2003@okaxis)", "**** 4111", "SBI", "Razorpay Wallet"
  status: 'captured' | 'failed';
  date: string;
  purpose: 'wallet_topup' | 'direct_checkout';
  orderId?: string;
}
