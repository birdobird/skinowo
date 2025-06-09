import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

interface UserData {
  id?: string | number;
  steamId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isLoggedIn: boolean;
  tradeUrl: string;
  email: string;
  role: string;
  balance: number;
  isAdmin: boolean;
  isVerified: boolean;
}

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUserData: (data: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');
      
      if (accessToken && userData) {
        try {
          // Verify token by getting current user data
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            const currentUserData = response.user;
            
            // Ensure all required fields have default values
            const updatedUserData: UserData = {
              steamId: currentUserData.steamId || '',
              username: currentUserData.username || currentUserData.displayName || 'User',
              displayName: currentUserData.displayName || currentUserData.username || 'User',
              avatarUrl: currentUserData.avatarUrl || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
              isLoggedIn: true,
              tradeUrl: currentUserData.tradeUrl || '',
              email: currentUserData.email || '',
              role: currentUserData.isAdmin ? 'admin' : 'user',
              balance: currentUserData.balance || 0,
              isAdmin: currentUserData.isAdmin || false,
              isVerified: currentUserData.isVerified || false
            };
            
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            setUser(updatedUserData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error verifying authentication:', error);
          // Clear invalid auth data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No auth data found
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData: Partial<UserData>, tokens: { accessToken: string; refreshToken: string }) => {
    // Ensure all required fields have default values
    const completeUserData: UserData = {
      steamId: userData.steamId || '',
      username: userData.username || userData.displayName || 'User',
      displayName: userData.displayName || userData.username || 'User',
      avatarUrl: userData.avatarUrl || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
      isLoggedIn: true,
      tradeUrl: userData.tradeUrl || '',
      email: userData.email || '',
      role: userData.role || 'user',
      balance: userData.balance || 0,
      isAdmin: userData.isAdmin || false,
      isVerified: userData.isVerified || false
    };
    
    localStorage.setItem('userData', JSON.stringify(completeUserData));
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setUser(completeUserData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage regardless of API success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Wylogowano pomyślnie');
    }
  };
  
  const updateUserData = (data: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    updateUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
