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
  alias_name: string;
  product_id: string;
}

export interface PriceObservation {
  id: string;
  product_id: string;
  store_chain: string;
  store_name: string;
  price: number;
  timestamp: string; // ISO timestamp
  receipt_id: string;
}

export interface ProductPriceLatest {
  product_id: string;
  store_chain: string;
  median_price: number;
  last_updated: string; // ISO timestamp
  observation_count: number;
}

/**
 * Store chains supported by the app
 */
export type StoreChain = 
  | 'Kiwi'
  | 'Rema 1000'
  | 'Coop Extra'
  | 'Coop Prix'
  | 'Coop Mega'
  | 'Meny'
  | 'Spar';

export interface Store {
  id: string;
  name: string;
  chain: StoreChain;
  location: string | null;
}
