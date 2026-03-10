import { ShoppingListItem } from '../types/shopping';
import { PriceComparisonResult } from '../types/services';
import { priceOptimizerApi } from './apiService';
import type {
  PriceComparisonRequestDto,
  PriceComparisonResultDto,
  PriceComparisonOptionDto,
  PriceComparisonItemBreakdownDto,
} from '../generated/api/index';

/**
 * Price Optimizer Service
 * 
 * Finds the cheapest store(s) for a shopping list using the backend API
 */
class PriceOptimizerService {
  async findCheapestStore(items: ShoppingListItem[]): Promise<PriceComparisonResult> {
    if (items.length === 0) {
      return {
        option1: { stores: [], total: 0, breakdown: [] },
        option2: { stores: [], total: 0, breakdown: [] },
      };
    }

    try {
      const requestDto: PriceComparisonRequestDto = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await priceOptimizerApi.apiPriceOptimizerComparePost(requestDto);
      const resultDto = response.data;

      // Map DTO to our types
      const mapOption = (option: PriceComparisonOptionDto) => ({
        stores: option.stores || [],
        total: option.total || 0,
        breakdown: (option.itemBreakdowns || []).map((item: PriceComparisonItemBreakdownDto) => ({
          productId: item.productId || '',
          store: item.storeChain || '',
          price: item.totalPrice || 0,
        })),
      });

      return {
        option1: mapOption(resultDto.option1 || { stores: [], total: 0, itemBreakdowns: [] }),
        option2: mapOption(resultDto.option2 || { stores: [], total: 0, itemBreakdowns: [] }),
      };
    } catch (error) {
      console.error('Error finding cheapest store:', error);
      // Return empty result on error
      return {
        option1: { stores: [], total: 0, breakdown: [] },
        option2: { stores: [], total: 0, breakdown: [] },
      };
    }
  }
}

// Export singleton instance
export const priceOptimizer = new PriceOptimizerService();

// Export function for convenience
export async function findCheapestStore(
  items: ShoppingListItem[]
): Promise<PriceComparisonResult> {
  return priceOptimizer.findCheapestStore(items);
}
