import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-toastify';

interface User {
  id: number;
  steamId: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  balance: number;
  isVerified: boolean;
  isAdmin: boolean;
  tradeUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  transactionCount: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 20;

  // Fetch users on component mount and when page/search changes
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await adminAPI.getUsers(
          currentPage, 
          limit, 
          searchTerm
        );

        console.log(response);
        
        // Check if response has data and pagination info
        if (response && response.users && response.pagination) {
          setUsers(response.users);
          setTotalPages(response.pagination.pages || 1);
          setTotalUsers(response.pagination.total || 0);
        } else if (Array.isArray(response)) {
          // Fallback for array response
          setUsers(response);
        } else {
          console.error('Unexpected response format:', response);
          setUsers([]);
          setTotalPages(1);
          setTotalUsers(Array.isArray(response) ? response.length : 0);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Wystąpił błąd podczas pobierania użytkowników');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay for search to prevent too many requests
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nigdy';
    return new Date(dateString).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(balance);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Użytkownicy</h1>
        
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-symbols-outlined text-gray-400"><i className="fa-solid fa-magnifying-glass"></i></span>
          </span>
          <input
            type="text"
            className="bg-[var(--secondaryBgColor)] border border-gray-700 text-white text-sm rounded-lg focus:ring-[var(--btnColor)] focus:border-[var(--btnColor)] block w-full min-w-96 pl-10 p-2.5"
            placeholder="Szukaj po nazwie użytkownika lub Steam ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800 bg-gray-800/30">
                    <th className="px-6 py-3 font-medium text-left">Użytkownik</th>
                    <th className="px-6 py-3 font-medium text-left">Email</th>
                    <th className="px-6 py-3 font-medium text-right">Saldo</th>
                    <th className="px-6 py-3 font-medium text-center">Data rejestracji</th>
                    <th className="px-6 py-3 font-medium text-center">Ostatnie logowanie</th>
                    <th className="px-6 py-3 font-medium text-center">Transakcje</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                    <th className="px-6 py-3 font-medium">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="px-6 py-4">
                        <Link to={`/admin/users/${user.id}`} className="flex items-center space-x-3 group">
                          <img 
                            src={user.avatarUrl || '/default-avatar.png'} 
                            alt={user.displayName} 
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="text-white group-hover:text-[var(--btnColor)] transition-colors">
                              {user.displayName}
                            </span>
                            <span className="text-xs text-gray-400">ID: {user.id}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="text-sm">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.steamId}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {formatBalance(user.balance)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-900/50 text-blue-300">
                          {user.transactionCount} transakcji
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.isAdmin && (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300">
                            Admin
                          </span>
                        )}
                        {user.isVerified && !user.isAdmin && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300">
                            Zweryfikowany
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          to={`/admin/users/${user.id}`}
                          className="text-[var(--btnColor)] hover:underline mr-4"
                        >
                          Szczegóły
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Pokazuje {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalUsers)} z {totalUsers} użytkowników
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--btnColor)] text-black hover:opacity-90'
                  }`}
                >
                  Poprzednia
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-[var(--btnColor)] text-black'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--btnColor)] text-black hover:opacity-90'
                  }`}
                >
                  Następna
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
