import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import UserTickets from '../../components/UserTickets';
import { toast } from 'react-toastify';

interface UserData {
  steamId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  tradeUrl: string;
  email: string;
  role: string;
  balance: number;
  isAdmin: boolean;
  isVerified: boolean;
  isLoggedIn: boolean;
}

const Account = () => {
  const { user, logout, updateUserData, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets'>('profile');
  
  // Memoize the current user data with defaults
  const currentUser = useMemo<UserData>(() => ({
    steamId: '',
    username: 'Użytkownik',
    displayName: 'Użytkownik',
    avatarUrl: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    tradeUrl: '',
    email: '',
    role: 'user',
    balance: 0,
    isAdmin: false,
    isVerified: false,
    isLoggedIn: false,
    ...user // This will override defaults with actual user data if available
  }), [user]);
  
  const [tradeUrl, setTradeUrl] = useState(currentUser.tradeUrl);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update tradeUrl when user data changes
  useEffect(() => {
    if (user?.tradeUrl) {
      setTradeUrl(user.tradeUrl);
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSaveTradeUrl = async () => {
    if (!tradeUrl.trim()) {
      toast.error('Wprowadź prawidłowy URL wymiany');
      return;
    }

    setIsSaving(true);
    try {
      // Call API to update trade URL
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user/trade-url`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ tradeUrl })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update user context with new trade URL
        updateUserData({ tradeUrl });
        toast.success('URL wymiany zaktualizowany pomyślnie');
      } else {
        toast.error(data.message || 'Nie udało się zaktualizować URL wymiany');
      }
    } catch (error) {
      console.error('Error updating trade URL:', error);
      toast.error('Nie udało się zaktualizować URL wymiany');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
        </div>
      </div>
    );
  }
  


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Moje konto</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-[var(--secondaryBgColor)] rounded-xl overflow-hidden">
              {/* User Info */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-4">
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.username} 
                    className="w-16 h-16 rounded-full"
                    onError={(e) => {
                      // Fallback to default avatar if image fails to load
                      e.currentTarget.src = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
                    }}
                  />
                  <div>
                    <h2 className="font-bold">{currentUser.displayName || currentUser.username}</h2>
                    {currentUser.steamId && (
                      <p className="text-sm text-gray-400">Steam ID: {currentUser.steamId}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex cursor-pointer items-center ${
                    activeTab === 'profile' 
                      ? 'bg-[var(--btnColor)]/10 text-[var(--btnColor)]' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3"><i className="fa-solid fa-user"></i></span>
                  Profil
                </button>

                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex cursor-pointer items-center ${
                    activeTab === 'tickets' 
                      ? 'bg-[var(--btnColor)]/10 text-[var(--btnColor)]' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3"><i className="fa-solid fa-ticket"></i></span>
                  Zgłoszenia
                </button>

                <button
                  onClick={() => navigate('/inventory')}
                  className="w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center hover:bg-gray-800 text-gray-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined mr-3"><i className="fa-solid fa-money-bill"></i></span>
                  Sprzedaj skiny
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 flex items-center cursor-pointer"
                >
                  <span className="material-symbols-outlined mr-3"><i className="fa-solid fa-right-from-bracket"></i></span>
                  Wyloguj się
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Profil</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nazwa użytkownika</label>
                    <input
                      type="text"
                      value={currentUser.username}
                      readOnly
                      className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-3 text-sm cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-400">Nazwa użytkownika jest pobierana z Twojego konta Steam i nie może być zmieniona.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">URL wymiany Steam</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tradeUrl}
                        onChange={(e) => setTradeUrl(e.target.value)}
                        placeholder="Wprowadź swój URL wymiany Steam"
                        className="flex-1 bg-[var(--bgColor)] border border-gray-700 rounded-lg p-3 text-sm"
                      />
                      <button
                        onClick={handleSaveTradeUrl}
                        disabled={isSaving}
                        className="bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      URL wymiany jest wymagany do handlu skinami. Możesz go znaleźć w swoim profilu Steam &gt; Ekwipunek &gt; Oferty wymiany &gt; Kto może wysyłać mi oferty wymiany? &gt; Strony zewnętrzne.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Konto Steam</label>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.username} 
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.currentTarget.src = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
                        }}
                      />
                      <div>
                        <p className="font-medium">{currentUser.displayName || currentUser.username}</p>
                        <p className="text-sm text-gray-400">Połączone konto Steam</p>
                      </div>
                      <a 
                        href={`https://steamcommunity.com/profiles/${currentUser.steamId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                      >
                        Zobacz profil
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            

            
            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Moje zgłoszenia</h2>
                  <Link 
                    to="/support"
                    className="bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center"
                  >
                    Nowe zgłoszenie
                  </Link>
                </div>
                
                <UserTickets />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
