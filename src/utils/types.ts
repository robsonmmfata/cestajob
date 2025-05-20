
export interface Item {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  unitPrice: number;
  lastPurchaseDate: string;
  category?: string; // Nova propriedade para categorização
}

export interface BasketModel {
  id: string;
  name: string;
  items: BasketItem[];
}

export interface BasketItem {
  itemId: string;
  quantity: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  description: string;
}

export interface BasketInventory {
  id: string;
  basketModelId: string;
  quantity: number;
}

export interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ReportConfig {
  startDate: string;
  endDate: string;
  type: 'inventory' | 'transactions' | 'financial';
  format: 'pdf' | 'excel';
}

export type ItemCategory = 'Alimentos' | 'Higiene' | 'Limpeza' | 'Outros';

export interface FilterOptions {
  category?: ItemCategory;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
  sortBy?: 'name' | 'price' | 'quantity' | 'category';
  sortDirection?: 'asc' | 'desc';
}
