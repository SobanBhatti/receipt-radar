import { create } from 'zustand';
import { ShoppingList, ShoppingListItem, ShoppingListWithItems } from '../types';

interface ShoppingListStore {
  lists: ShoppingList[];
  listItems: ShoppingListItem[];

  // Actions
  addList: (list: ShoppingList) => void;
  updateList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteList: (id: string) => void;
  getList: (id: string) => ShoppingListWithItems | null;
  addItemToList: (item: ShoppingListItem) => void;
  updateListItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  removeItemFromList: (id: string) => void;
  getListItems: (listId: string) => ShoppingListItem[];
}

export const useShoppingListStore = create<ShoppingListStore>((set, get) => ({
  lists: [],
  listItems: [],

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

  deleteList: (id) => {
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
      listItems: state.listItems.filter((item) => item.list_id !== id),
    }));
  },

  getList: (id) => {
    const state = get();
    const list = state.lists.find((l) => l.id === id);
    if (!list) return null;

    const items = state.listItems.filter((item) => item.list_id === id);
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
    return state.listItems.filter((item) => item.list_id === listId);
  },
}));
