/**
 * Central export point for all services
 */

export { ocrService, MockOCRService } from './ocrService';
export { processAndSaveReceipt, fetchReceipts, fetchReceiptById, deleteReceipt } from './receiptService';
export { priceOptimizer, findCheapestStore } from './priceOptimizer';
export {
  fetchShoppingLists,
  fetchShoppingListById,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  addShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
} from './shoppingListService';
export {
  fetchSpendingSummary,
  fetchMonthlySpending,
  fetchStoreSpending,
  fetchTopProducts,
} from './analyticsService';
export {
  fetchStores,
  fetchStoresByChain,
  fetchStoreChains,
} from './storeService';

// Generated API client
export { userApi, receiptApi, shoppingListApi } from './apiService';
export * from './apiService';