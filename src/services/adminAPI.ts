import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  // Users
  getUsers: async (page = 1, limit = 20, search = '') => {
    const response = await api.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  getUser: async (id: string | number) => {
    const response = await api.get(`/admin/users/${id}`);
    // Zwracamy obiekt w formacie, jakiego oczekuje komponent UserDetails
    return {
      success: true,
      user: response.data.user || response.data
    };
  },

  // Transactions
  getTransactions: async (page = 1, limit = 20, userId = '') => {
    const response = await api.get('/admin/transactions', {
      params: { page, limit, userId }
    });
    return response.data;
  },

  getTransaction: async (id: string | number) => {
    const response = await api.get(`/admin/transactions/${id}`);
    return response.data;
  },

  // Support Tickets
  getTickets: async (page = 1, limit = 20, status = '') => {
    const response = await api.get('/admin/tickets', {
      params: { page, limit, status: status || undefined }
    });
    return response.data;
  },

  getTicket: async (id: string | number) => {
    const response = await api.get(`/support/ticket/${id}`);
    return response.data.ticket; // Zwracamy tylko obiekt ticket z odpowiedzi
  },

  updateTicketStatus: async (id: string | number, status: string) => {
    const response = await api.put(`/support/ticket/${id}`, { 
      status,
      message: `Status zmieniony na: ${status}` // Wymagane przez backend
    });
    return response.data;
  },

  // Send message to ticket
  sendTicketMessage: async (id: string | number, message: string) => {
    const response = await api.put(`/support/ticket/${id}`, {
      message,
      isAdmin: true
    });
    return response.data;
  },

  // System
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  // Get user tickets
  getUserTickets: async (userId: string | number) => {
    // Używamy istniejącego endpointu do pobierania biletów z filtrem użytkownika
    const response = await api.get('/admin/tickets', {
      params: { userId, limit: 100 } // Ustawiamy wysoki limit, aby pobrać wszystkie zgłoszenia
    });
    
    // Zwracamy listę biletów z odpowiedzi
    return response.data.tickets || response.data.data?.tickets || [];
  }
};

export default adminAPI;
