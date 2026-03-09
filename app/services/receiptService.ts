/**
 * Receipt Service - Handles receipt creation and processing
 * 
 * This service coordinates between OCR processing and saving receipts to the store
 */

import { ImageSource } from '../types/services';
import { Receipt, ReceiptItem } from '../types';
import { ParsedReceipt } from '../types/receipt';
import { ocrService } from './ocrService';
import { useReceiptStore } from '../store/useReceiptStore';

/**
 * Process an image and save the receipt
 */
export async function processAndSaveReceipt(
  image: ImageSource,
  userId: string = 'mock-user-id'
): Promise<{ receipt: Receipt; items: ReceiptItem[] }> {
  try {
    // Step 1: Extract receipt data using OCR
    const parsedReceipt: ParsedReceipt = await ocrService.extractReceiptData(image);

    // Step 2: Create receipt record
    const receiptId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const receipt: Receipt = {
      id: receiptId,
      user_id: userId,
      store_name: parsedReceipt.store,
      store_chain: extractStoreChain(parsedReceipt.store),
      purchase_date: parsedReceipt.date.toISOString().split('T')[0],
      total_amount: parsedReceipt.total,
      receipt_image_url: image.uri, // In production, this would be a cloud storage URL
      created_at: new Date().toISOString(),
    };

    // Step 3: Create receipt items
    const receiptItems: ReceiptItem[] = parsedReceipt.items.map((item, index) => ({
      id: `${receiptId}-item-${index}`,
      receipt_id: receiptId,
      product_name_raw: item.name_raw,
      normalized_product_id: null, // Will be set when product normalization is implemented
      price: item.price,
      quantity: item.quantity,
      unit_price: item.price / item.quantity,
      created_at: new Date().toISOString(),
    }));

    // Step 4: Save to store
    const store = useReceiptStore.getState();
    store.addReceipt(receipt, receiptItems);

    return { receipt, items: receiptItems };
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw error;
  }
}

/**
 * Extract store chain from store name
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
  return 'Unknown';
}
