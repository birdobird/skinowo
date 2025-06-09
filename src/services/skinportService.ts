import api from './api';

export interface SkinportItem {
  id: number;
  market_hash_name: string;
  currency: string;
  suggested_price: number;
  item_page: string;
  market_page: string;
  min_price: number;
  max_price: number;
  mean_price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  icon_url: string;
}

/**
 * Fetches current item prices from Skinport via our backend API
 * @param appId - Steam App ID (default: 730 for CS2)
 * @param currency - Currency code (default: EUR)
 * @returns Promise containing array of Skinport items with prices
 */
export const getItemPrices = async (
  appId: number = 730,
  currency: string = 'EUR',
  signal?: AbortSignal
): Promise<SkinportItem[]> => {
  try {
    const response = await api.get(`/skins/prices?appId=${appId}&currency=${currency}`, {
      signal
    });
    
    // Ensure each item has an icon_url, using a default if not provided
    return response.data.prices.map((item: any) => ({
      ...item,
      icon_url: item.icon_url || '/src/assets/default-skin.png'
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching Skinport prices:', error);
        throw error;
      }
    } else {
      console.error('Unknown error fetching Skinport prices:', error);
      throw new Error('An unknown error occurred while fetching prices');
    }
    return [];
  }
};

/**
 * Finds a specific item's price data from Skinport
 * @param marketHashName - The market_hash_name of the item to find
 * @param appId - Steam App ID (default: 730 for CS2)
 * @param currency - Currency code (default: EUR)
 * @returns Promise containing the item data or null if not found
 */
export const getItemPrice = async (
  marketHashName: string,
  appId: number = 730,
  currency: string = 'EUR'
): Promise<SkinportItem | null> => {
  try {
    const items = await getItemPrices(appId, currency);
    return items.find(item => item.market_hash_name === marketHashName) || null;
  } catch (error) {
    console.error(`Error fetching price for ${marketHashName}:`, error);
    throw error;
  }
};

/**
 * Updates all skin prices in the database (admin only)
 * @returns Promise with the update result
 */
export const updateAllPrices = async (): Promise<{
  success: boolean;
  message: string;
  totalSkins: number;
}> => {
  try {
    const response = await api.post('/skins/fetch-prices');
    return response.data;
  } catch (error) {
    console.error('Error updating skin prices:', error);
    throw error;
  }
};

const skinportService = {
  getItemPrices,
  getItemPrice,
  updateAllPrices
};

export default skinportService;
