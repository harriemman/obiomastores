const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  if (typeof window !== 'undefined') localStorage.setItem('auth_token', token);
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export async function loginWithTelegram(initData: string) {
  const data = await request<{ token: string; user: { id: number; firstName: string } }>(
    '/auth/telegram',
    { method: 'POST', body: JSON.stringify({ initData }) }
  );
  setAuthToken(data.token);
  return data;
}

// Products
export interface Product {
  id: string;
  itemCode: string;
  title: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  brand?: string;
  specifications: Record<string, string>;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  avgRating: number;
  reviewCount: number;
  salesCount: number;
  category?: { id: string; name: string; slug: string };
}

export async function getProducts(params?: {
  category?: string;
  search?: string;
  sort?: 'priceAsc' | 'priceDesc' | 'newest' | 'bestSelling';
  minPrice?: number;
  maxPrice?: number;
}) {
  const qs = new URLSearchParams(
    Object.entries(params || {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return request<{ items: Product[]; total: number }>(`/products${qs ? `?${qs}` : ''}`);
}

export async function getProduct(id: string) {
  return request<Product>(`/products/${id}`);
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return request<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

// Orders
export interface CreateOrderPayload {
  items: Array<{ productId: string; quantity: number }>;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  paymentMethod: 'paystack' | 'bank-transfer' | 'cod';
}

export async function createOrder(payload: CreateOrderPayload) {
  return request<{ id: string; status: string; total: number }>(
    '/orders',
    { method: 'POST', body: JSON.stringify(payload) }
  );
}

// Payments
export async function initializePayment(orderId: string, email: string) {
  return request<{ paymentUrl: string; reference: string }>('/payments/initialize', {
    method: 'POST',
    body: JSON.stringify({ orderId, email }),
  });
}
