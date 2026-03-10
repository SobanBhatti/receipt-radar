import { create } from 'zustand';
import { Store } from '../types/product';
import { fetchStores, fetchStoreChains, fetchStoresByChain } from '../services/storeService';

interface StoreStore {
  stores: Store[];
  storeChains: string[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchStores: () => Promise<void>;
  fetchStoreChains: () => Promise<void>;
  fetchStoresByChain: (chain: string) => Promise<Store[]>;
  refreshStores: () => Promise<void>;
}

export const useStoreStore = create<StoreStore>((set, get) => ({
  stores: [],
  storeChains: [],
  loading: false,
  error: null,

  fetchStores: async () => {
    try {
      set({ loading: true, error: null });
      const stores = await fetchStores();
      
      set({ 
        stores,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch stores' 
      });
      throw error;
    }
  },

  fetchStoreChains: async () => {
    try {
      set({ loading: true, error: null });
      const chains = await fetchStoreChains();
      
      set({ 
        storeChains: chains,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch store chains' 
      });
      throw error;
    }
  },

  fetchStoresByChain: async (chain) => {
    try {
      set({ loading: true, error: null });
      const stores = await fetchStoresByChain(chain);
      
      set({ loading: false });
      return stores;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch stores by chain' 
      });
      throw error;
    }
  },

  refreshStores: async () => {
    await Promise.all([
      get().fetchStores(),
      get().fetchStoreChains(),
    ]);
  },
}));
