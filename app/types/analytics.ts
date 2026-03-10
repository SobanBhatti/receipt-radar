/**
 * Analytics-related type definitions
 */

export interface MonthlySpending {
  month: string; // Format: "YYYY-MM"
  total: number;
}

export interface StoreSpending {
  storeChain: string;
  total: number;
}

export interface TopProduct {
  productName: string;
  purchaseCount: number;
  totalSpent: number;
}

export interface SpendingSummary {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  averagePerMonth: number;
}
