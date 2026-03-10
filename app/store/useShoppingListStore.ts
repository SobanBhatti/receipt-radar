import { create } from 'zustand';
import { ShoppingList, ShoppingListItem, ShoppingListWithItems } from '../types';
import {
  fetchShoppingLists,
  fetchShoppingListById,
  createShoppingList as createShoppingListApi,
  updateShoppingList as updateShoppingListApi,
  deleteShoppingList as deleteShoppingListApi,
  addShoppingListItem as addShoppingListItemApi,
  updateShoppingListItem as updateShoppingListItemApi,
  deleteShoppingListItem as deleteShoppingListItemApi,
} from '../services/shoppingListService';

interface ShoppingListStore {
  lists: ShoppingList[];
  listItems: ShoppingListItem[];
  loading: boolean;
  error: string | null;

  // Actions
  addList: (list: ShoppingList) => void;
  updateList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteList: (id: string, userId: string) => Promise<void>;
  getList: (id: string) => ShoppingListWithItems | null;
  addItemToList: (item: ShoppingListItem) => void;
  updateListItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  removeItemFromList: (id: string) => void;
  getListItems: (listId: string) => ShoppingListItem[];

  // API sync actions
  fetchShoppingLists: (userId: string) => Promise<void>;
  fetchShoppingList: (id: string, userId: string) => Promise<ShoppingListWithItems | null>;
  createShoppingList: (name: string, userId: string) => Promise<ShoppingList>;
  updateShoppingList: (id: string, name: string, userId: string) => Promise<ShoppingList>;
  deleteShoppingList: (id: string, userId: string) => Promise<void>;
  addShoppingListItem: (listId: string, productId: string, quantity: number, userId: string) => Promise<ShoppingListItem>;
  updateShoppingListItem: (listId: string, itemId: string, quantity: number, userId: string) => Promise<ShoppingListItem>;
  deleteShoppingListItem: (listId: string, itemId: string, userId: string) => Promise<void>;
  refreshShoppingLists: (userId: string) => Promise<void>;
}

export const useShoppingListStore = create<ShoppingListStore>((set, get) => ({
  lists: [],
  listItems: [],
  loading: false,
  error: null,

  addList: (list) => {
    set((state) => ({
      lists: [...state.lists, list],
    }));
  },

  updateList: (id, updates) => {
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    }));
  },

  deleteList: async (id, userId) => {
    try {
      set({ loading: true, error: null });
      await deleteShoppingListApi(id, userId);
      
      set((state) => ({
        lists: state.lists.filter((l) => l.id !== id),
        listItems: state.listItems.filter((item) => item.listId !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to delete shopping list' 
      });
      throw error;
    }
  },

  getList: (id) => {
    const state = get();
    const list = state.lists.find((l) => l.id === id);
    if (!list) return null;

    const items = state.listItems.filter((item) => item.listId === id);
    return { ...list, items };
  },

  addItemToList: (item) => {
    set((state) => ({
      listItems: [...state.listItems, item],
    }));
  },

  updateListItem: (id, updates) => {
    set((state) => ({
      listItems: state.listItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  removeItemFromList: (id) => {
    set((state) => ({
      listItems: state.listItems.filter((item) => item.id !== id),
    }));
  },

  getListItems: (listId) => {
    const state = get();
    return state.listItems.filter((item) => item.listId === listId);
  },

  fetchShoppingLists: async (userId) => {
    try {
      set({ loading: true, error: null });
      const lists = await fetchShoppingLists(userId);
      
      // Fetch items for each list
      const allItems: ShoppingListItem[] = [];
      for (const list of lists) {
        try {
          const listWithItems = await fetchShoppingListById(list.id, userId);
          if (listWithItems.items) {
            allItems.push(...listWithItems.items);
          }
        } catch (error) {
          // If fetching items fails, continue with other lists
          console.warn(`Failed to fetch items for list ${list.id}:`, error);
        }
      }

      set({ 
        lists, 
        listItems: allItems,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch shopping lists' 
      });
      throw error;
    }
  },

  fetchShoppingList: async (id, userId) => {
    try {
      set({ loading: true, error: null });
      const listWithItems = await fetchShoppingListById(id, userId);
      
      // Update store
      set((state) => {
        const existingListIndex = state.lists.findIndex((l) => l.id === id);
        const updatedLists = existingListIndex >= 0
          ? state.lists.map((l) => l.id === id ? listWithItems : l)
          : [...state.lists, listWithItems];

        // Update items
        const otherItems = state.listItems.filter((item) => item.listId !== id);
        const updatedItems = [...otherItems, ...listWithItems.items];

        return {
          lists: updatedLists,
          listItems: updatedItems,
          loading: false,
        };
      });

      return listWithItems;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch shopping list' 
      });
      throw error;
    }
  },

  createShoppingList: async (name, userId) => {
    try {
      set({ loading: true, error: null });
      const newList = await createShoppingListApi(name, userId);
      
      set((state) => ({
        lists: [...state.lists, newList],
        loading: false,
      }));

      return newList;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to create shopping list' 
      });
      throw error;
    }
  },

  updateShoppingList: async (id, name, userId) => {
    try {
      set({ loading: true, error: null });
      const updatedList = await updateShoppingListApi(id, name, userId);
      
      set((state) => ({
        lists: state.lists.map((l) => l.id === id ? updatedList : l),
        loading: false,
      }));

      return updatedList;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to update shopping list' 
      });
      throw error;
    }
  },

  deleteShoppingList: async (id, userId) => {
    await get().deleteList(id, userId);
  },

  addShoppingListItem: async (listId, productId, quantity, userId) => {
    try {
      set({ loading: true, error: null });
      const newItem = await addShoppingListItemApi(listId, productId, quantity, userId);
      
      set((state) => ({
        listItems: [...state.listItems, newItem],
        loading: false,
      }));

      return newItem;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to add item to shopping list' 
      });
      throw error;
    }
  },

  updateShoppingListItem: async (listId, itemId, quantity, userId) => {
    try {
      set({ loading: true, error: null });
      const updatedItem = await updateShoppingListItemApi(listId, itemId, quantity, userId);
      
      set((state) => ({
        listItems: state.listItems.map((item) =>
          item.id === itemId ? updatedItem : item
        ),
        loading: false,
      }));

      return updatedItem;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to update shopping list item' 
      });
      throw error;
    }
  },

  deleteShoppingListItem: async (listId, itemId, userId) => {
    try {
      set({ loading: true, error: null });
      await deleteShoppingListItemApi(listId, itemId, userId);
      
      set((state) => ({
        listItems: state.listItems.filter((item) => item.id !== itemId),
        loading: false,
      }));
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to delete shopping list item' 
      });
      throw error;
    }
  },

  refreshShoppingLists: async (userId) => {
    await get().fetchShoppingLists(userId);
  },
}));
