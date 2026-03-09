import { create } from 'zustand';
import { Receipt, ReceiptItem, ReceiptWithItems } from '../types';

interface ReceiptStore {
  receipts: Receipt[];
  receiptItems: ReceiptItem[];
  
  // Actions
  addReceipt: (receipt: Receipt, items: ReceiptItem[]) => void;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  getReceipt: (id: string) => ReceiptWithItems | null;
  getReceiptsByDateRange: (startDate: string, endDate: string) => Receipt[];
  getReceiptsByStore: (storeChain: string) => Receipt[];
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  receipts: [],
  receiptItems: [],

  addReceipt: (receipt, items) => {
    set((state) => ({
      receipts: [...state.receipts, receipt],
      receiptItems: [...state.receiptItems, ...items],
    }));
  },

  updateReceipt: (id, updates) => {
    set((state) => ({
      receipts: state.receipts.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  },

  deleteReceipt: (id) => {
    set((state) => ({
      receipts: state.receipts.filter((r) => r.id !== id),
      receiptItems: state.receiptItems.filter((item) => item.receipt_id !== id),
    }));
  },

  getReceipt: (id) => {
    const state = get();
    const receipt = state.receipts.find((r) => r.id === id);
    if (!receipt) return null;

    const items = state.receiptItems.filter((item) => item.receipt_id === id);
    return { ...receipt, items };
  },

  getReceiptsByDateRange: (startDate, endDate) => {
    const state = get();
    return state.receipts.filter((r) => {
      const purchaseDate = r.purchase_date;
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  },

  getReceiptsByStore: (storeChain) => {
    const state = get();
    return state.receipts.filter((r) => r.store_chain === storeChain);
  },
}));
