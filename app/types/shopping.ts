/**
 * Shopping list-related type definitions
 */

import { Product } from './product';

export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  created_at: string; // ISO timestamp
}

export interface ShoppingListItem {
  id: string;
  list_id: string;
  product_id: string;
  quantity: number;
}

export interface ShoppingListWithItems extends ShoppingList {
  items: (ShoppingListItem & { product?: Product })[];
}
