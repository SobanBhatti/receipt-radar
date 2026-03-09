import { ShoppingListItem } from '../types/shopping';
import { PriceComparisonResult, PriceComparisonOption } from '../types/services';
import { generateMockProducts } from '../utils/mockData';

/**
 * Mock Price Optimizer Service
 * 
 * Simulates finding the cheapest store(s) for a shopping list.
 * In the future, this will query the backend API for real price data.
 */
class MockPriceOptimizerService {
  // Mock price data per store chain
  // Product IDs match generateMockProducts(): '1'=Agurk, '2'=Melk, '3'=Egg, '4'=Brød, '5'=Tomat, '6'=Paprika, '7'=Kyllingfilet
  private mockPrices: Record<string, Record<string, number>> = {
    'Kiwi': {
      '1': 25.90, // Agurk
      '2': 18.50, // Melk
      '3': 45.00, // Egg
      '4': 35.00, // Brød
      '5': 32.00, // Tomat
      '6': 28.00, // Paprika
      '7': 89.00, // Kyllingfilet
    },
    'Rema 1000': {
      '1': 24.90,
      '2': 17.90,
      '3': 43.00,
      '4': 33.00,
      '5': 30.00,
      '6': 27.00,
      '7': 87.00,
    },
    'Coop Extra': {
      '1': 26.50,
      '2': 19.00,
      '3': 46.00,
      '4': 36.00,
      '5': 33.00,
      '6': 29.00,
      '7': 91.00,
    },
    'Meny': {
      '1': 27.00,
      '2': 19.50,
      '3': 47.00,
      '4': 37.00,
      '5': 34.00,
      '6': 30.00,
      '7': 93.00,
    },
  };

  private storeChains = ['Kiwi', 'Rema 1000', 'Coop Extra', 'Meny'];

  async findCheapestStore(items: ShoppingListItem[]): Promise<PriceComparisonResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (items.length === 0) {
      return {
        option1: { stores: [], total: 0 },
        option2: { stores: [], total: 0 },
      };
    }

    // Calculate total cost per store (single store option)
    const singleStoreCosts: Array<{ store: string; total: number; breakdown: PriceComparisonOption['breakdown'] }> = [];

    for (const store of this.storeChains) {
      let total = 0;
      const breakdown: PriceComparisonOption['breakdown'] = [];

      for (const item of items) {
        const price = this.mockPrices[store]?.[item.product_id] || 0;
        const itemTotal = price * item.quantity;
        total += itemTotal;
        breakdown.push({
          product_id: item.product_id,
          store,
          price: itemTotal,
        });
      }

      singleStoreCosts.push({ store, total, breakdown });
    }

    // Find cheapest single store
    const cheapestSingleStore = singleStoreCosts.reduce((prev, current) =>
      current.total < prev.total ? current : prev
    );

    // Calculate multi-store optimization (simplified - find best combination)
    // For simplicity, we'll use a greedy approach: assign each item to its cheapest store
    const multiStoreBreakdown: PriceComparisonOption['breakdown'] = [];
    let multiStoreTotal = 0;
    const usedStores = new Set<string>();

    for (const item of items) {
      let bestStore = '';
      let bestPrice = Infinity;

      for (const store of this.storeChains) {
        const price = this.mockPrices[store]?.[item.product_id] || 0;
        const itemTotal = price * item.quantity;
        if (itemTotal < bestPrice) {
          bestPrice = itemTotal;
          bestStore = store;
        }
      }

      if (bestStore) {
        usedStores.add(bestStore);
        multiStoreTotal += bestPrice;
        multiStoreBreakdown.push({
          product_id: item.product_id,
          store: bestStore,
          price: bestPrice,
        });
      }
    }

    return {
      option1: {
        stores: [cheapestSingleStore.store],
        total: Math.round(cheapestSingleStore.total * 100) / 100,
        breakdown: cheapestSingleStore.breakdown,
      },
      option2: {
        stores: Array.from(usedStores),
        total: Math.round(multiStoreTotal * 100) / 100,
        breakdown: multiStoreBreakdown,
      },
    };
  }
}

// Export singleton instance
export const priceOptimizer = new MockPriceOptimizerService();

// Export function for convenience
export async function findCheapestStore(
  items: ShoppingListItem[]
): Promise<PriceComparisonResult> {
  return priceOptimizer.findCheapestStore(items);
}
