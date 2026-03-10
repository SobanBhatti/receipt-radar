/**
 * Analytics utility functions
 * Calculate spending metrics from receipt data
 */

import { Receipt, ReceiptItem } from '../types';
import { MonthlySpending, StoreSpending, TopProduct, SpendingSummary } from '../types/analytics';

/**
 * Calculate monthly spending from receipts
 */
export function calculateMonthlySpending(receipts: Receipt[]): MonthlySpending[] {
  const monthlyMap = new Map<string, number>();

  receipts.forEach((receipt) => {
    const month = receipt.purchaseDate.substring(0, 7); // YYYY-MM
    const current = monthlyMap.get(month) || 0;
    monthlyMap.set(month, current + receipt.totalAmount);
  });

  return Array.from(monthlyMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Calculate spending by store chain
 */
export function calculateStoreSpending(receipts: Receipt[]): StoreSpending[] {
  const storeMap = new Map<string, number>();

  receipts.forEach((receipt) => {
    const chain = receipt.storeChain || 'Unknown';
    const current = storeMap.get(chain) || 0;
    storeMap.set(chain, current + receipt.totalAmount);
  });

  return Array.from(storeMap.entries())
    .map(([storeChain, total]) => ({ storeChain, total }))
    .sort((a, b) => b.total - a.total); // Sort by total descending
}

/**
 * Calculate top products by purchase count and spending
 */
export function calculateTopProducts(
  receipts: Receipt[],
  receiptItems: ReceiptItem[],
  limit: number = 10
): TopProduct[] {
  const productMap = new Map<string, { count: number; total: number }>();

  receipts.forEach((receipt) => {
    const items = receiptItems.filter((item) => item.receiptId === receipt.id);
    items.forEach((item) => {
      const name = item.productNameRaw;
      const current = productMap.get(name) || { count: 0, total: 0 };
      productMap.set(name, {
        count: current.count + item.quantity,
        total: current.total + item.price,
      });
    });
  });

  return Array.from(productMap.entries())
    .map(([productName, data]) => ({
      productName,
      purchaseCount: data.count,
      totalSpent: data.total,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

/**
 * Calculate spending summary
 */
export function calculateSpendingSummary(receipts: Receipt[]): SpendingSummary {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // This month
  const thisMonthReceipts = receipts.filter((r) => {
    const date = new Date(r.purchaseDate);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });
  const thisMonthTotal = thisMonthReceipts.reduce((sum, r) => sum + r.totalAmount, 0);

  // Last month
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const lastMonthReceipts = receipts.filter((r) => {
    const date = new Date(r.purchaseDate);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });
  const lastMonthTotal = lastMonthReceipts.reduce((sum, r) => sum + r.totalAmount, 0);

  // This year
  const thisYearReceipts = receipts.filter((r) => {
    const date = new Date(r.purchaseDate);
    return date.getFullYear() === thisYear;
  });
  const thisYearTotal = thisYearReceipts.reduce((sum, r) => sum + r.totalAmount, 0);

  // Average per month (based on months with data)
  const monthlySpending = calculateMonthlySpending(receipts);
  const averagePerMonth =
    monthlySpending.length > 0
      ? monthlySpending.reduce((sum, m) => sum + m.total, 0) / monthlySpending.length
      : 0;

  return {
    thisMonth: thisMonthTotal,
    lastMonth: lastMonthTotal,
    thisYear: thisYearTotal,
    averagePerMonth,
  };
}

/**
 * Format month string for display (e.g., "2024-01" -> "Jan 2024")
 */
export function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `kr ${amount.toFixed(2)}`;
}
