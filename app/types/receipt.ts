/**
 * Receipt-related type definitions
 */

export interface ParsedReceiptItem {
  name_raw: string;
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
  user_id: string;
  store_name: string;
  store_chain: string;
  purchase_date: string; // ISO date string
  total_amount: number;
  receipt_image_url: string | null;
  created_at: string; // ISO timestamp
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  product_name_raw: string;
  normalized_product_id: string | null;
  price: number;
  quantity: number;
  unit_price: number;
  created_at: string; // ISO timestamp
}

export interface ReceiptWithItems extends Receipt {
  items: ReceiptItem[];
}
