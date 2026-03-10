/**
 * Product-related type definitions
 */

export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface ProductAlias {
  id: string;
  aliasName: string;
  productId: string;
}

export interface PriceObservation {
  id: string;
  productId: string;
  storeChain: string;
  storeName: string;
  price: number;
  timestamp: string; // ISO timestamp
  receiptId: string;
}

export interface ProductPriceLatest {
  productId: string;
  storeChain: string;
  medianPrice: number;
  lastUpdated: string; // ISO timestamp
  observationCount: number;
}

/**
 * Store chains supported by the app (Norwegian stores)
 */
export type StoreChain = 
  | 'Kiwi'
  | 'Rema 1000'
  | 'Coop Extra'
  | 'Coop Prix'
  | 'Coop Mega'
  | 'Meny'
  | 'Spar'
  | 'Joker'
  | 'Bunnpris';

export interface Store {
  id: string;
  name: string;
  chain: StoreChain;
  location: string | null;
}
