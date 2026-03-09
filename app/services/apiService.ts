/**
 * API Service - Configured instance of generated OpenAPI client
 */

import { API_CONFIG } from '../lib/apiConfig';
import { Configuration, UserApi, ReceiptApi, ShoppingListApi } from '../generated/api';

// Create API configuration
const apiConfiguration = new Configuration({
  basePath: API_CONFIG.baseUrl,
  baseOptions: {
    timeout: API_CONFIG.timeout,
  },
});

// Export configured API client instances
export const userApi = new UserApi(apiConfiguration);
export const receiptApi = new ReceiptApi(apiConfiguration);
export const shoppingListApi = new ShoppingListApi(apiConfiguration);

// Re-export types from generated API
export * from '../generated/api';
