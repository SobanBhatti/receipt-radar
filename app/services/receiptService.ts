/**
 * Receipt Service - Handles receipt creation and processing
 * 
 * This service coordinates between OCR processing and saving receipts via API
 */

import { ImageSource } from '../types/services';
import { Receipt, ReceiptItem } from '../types';
import { ParsedReceipt } from '../types/receipt';
import { ocrService } from './ocrService';
import { receiptApi } from './apiService';
import type { CreateReceiptDto, ReceiptDto, ReceiptItemDto } from '../generated/api/index';

/**
 * Process an image and save the receipt via API
 */
export async function processAndSaveReceipt(
  image: ImageSource,
  userId: string = '00000000-0000-0000-0000-000000000001' // TODO: Get from auth context
): Promise<{ receipt: Receipt; items: ReceiptItem[] }> {
  try {
    // Step 1: Extract receipt data using OCR
    const parsedReceipt: ParsedReceipt = await ocrService.extractReceiptData(image);

    // Step 2: Create receipt DTO for API
    const createReceiptDto: CreateReceiptDto = {
      storeName: parsedReceipt.store,
      storeChain: extractStoreChain(parsedReceipt.store), // Backend will improve this match
      purchaseDate: parsedReceipt.date.toISOString(),
      totalAmount: parsedReceipt.total,
      receiptImageUrl: null, // Not storing images for now
      items: parsedReceipt.items.map((item) => ({
        productNameRaw: item.nameRaw,
        normalizedProductId: null, // Backend will match or create products
        price: item.price,
        quantity: item.quantity,
        unitPrice: item.price / item.quantity,
      })),
    };

    // Step 3: Save receipt via API
    const response = await receiptApi.apiReceiptPost(createReceiptDto);
    const receiptDto = response.data;

    // Step 4: Map DTO to our types
    const receipt: Receipt = {
      id: receiptDto.id!,
      userId: userId,
      storeName: receiptDto.storeName || '',
      storeChain: receiptDto.storeChain || null,
      purchaseDate: receiptDto.purchaseDate.split('T')[0],
      totalAmount: receiptDto.totalAmount || 0,
      receiptImageUrl: receiptDto.receiptImageUrl,
      createdAt: receiptDto.createdAt || new Date().toISOString(),
    };

    const receiptItems: ReceiptItem[] = (receiptDto.items || []).map((item: ReceiptItemDto) => ({
      id: item.id!,
      receiptId: receipt.id,
      productNameRaw: item.productNameRaw || '',
      normalizedProductId: item.normalizedProductId,
      price: item.price || 0,
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    return { receipt, items: receiptItems };
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw error;
  }
}

/**
 * Extract store chain from store name
 * This is a fallback - ideally the OCR should match against the stores table
 */
function extractStoreChain(storeName: string): string {
  const name = storeName.toLowerCase();
  if (name.includes('kiwi')) return 'Kiwi';
  if (name.includes('rema')) return 'Rema 1000';
  if (name.includes('coop extra')) return 'Coop Extra';
  if (name.includes('coop prix')) return 'Coop Prix';
  if (name.includes('coop mega')) return 'Coop Mega';
  if (name.includes('meny')) return 'Meny';
  if (name.includes('spar')) return 'Spar';
  if (name.includes('joker')) return 'Joker';
  if (name.includes('bunnpris')) return 'Bunnpris';
  return 'Unknown';
}

/**
 * Fetch all receipts for the current user
 */
export async function fetchReceipts(userId: string): Promise<Receipt[]> {
  try {
    const response = await receiptApi.apiReceiptGet();
    const receiptDtos = response.data;
    
    return receiptDtos.map((dto: ReceiptDto) => ({
      id: dto.id!,
      userId: userId,
      storeName: dto.storeName || '',
      storeChain: dto.storeChain || null,
      purchaseDate: dto.purchaseDate.split('T')[0],
      totalAmount: dto.totalAmount || 0,
      receiptImageUrl: dto.receiptImageUrl,
      createdAt: dto.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching receipts:', error);
    throw error;
  }
}

/**
 * Fetch a single receipt by ID
 */
export async function fetchReceiptById(id: string, userId: string): Promise<Receipt & { items: ReceiptItem[] }> {
  try {
    const response = await receiptApi.apiReceiptIdGet(id);
    const dto = response.data;
    
    return {
      id: dto.id!,
      userId: userId,
      storeName: dto.storeName || '',
      storeChain: dto.storeChain || null,
      purchaseDate: dto.purchaseDate.split('T')[0],
      totalAmount: dto.totalAmount || 0,
      receiptImageUrl: dto.receiptImageUrl,
      createdAt: dto.createdAt || new Date().toISOString(),
      items: (dto.items || []).map((item: ReceiptItemDto) => ({
        id: item.id!,
        receiptId: dto.id!,
        productNameRaw: item.productNameRaw || '',
        normalizedProductId: item.normalizedProductId,
        price: item.price || 0,
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        createdAt: item.createdAt || new Date().toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching receipt:', error);
    throw error;
  }
}

/**
 * Delete a receipt
 */
export async function deleteReceipt(id: string, userId: string): Promise<void> {
  try {
    await receiptApi.apiReceiptIdDelete(id);
  } catch (error) {
    console.error('Error deleting receipt:', error);
    throw error;
  }
}
