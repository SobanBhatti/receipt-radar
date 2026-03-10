/**
 * Shopping list-related type definitions
 */

import { Product } from './product';

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  createdAt: string; // ISO timestamp
}

export interface ShoppingListItem {
  id: string;
  listId: string;
  productId: string;
  productName?: string; // Product name from API (optional for backward compatibility)
  quantity: number;
}

export interface ShoppingListWithItems extends ShoppingList {
  items: (ShoppingListItem & { product?: Product })[];
}
