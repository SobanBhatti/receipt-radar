/**
 * Service-related type definitions
 */

import { ParsedReceipt } from './receipt';

/**
 * OCR Service types
 */
export interface ImageSource {
  uri: string;
  width?: number;
  height?: number;
}

export interface OCRService {
  extractReceiptData(image: ImageSource): Promise<ParsedReceipt>;
}

/**
 * Price Optimizer Service types
 */
import { ShoppingListItem } from './shopping';

export interface PriceComparisonOption {
  stores: string[];
  total: number;
  breakdown?: Array<{
    product_id: string;
    store: string;
    price: number;
  }>;
}

export interface PriceComparisonResult {
  option1: PriceComparisonOption; // Cheapest single store
  option2: PriceComparisonOption; // Cheapest combination of stores
}

export interface PriceOptimizerService {
  findCheapestStore(items: ShoppingListItem[]): Promise<PriceComparisonResult>;
}
