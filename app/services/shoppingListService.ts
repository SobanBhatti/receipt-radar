/**
 * Shopping List Service - Handles shopping list operations via API
 */

import { ShoppingList, ShoppingListItem } from '../types';
import { shoppingListApi } from './apiService';
import type {
  ShoppingListDto,
  ShoppingListItemDto,
  CreateShoppingListDto,
  UpdateShoppingListDto,
  AddShoppingListItemDto,
  UpdateShoppingListItemDto,
} from '../generated/api/index';

/**
 * Helper function to validate and normalize date strings
 */
function normalizeDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return new Date().toISOString();
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Fetch all shopping lists for the current user
 */
export async function fetchShoppingLists(userId: string): Promise<ShoppingList[]> {
  try {
    const response = await shoppingListApi.apiShoppingListGet();
    const dtos = response.data;
    
    return dtos.map((dto: ShoppingListDto) => ({
      id: dto.id!,
      userId: userId,
      name: dto.name || '',
      createdAt: normalizeDate(dto.createdAt),
    }));
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    throw error;
  }
}

/**
 * Fetch a single shopping list by ID
 */
export async function fetchShoppingListById(id: string, userId: string): Promise<ShoppingList & { items: ShoppingListItem[] }> {
  try {
    const response = await shoppingListApi.apiShoppingListIdGet(id);
    const dto = response.data;
    
    return {
      id: dto.id!,
      userId: userId,
      name: dto.name || '',
      createdAt: normalizeDate(dto.createdAt),
      items: (dto.items || [])
        .filter((item: ShoppingListItemDto) => item.productId) // Filter out items without productId
        .map((item: ShoppingListItemDto) => ({
          id: item.id!,
          listId: dto.id!,
          productId: item.productId!,
          productName: item.productName || undefined, // Include product name from API (may be null)
          quantity: item.quantity || 0,
        })),
    };
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    throw error;
  }
}

/**
 * Create a new shopping list
 */
export async function createShoppingList(name: string, userId: string): Promise<ShoppingList> {
  try {
    const createDto: CreateShoppingListDto = { name };
    const response = await shoppingListApi.apiShoppingListPost(createDto);
    const dto = response.data;
    
    return {
      id: dto.id!,
      userId: userId,
      name: dto.name || '',
      createdAt: normalizeDate(dto.createdAt),
    };
  } catch (error) {
    console.error('Error creating shopping list:', error);
    throw error;
  }
}

/**
 * Update a shopping list
 */
export async function updateShoppingList(id: string, name: string, userId: string): Promise<ShoppingList> {
  try {
    const updateDto: UpdateShoppingListDto = { name };
    const response = await shoppingListApi.apiShoppingListIdPut(id, updateDto);
    const dto = response.data;
    
    return {
      id: dto.id!,
      userId: userId,
      name: dto.name || '',
      createdAt: normalizeDate(dto.createdAt),
    };
  } catch (error) {
    console.error('Error updating shopping list:', error);
    throw error;
  }
}

/**
 * Delete a shopping list
 */
export async function deleteShoppingList(id: string, userId: string): Promise<void> {
  try {
    await shoppingListApi.apiShoppingListIdDelete(id);
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    throw error;
  }
}

/**
 * Add an item to a shopping list
 */
export async function addShoppingListItem(listId: string, productId: string, quantity: number, userId: string): Promise<ShoppingListItem> {
  try {
    // Validate productId is a valid UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId)) {
      throw new Error(`Invalid product ID format: ${productId}. Product ID must be a valid UUID.`);
    }

    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const addDto: AddShoppingListItemDto = {
      productId,
      quantity,
    };
    
    console.log('Adding shopping list item:', { listId, productId, quantity, dto: addDto });
    
    const response = await shoppingListApi.apiShoppingListListIdItemsPost(listId, addDto);
    const dto = response.data;
    
    if (!dto.productId) {
      throw new Error('Product ID not returned from API');
    }
    
    return {
      id: dto.id!,
      listId: listId,
      productId: dto.productId,
      productName: dto.productName || undefined, // Include product name from API
      quantity: dto.quantity || 0,
    };
  } catch (error: any) {
    console.error('Error adding shopping list item:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update a shopping list item
 */
export async function updateShoppingListItem(listId: string, itemId: string, quantity: number, userId: string): Promise<ShoppingListItem> {
  try {
    const updateDto: UpdateShoppingListItemDto = { quantity };
    const response = await shoppingListApi.apiShoppingListListIdItemsItemIdPut(listId, itemId, updateDto);
    const dto = response.data;
    
    return {
      id: dto.id!,
      listId: listId,
      productId: dto.productId || '',
      productName: dto.productName || undefined, // Include product name from API
      quantity: dto.quantity || 0,
    };
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    throw error;
  }
}

/**
 * Delete a shopping list item
 */
export async function deleteShoppingListItem(listId: string, itemId: string, userId: string): Promise<void> {
  try {
    await shoppingListApi.apiShoppingListListIdItemsItemIdDelete(listId, itemId);
  } catch (error) {
    console.error('Error deleting shopping list item:', error);
    throw error;
  }
}
