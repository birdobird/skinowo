import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-toastify';

interface UserDetails {
  id: number;
  steamId: string;
  displayName: string;
  avatarUrl?: string;
  email?: string;
  balance: number;
  isVerified: boolean;
  isAdmin: boolean;
  tradeUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string | null;
  transactionCount: number;
  transactions: Transaction[];
  tickets: Ticket[];
  recentSteamIds?: string[];
}

interface Transaction {
  id: number;  // Zmienione z _id na id po migracji do SQL
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  paymentMethod: string;
  itemsCount: number;
}

interface Ticket {
  id: number;  // Zmienione z _id na id po migracji do SQL
  subject: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'tickets'>('profile');
  
  const transactions = user?.transactions || [];
  const tickets = user?.tickets || [];
  const recentSteamIds = user?.recentSteamIds || [];
  
  // Obliczanie statystyk
  const completedTransactions = transactions.filter(tx => tx?.status === 'completed').length;
  const pendingTransactions = transactions.filter(tx => tx?.status === 'pending').length;
  const totalSpent = transactions.reduce((sum, tx) => 
    tx?.status === 'completed' ? sum + (tx?.totalAmount || 0) : sum, 0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Pobierz dane użytkownika
        const userResponse = await adminAPI.getUser(id);
        if (!userResponse.success || !userResponse.user) {
          throw new Error('Nie udało się załadować danych użytkownika');
        }
        
        // Pobierz zgłoszenia użytkownika
        const tickets = await adminAPI.getUserTickets(id);
        
        // Sprawdź, czy tickets to tablica, jeśli nie, użyj pustej tablicy
        const userTickets = Array.isArray(tickets) ? tickets : [];
        
        // Zaktualizuj stan użytkownika z pobranymi danymi
        setUser({
          ...userResponse.user,
          tickets: userTickets
        });
        
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error(error instanceof Error ? error.message : 'Wystąpił błąd podczas ładowania danych użytkownika');
        navigate('/admin/users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Brak danych';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Błędna data' : date.toLocaleString('pl-PL');
    } catch (e) {
      console.error('Błąd formatowania daty:', e);
      return 'Błędna data';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: 'pending' | 'completed' | 'failed') => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Nie znaleziono użytkownika</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/users" className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">Szczegóły użytkownika</h1>
        </div>
      </div>

      {/* User Header */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <img 
            src={user.avatarUrl || 'https://via.placeholder.com/150'} 
            alt={`${user.displayName}'s avatar`} 
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/150';
            }}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
            <p className="text-gray-300">Steam ID: {user.steamId || 'Brak danych'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">
                {user.isAdmin ? 'Administrator' : 'Użytkownik'}
              </span>
              {user.transactions?.some(t => t?.status === 'completed') && (
                <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">
                  Aktywny klient
                </span>
              )}
              {user.transactions && user.transactions.length > 5 && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded-full text-xs">
                  Stały klient
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data rejestracji</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ostatnie logowanie</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(user.lastLogin)}</p>
              </div>
            </div>
            <p className="text-sm">
              <span className="text-gray-400">Transakcje: </span>
              <span>{transactions.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'profile' ? true : false
                ? 'border-[var(--btnColor)] text-[var(--btnColor)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'transactions'
                ? 'border-[var(--btnColor)] text-[var(--btnColor)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Transakcje ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'tickets' ? true : false
                ? 'border-[var(--btnColor)] text-[var(--btnColor)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Zgłoszenia ({tickets.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden">
        {activeTab === 'profile' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informacje o profilu</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Nazwa użytkownika</p>
                  <p>{user.displayName}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Steam ID</p>
                  <p>{user.steamId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p>{user.email ?? 'Brak'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Data rejestracji</p>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Ostatnie logowanie</p>
                  <p>{formatDate(user.lastLogin)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Link do wymiany</p>
                  <p className="text-sm text-blue-400 break-all">
                    {user.tradeUrl ? (
                      <a href={user.tradeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {user.tradeUrl}
                      </a>
                    ) : 'Brak'}
                  </p>
                </div>
              </div>
              
              {recentSteamIds.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Poprzednie Steam ID</p>
                    <div className="space-y-1">
                      {recentSteamIds.slice(0, 3).map((steamId, index) => (
                        <p key={index} className="text-sm font-mono">{steamId}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Liczba transakcji</p>
                  <p className="text-white">{transactions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Zakończone transakcje</p>
                  <p className="text-white">{completedTransactions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Oczekujące transakcje</p>
                  <p className="text-white">{pendingTransactions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Wydana kwota</p>
                  <p className="text-white">{formatCurrency(totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800 bg-gray-800/30">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Data</th>
                  <th className="px-6 py-3 font-medium">Kwota</th>
                  <th className="px-6 py-3 font-medium">Metoda płatności</th>
                  <th className="px-6 py-3 font-medium">Przedmioty</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {user.transactions?.length > 0 ? (
                  user.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-sm">#{transaction.id}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(transaction.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-medium">{formatCurrency(transaction.totalAmount)}</td>
                      <td className="px-6 py-4 text-sm capitalize">{transaction.paymentMethod}</td>
                      <td className="px-6 py-4 text-sm">{transaction.itemsCount}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(transaction.status)}`}>
                          {transaction.status === 'completed' ? 'Zakończona' : transaction.status === 'pending' ? 'Oczekująca' : 'Anulowana'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          to={`/admin/transactions/${transaction.id}`}
                          className="text-[var(--btnColor)] hover:underline"
                        >
                          Szczegóły
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                      Brak transakcji
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800 bg-gray-800/30">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Temat</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Data utworzenia</th>
                  <th className="px-6 py-3 font-medium">Ostatnia aktualizacja</th>
                  <th className="px-6 py-3 font-medium">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {user.tickets?.length > 0 ? (
                  user.tickets.map((ticket, index) => (
                    <tr 
                      key={ticket.id ? `ticket-${ticket.id}` : `ticket-${index}`} 
                      className="border-b border-gray-800 hover:bg-gray-800/30"
                    >
                      <td className="px-6 py-4 text-sm">#{ticket.id}</td>
                      <td className="px-6 py-4 text-sm">{ticket.subject}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ticket.status === 'open' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {ticket.status === 'open' ? 'Otwarte' : 'Zamknięte'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatDate(ticket.createdAt)}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(ticket.updatedAt)}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          to={`/admin/tickets/${ticket.id}`}
                          className="text-[var(--btnColor)] hover:underline"
                        >
                          {ticket.status === 'open' ? 'Odpowiedz' : 'Zobacz'}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      Brak zgłoszeń
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
