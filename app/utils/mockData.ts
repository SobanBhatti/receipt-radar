/**
 * Mock data generators for development and testing
 */

import { Receipt, ReceiptItem, Product, ShoppingList, ShoppingListItem, StoreChain } from '../types';

/**
 * Generate a UUID-like string for mock IDs
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a mock receipt with items
 */
export function generateMockReceipt(
  storeName: string,
  storeChain: StoreChain,
  date: Date,
  items: Array<{ name: string; price: number; quantity: number }>
): { receipt: Receipt; receiptItems: ReceiptItem[] } {
  const receiptId = generateId();
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const receipt: Receipt = {
    id: receiptId,
    userId: 'mock-user-id',
    storeName: storeName,
    storeChain: storeChain,
    purchaseDate: date.toISOString().split('T')[0],
    totalAmount: total,
    receiptImageUrl: null,
    createdAt: new Date().toISOString(),
  };

  const receiptItems: ReceiptItem[] = items.map((item, index) => ({
    id: generateId(),
    receiptId: receiptId,
    productNameRaw: item.name,
    normalizedProductId: null,
    price: item.price,
    quantity: item.quantity,
    unitPrice: item.price / item.quantity,
    createdAt: new Date().toISOString(),
  }));

  return { receipt, receiptItems };
}

/**
 * Generate sample mock receipts for testing
 */
export function generateSampleReceipts(): Array<{ receipt: Receipt; receiptItems: ReceiptItem[] }> {
  const now = new Date();
  const receipts = [];

  // Receipt 1: Kiwi - 3 days ago
  const date1 = new Date(now);
  date1.setDate(date1.getDate() - 3);
  receipts.push(
    generateMockReceipt('Kiwi Storgata', 'Kiwi', date1, [
      { name: 'Melk', price: 25.90, quantity: 1 },
      { name: 'Brød', price: 18.50, quantity: 1 },
      { name: 'Egg', price: 35.00, quantity: 1 },
    ])
  );

  // Receipt 2: Rema 1000 - 1 week ago
  const date2 = new Date(now);
  date2.setDate(date2.getDate() - 7);
  receipts.push(
    generateMockReceipt('Rema 1000 Majorstuen', 'Rema 1000', date2, [
      { name: 'Agurk', price: 12.90, quantity: 2 },
      { name: 'Tomat', price: 24.90, quantity: 1 },
      { name: 'Paprika', price: 19.90, quantity: 2 },
      { name: 'Kyllingfilet', price: 89.90, quantity: 1 },
    ])
  );

  // Receipt 3: Coop Extra - 2 weeks ago
  const date3 = new Date(now);
  date3.setDate(date3.getDate() - 14);
  receipts.push(
    generateMockReceipt('Coop Extra Solli', 'Coop Extra', date3, [
      { name: 'Melk', price: 26.50, quantity: 2 },
      { name: 'Brød', price: 19.90, quantity: 1 },
      { name: 'Egg', price: 36.00, quantity: 1 },
      { name: 'Agurk', price: 13.50, quantity: 1 },
    ])
  );

  return receipts;
}

/**
 * Generate mock products
 */
export function generateMockProducts(): Product[] {
  return [
    { id: '1', name: 'Agurk', category: 'Vegetables' },
    { id: '2', name: 'Melk', category: 'Dairy' },
    { id: '3', name: 'Egg', category: 'Dairy' },
    { id: '4', name: 'Brød', category: 'Bakery' },
    { id: '5', name: 'Tomat', category: 'Vegetables' },
    { id: '6', name: 'Paprika', category: 'Vegetables' },
    { id: '7', name: 'Kyllingfilet', category: 'Meat' },
  ];
}

/**
 * Generate mock shopping list
 */
export function generateMockShoppingList(name: string, productIds: string[]): {
  list: ShoppingList;
  items: ShoppingListItem[];
} {
  const listId = generateId();
  const list: ShoppingList = {
    id: listId,
    userId: 'mock-user-id',
    name,
    createdAt: new Date().toISOString(),
  };

  const items: ShoppingListItem[] = productIds.map((productId) => ({
    id: generateId(),
    listId: listId,
    productId: productId,
    quantity: 1,
  }));

  return { list, items };
}
