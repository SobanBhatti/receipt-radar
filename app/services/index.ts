/**
 * Central export point for all services
 */

export { ocrService, MockOCRService } from './ocrService';
export { processAndSaveReceipt } from './receiptService';
export { priceOptimizer, findCheapestStore } from './priceOptimizer';
export { userApi, receiptApi, shoppingListApi } from './apiService';
export * from './apiService';