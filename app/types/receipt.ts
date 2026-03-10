/**
 * Receipt-related type definitions
 */

export interface ParsedReceiptItem {
  nameRaw: string;
  price: number;
  quantity: number;
}

export interface ParsedReceipt {
  store: string;
  date: Date;
  items: ParsedReceiptItem[];
  total: number;
}

export interface Receipt {
  id: string;
  userId: string;
  storeName: string;
  storeChain: string;
  purchaseDate: string; // ISO date string
  totalAmount: number;
  receiptImageUrl: string | null;
  createdAt: string; // ISO timestamp
}

export interface ReceiptItem {
  id: string;
  receiptId: string;
  productNameRaw: string;
  normalizedProductId: string | null;
  price: number;
  quantity: number;
  unitPrice: number;
  createdAt: string; // ISO timestamp
}

export interface ReceiptWithItems extends Receipt {
  items: ReceiptItem[];
}
