/**
 * OCR Service - Mock implementation
 * 
 * This service simulates OCR processing by returning structured test data.
 * In the future, this will integrate with real OCR providers (Google Vision, AWS Textract, etc.)
 */

import { ImageSource, OCRService } from '../types/services';
import { ParsedReceipt, ParsedReceiptItem } from '../types';

class MockOCRService implements OCRService {
  /**
   * Simulates OCR processing by returning mock receipt data
   * In production, this would call a real OCR API
   */
  async extractReceiptData(image: ImageSource): Promise<ParsedReceipt> {
    // Simulate processing delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock receipt data based on a realistic Norwegian grocery receipt
    const stores = [
      { name: 'Kiwi Storgata', chain: 'Kiwi' },
      { name: 'Rema 1000 Majorstuen', chain: 'Rema 1000' },
      { name: 'Coop Extra Solli', chain: 'Coop Extra' },
      { name: 'Meny Frogner', chain: 'Meny' },
    ];

    const store = stores[Math.floor(Math.random() * stores.length)];

    // Mock receipt items
    const mockItems: ParsedReceiptItem[] = [
      { nameRaw: 'Melk 1L', price: 25.90, quantity: 1 },
      { nameRaw: 'Brød Loaf', price: 18.50, quantity: 1 },
      { nameRaw: 'Egg 12pk', price: 35.00, quantity: 1 },
      { nameRaw: 'Agurk', price: 12.90, quantity: 2 },
      { nameRaw: 'Tomat', price: 24.90, quantity: 1 },
    ];

    const total = mockItems.reduce((sum, item) => sum + item.price, 0);

    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    return {
      store: store.name,
      date,
      items: mockItems,
      total: Math.round(total * 100) / 100, // Round to 2 decimal places
    };
  }
}

// Export singleton instance
export const ocrService = new MockOCRService();

// Export class for testing
export { MockOCRService };
