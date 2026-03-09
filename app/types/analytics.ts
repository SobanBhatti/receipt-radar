/**
 * Analytics-related type definitions
 */

export interface MonthlySpending {
  month: string; // Format: "YYYY-MM"
  total: number;
}

export interface StoreSpending {
  store_chain: string;
  total: number;
}

export interface TopProduct {
  product_name: string;
  purchase_count: number;
  total_spent: number;
}

export interface SpendingSummary {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  averagePerMonth: number;
}
