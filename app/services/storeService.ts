/**
 * Store Service - Handles store operations via API
 */

import { Store } from '../types/product';
import { storeApi } from './apiService';
import type { StoreDto } from '../generated/api/index';

/**
 * Fetch all stores
 */
export async function fetchStores(): Promise<Store[]> {
  try {
    const response = await storeApi.apiStoreGet();
    const dtos = response.data;
    
    return dtos.map((dto: StoreDto) => ({
      id: dto.id!,
      name: dto.name || '',
      chain: (dto.chain || 'Unknown') as Store['chain'],
      location: dto.location,
    }));
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
}

/**
 * Fetch stores by chain
 */
export async function fetchStoresByChain(chain: string): Promise<Store[]> {
  try {
    const response = await storeApi.apiStoreChainChainGet(chain);
    const dtos = response.data;
    
    return dtos.map((dto: StoreDto) => ({
      id: dto.id!,
      name: dto.name || '',
      chain: (dto.chain || 'Unknown') as Store['chain'],
      location: dto.location,
    }));
  } catch (error) {
    console.error('Error fetching stores by chain:', error);
    throw error;
  }
}

/**
 * Fetch all unique store chains
 */
export async function fetchStoreChains(): Promise<string[]> {
  try {
    const response = await storeApi.apiStoreChainsGet();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching store chains:', error);
    throw error;
  }
}
