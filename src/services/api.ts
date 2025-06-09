import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Try to refresh the token
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        
        // Save the new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  loginWithSteam: async () => {
    const response = await api.post('/auth/steam');
    return response.data;
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user');
      // Ensure the response has the expected structure
      if (response.data && response.data.success && response.data.user) {
        return {
          success: true,
          user: {
            steamId: response.data.user.steamId || '',
            displayName: response.data.user.displayName || response.data.user.username || 'User',
            username: response.data.user.username || response.data.user.displayName || 'User',
            avatarUrl: response.data.user.avatarUrl || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            email: response.data.user.email || '',
            tradeUrl: response.data.user.tradeUrl || '',
            isAdmin: response.data.user.isAdmin || false,
            balance: response.data.user.balance || 0,
            isVerified: response.data.user.isVerified || false
          }
        };
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  updateTradeUrl: async (tradeUrl: string) => {
    const response = await api.put('/auth/user/trade-url', { tradeUrl });
    return response.data;
  },
};

// Support API
export const supportAPI = {
  createTicket: async (ticketData: {
    name: string;
    email: string;
    category: string;
    steamId?: string;
    message: string;
  }) => {
    const response = await api.post('/support/ticket', ticketData);
    return response.data;
  },
  
  getTicketDetails: async (id: string, email?: string) => {
    const params = email ? { email } : {};
    const response = await api.get(`/support/ticket/${id}`, { params });
    return response.data;
  },
  
  updateTicket: async (id: string, data: { message: string; email?: string }) => {
    const response = await api.put(`/support/ticket/${id}`, data);
    return response.data;
  },
  
  getFaqEntries: async (category?: string) => {
    const params = category ? { category } : {};
    const response = await api.get('/support/faq', { params });
    return response.data;
  },
  
  getRecentSteamIds: async () => {
    const response = await api.get('/support/steam-ids');
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getUserInventory: async (language: string = 'pl') => {
    const response = await api.get('/inventory', {
      params: { lang: language }
    });
    return response.data;
  },
  
  refreshInventory: async (language: string = 'pl') => {
    const response = await api.post('/inventory/refresh', null, {
      params: { lang: language }
    });
    return response.data;
  },
};

// Skins API
export const skinsAPI = {
  getSkinPrices: async () => {
    const response = await api.get('/skins/prices');
    return response.data;
  },
  
  getSkinDetails: async (skinId: string) => {
    const response = await api.get(`/skins/${skinId}`);
    return response.data;
  },
};

// Trade History API
export const tradeHistoryAPI = {
  getTradeHistory: async (limit = 10, offset = 0) => {
    try {
      const response = await api.get('/trades/history', {
        params: { limit, offset }
      });
      // Return the data array directly if it's an array, otherwise return empty array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching trade history:', error);
      return [];
    }
  },
  getTradeDetails: async (tradeId: string) => {
    try {
      const response = await api.get(`/trades/${tradeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trade details for ${tradeId}:`, error);
      return null;
    }
  }
};

export default api;
