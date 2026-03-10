import { create } from 'zustand';
import { Receipt, ReceiptItem, ReceiptWithItems } from '../types';
import { fetchReceipts, fetchReceiptById, deleteReceipt as deleteReceiptApi } from '../services/receiptService';

interface ReceiptStore {
  receipts: Receipt[];
  receiptItems: ReceiptItem[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addReceipt: (receipt: Receipt, items: ReceiptItem[]) => void;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  deleteReceipt: (id: string, userId: string) => Promise<void>;
  getReceipt: (id: string) => ReceiptWithItems | null;
  getReceiptsByDateRange: (startDate: string, endDate: string) => Receipt[];
  getReceiptsByStore: (storeChain: string) => Receipt[];
  
  // API sync actions
  fetchReceipts: (userId: string) => Promise<void>;
  fetchReceipt: (id: string, userId: string) => Promise<ReceiptWithItems | null>;
  refreshReceipts: (userId: string) => Promise<void>;
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  receipts: [],
  receiptItems: [],
  loading: false,
  error: null,

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

  deleteReceipt: async (id, userId) => {
    try {
      set({ loading: true, error: null });
      await deleteReceiptApi(id, userId);
      
      set((state) => ({
        receipts: state.receipts.filter((r) => r.id !== id),
        receiptItems: state.receiptItems.filter((item) => item.receiptId !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to delete receipt' 
      });
      throw error;
    }
  },

  getReceipt: (id) => {
    const state = get();
    const receipt = state.receipts.find((r) => r.id === id);
    if (!receipt) return null;

    const items = state.receiptItems.filter((item) => item.receiptId === id);
    return { ...receipt, items };
  },

  getReceiptsByDateRange: (startDate, endDate) => {
    const state = get();
    return state.receipts.filter((r) => {
      const purchaseDate = r.purchaseDate;
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  },

  getReceiptsByStore: (storeChain) => {
    const state = get();
    return state.receipts.filter((r) => r.storeChain === storeChain);
  },

  fetchReceipts: async (userId) => {
    try {
      set({ loading: true, error: null });
      const receipts = await fetchReceipts(userId);
      
      // Extract items from receipts
      const receiptItems: ReceiptItem[] = [];
      receipts.forEach((receipt) => {
        // If receipt has items, add them
        if ('items' in receipt && Array.isArray((receipt as any).items)) {
          receiptItems.push(...(receipt as any).items);
        }
      });

      set({ 
        receipts, 
        receiptItems,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch receipts' 
      });
      throw error;
    }
  },

  fetchReceipt: async (id, userId) => {
    try {
      set({ loading: true, error: null });
      const receiptWithItems = await fetchReceiptById(id, userId);
      
      // Update store with receipt and items
      set((state) => {
        const existingReceiptIndex = state.receipts.findIndex((r) => r.id === id);
        const updatedReceipts = existingReceiptIndex >= 0
          ? state.receipts.map((r) => r.id === id ? receiptWithItems : r)
          : [...state.receipts, receiptWithItems];

        // Update items
        const otherItems = state.receiptItems.filter((item) => item.receiptId !== id);
        const updatedItems = [...otherItems, ...receiptWithItems.items];

        return {
          receipts: updatedReceipts,
          receiptItems: updatedItems,
          loading: false,
        };
      });

      return receiptWithItems;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch receipt' 
      });
      throw error;
    }
  },

  refreshReceipts: async (userId) => {
    await get().fetchReceipts(userId);
  },
}));
