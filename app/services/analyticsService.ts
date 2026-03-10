/**
 * Analytics Service - Handles analytics operations via API
 */

import { MonthlySpending, StoreSpending, TopProduct, SpendingSummary } from '../types/analytics';
import { analyticsApi } from './apiService';
import type {
  SpendingSummaryDto,
  MonthlySpendingDto,
  StoreSpendingDto,
  TopProductDto,
} from '../generated/api/index';

/**
 * Fetch spending summary
 */
export async function fetchSpendingSummary(userId: string): Promise<SpendingSummary> {
  try {
    const response = await analyticsApi.apiAnalyticsSummaryGet();
    const dto = response.data;
    
    return {
      thisMonth: dto.thisMonth || 0,
      lastMonth: dto.lastMonth || 0,
      thisYear: dto.thisYear || 0,
      averagePerMonth: dto.averagePerMonth || 0,
    };
  } catch (error) {
    console.error('Error fetching spending summary:', error);
    throw error;
  }
}

/**
 * Fetch monthly spending data
 */
export async function fetchMonthlySpending(userId: string, year?: number): Promise<MonthlySpending[]> {
  try {
    const response = await analyticsApi.apiAnalyticsMonthlyGet(year);
    const dtos = response.data;
    
    return dtos.map((dto: MonthlySpendingDto) => ({
      month: dto.month || '',
      total: dto.total || 0,
    }));
  } catch (error) {
    console.error('Error fetching monthly spending:', error);
    throw error;
  }
}

/**
 * Fetch store spending data
 */
export async function fetchStoreSpending(userId: string): Promise<StoreSpending[]> {
  try {
    const response = await analyticsApi.apiAnalyticsStoresGet();
    const dtos = response.data;
    
    return dtos.map((dto: StoreSpendingDto) => ({
      storeChain: dto.storeChain || '',
      total: dto.total || 0,
    }));
  } catch (error) {
    console.error('Error fetching store spending:', error);
    throw error;
  }
}

/**
 * Fetch top products
 */
export async function fetchTopProducts(userId: string, limit: number = 10): Promise<TopProduct[]> {
  try {
    const response = await analyticsApi.apiAnalyticsTopProductsGet(limit);
    const dtos = response.data;
    
    return dtos.map((dto: TopProductDto) => ({
      productName: dto.productName || '',
      purchaseCount: dto.purchaseCount || 0,
      totalSpent: dto.totalSpent || 0,
    }));
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
}
