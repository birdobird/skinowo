import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface UserDetails {
  _id: string;
  steamId: string;
  username: string;
  avatarUrl: string;
  registrationDate: string;
  lastLogin: string;
  tradeUrl: string;
  email?: string;
  transactions: Transaction[];
  tickets: Ticket[];
  recentSteamIds: string[];
}

interface Transaction {
  _id: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  paymentMethod: string;
  itemsCount: number;
}

interface Ticket {
  _id: string;
  subject: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'tickets'>('profile');

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate it with a timeout and mock data
        setTimeout(() => {
          const mockUser: UserDetails = {
            _id: id || 'user1',
            steamId: '76561198123456789',
            username: 'SteamUser123',
            avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            registrationDate: new Date(Date.now() - 5000000000).toISOString(),
            lastLogin: new Date(Date.now() - 86400000).toISOString(),
            tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=123456&token=abcdef',
            email: 'user@example.com',
            recentSteamIds: ['76561198123456789', '76561198987654321'],
            transactions: Array.from({ length: 5 }, (_, i) => ({
              _id: `transaction${i + 1}`,
              totalAmount: Math.random() * 1000,
              status: ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)] as 'pending' | 'completed' | 'failed',
              createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
              completedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 5000000000).toISOString() : undefined,
              paymentMethod: ['bank', 'paypal', 'skrill', 'crypto'][Math.floor(Math.random() * 4)],
              itemsCount: Math.floor(Math.random() * 5) + 1
            })),
            tickets: Array.from({ length: 3 }, (_, i) => ({
              _id: `ticket${i + 1}`,
              subject: ['Problem z płatnością', 'Nie otrzymałem pieniędzy', 'Jak zmienić metodę płatności?'][i],
              status: Math.random() > 0.5 ? 'open' : 'closed',
              createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
              updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString()
            }))
          };
          
          setUser(mockUser);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Użytkownik nie znaleziony</h2>
        <p className="mt-2 text-gray-400">Nie znaleziono użytkownika o podanym ID.</p>
        <Link to="/admin/users" className="mt-4 inline-block bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg">
          Powrót do listy użytkowników
        </Link>
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
            src={user.avatarUrl} 
            alt={user.username} 
            className="w-24 h-24 rounded-full border-4 border-gray-700"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-400 text-sm">Steam ID: {user.steamId}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">
                Użytkownik
              </span>
              {user.transactions.some(t => t.status === 'completed') && (
                <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">
                  Aktywny klient
                </span>
              )}
              {user.transactions.length > 5 && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded-full text-xs">
                  Stały klient
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              <span className="text-gray-400">Dołączył: </span>
              <span>{formatDate(user.registrationDate)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">Ostatnie logowanie: </span>
              <span>{formatDate(user.lastLogin)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">Transakcje: </span>
              <span>{user.transactions.length}</span>
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
              activeTab === 'profile'
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
            Transakcje ({user.transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'tickets'
                ? 'border-[var(--btnColor)] text-[var(--btnColor)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Zgłoszenia ({user.tickets.length})
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
                  <p>{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Steam ID</p>
                  <p>{user.steamId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p>{user.email || 'Nie podano'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Data rejestracji</p>
                  <p>{formatDate(user.registrationDate)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Ostatnie logowanie</p>
                  <p>{formatDate(user.lastLogin)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Trade URL</p>
                  <p className="truncate">
                    <a 
                      href={user.tradeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--btnColor)] hover:underline"
                    >
                      {user.tradeUrl}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Poprzednie Steam ID</p>
                  <div className="mt-1">
                    {user.recentSteamIds.length > 0 ? (
                      user.recentSteamIds.map((steamId, index) => (
                        <p key={index} className="text-sm">{steamId}</p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">Brak poprzednich Steam ID</p>
                    )}
                  </div>
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
                {user.transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="px-6 py-4 text-sm">#{transaction._id}</td>
                    <td className="px-6 py-4 text-sm">{formatDate(transaction.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-medium">{formatCurrency(transaction.totalAmount)}</td>
                    <td className="px-6 py-4 text-sm capitalize">{transaction.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm">{transaction.itemsCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : transaction.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {transaction.status === 'completed' 
                          ? 'Zakończona' 
                          : transaction.status === 'pending'
                          ? 'Oczekująca'
                          : 'Anulowana'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link 
                        to={`/admin/transactions/${transaction._id}`}
                        className="text-[var(--btnColor)] hover:underline"
                      >
                        Szczegóły
                      </Link>
                    </td>
                  </tr>
                ))}
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
                {user.tickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="px-6 py-4 text-sm">#{ticket._id}</td>
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
                        to={`/admin/tickets/${ticket._id}`}
                        className="text-[var(--btnColor)] hover:underline"
                      >
                        {ticket.status === 'open' ? 'Odpowiedz' : 'Zobacz'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
