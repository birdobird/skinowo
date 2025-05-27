import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  dashboardStats: DashboardStats | null;
  fetchDashboardStats: () => Promise<void>;
  error: string | null;
}

export interface DashboardStats {
  totalUsers: number;
  pendingTransactions: number;
  completedTransactions: number;
  openTickets: number;
  totalSalesAmount: number;
  recentTransactions: RecentTransaction[];
  recentTickets: RecentTicket[];
}

export interface RecentTransaction {
  _id: string;
  userId: string;
  username: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  items: {
    name: string;
    image: string;
    ourPrice: number;
  }[];
}

export interface RecentTicket {
  _id: string;
  userId: string;
  username: string;
  subject: string;
  status: 'open' | 'closed';
  createdAt: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // W prawdziwej implementacji byłoby to zapytanie API do sprawdzenia statusu administratora
        // Na potrzeby demonstracji, symulujemy to z timeoutem
        
        // Dla celów demonstracyjnych, zakładamy że użytkownicy z określonymi Steam ID są administratorami
        // W prawdziwej aplikacji byłoby to określane przez backend
        const adminSteamIds = ['76561198123456789']; // Przykładowe Steam ID administratorów
        
        // Ustawiamy status administratora natychmiast, aby uniknąć problemów z odświeżaniem
        const isUserAdmin = adminSteamIds.includes(user.steamId);
        setIsAdmin(isUserAdmin);
        setIsLoading(false);
        
        // Usuwamy timeout, który mógł powodować problemy z odświeżaniem
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
        setIsLoading(false);
        setError('Failed to check admin status');
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it with a timeout and mock data
      setTimeout(() => {
        const mockStats: DashboardStats = {
          totalUsers: 1245,
          pendingTransactions: 18,
          completedTransactions: 3567,
          openTickets: 7,
          totalSalesAmount: 125789.50,
          recentTransactions: [
            {
              _id: '1',
              userId: 'user1',
              username: 'SteamUser123',
              totalAmount: 356.75,
              status: 'pending',
              createdAt: new Date().toISOString(),
              items: [
                { name: 'AWP | Asiimov (FT)', image: '/src/assets/awp.png', ourPrice: 156.75 },
                { name: 'Karambit | Fade (FN)', image: '/src/assets/karambit.png', ourPrice: 200.00 }
              ]
            },
            {
              _id: '2',
              userId: 'user2',
              username: 'GamerPro456',
              totalAmount: 128.50,
              status: 'completed',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              items: [
                { name: 'AK-47 | Redline (FT)', image: '/src/assets/awp.png', ourPrice: 128.50 }
              ]
            },
            {
              _id: '3',
              userId: 'user3',
              username: 'SkinTrader789',
              totalAmount: 432.25,
              status: 'completed',
              createdAt: new Date(Date.now() - 7200000).toISOString(),
              items: [
                { name: 'M4A4 | Howl (MW)', image: '/src/assets/awp.png', ourPrice: 432.25 }
              ]
            },
            {
              _id: '4',
              userId: 'user4',
              username: 'CS2Player',
              totalAmount: 89.99,
              status: 'failed',
              createdAt: new Date(Date.now() - 10800000).toISOString(),
              items: [
                { name: 'USP-S | Kill Confirmed (FN)', image: '/src/assets/awp.png', ourPrice: 89.99 }
              ]
            },
            {
              _id: '5',
              userId: 'user5',
              username: 'SkinsCollector',
              totalAmount: 275.30,
              status: 'pending',
              createdAt: new Date(Date.now() - 14400000).toISOString(),
              items: [
                { name: 'Butterfly Knife | Crimson Web (FT)', image: '/src/assets/karambit.png', ourPrice: 275.30 }
              ]
            }
          ],
          recentTickets: [
            {
              _id: '1',
              userId: 'user1',
              username: 'SteamUser123',
              subject: 'Problem z płatnością',
              status: 'open',
              createdAt: new Date().toISOString()
            },
            {
              _id: '2',
              userId: 'user2',
              username: 'GamerPro456',
              subject: 'Nie otrzymałem pieniędzy',
              status: 'open',
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              _id: '3',
              userId: 'user3',
              username: 'SkinTrader789',
              subject: 'Jak zmienić metodę płatności?',
              status: 'closed',
              createdAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
              _id: '4',
              userId: 'user4',
              username: 'CS2Player',
              subject: 'Błąd przy wysyłaniu skinów',
              status: 'open',
              createdAt: new Date(Date.now() - 10800000).toISOString()
            },
            {
              _id: '5',
              userId: 'user5',
              username: 'SkinsCollector',
              subject: 'Pytanie o prowizję',
              status: 'closed',
              createdAt: new Date(Date.now() - 14400000).toISOString()
            }
          ]
        };
        
        setDashboardStats(mockStats);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch dashboard stats');
      setIsLoading(false);
    }
  };

  const value = {
    isAdmin,
    isLoading,
    dashboardStats,
    fetchDashboardStats,
    error
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContext;
